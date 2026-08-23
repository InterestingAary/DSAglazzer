import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Award,
  Check,
  CheckCircle2,
  RotateCw
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { Button } from '../components/ui/Button';
import Heatmap from '../components/Heatmap';
import ShaderBackground from '../components/ShaderBackground';
import ProgressRing from '../components/ProgressRing';
import Reveal from '../components/Reveal';
import UniverseMap from '../components/UniverseMap';
import type { Question } from '../types';
import { getTodayDateString } from '../utils/dateUtils';

const fmtAgo = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'just now';
  const m = s / 60; if (m < 60) return `${Math.floor(m)}m ago`;
  const h = m / 60; if (h < 24) return `${Math.floor(h)}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 5) return 'Burning the midnight oil';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

type FeedItem = { kind: 'done' | 'fail' | 'award'; name: string; at: string };
type RadarRow = { topic: string; label: string; urgent: boolean };

export const Dashboard: React.FC = () => {
  const { questions, stats } = useDatabase();
  const navigate = useNavigate();
  const todayStr = getTodayDateString();

  /* ── Hero metrics ─────────────────────────────────────── */
  const completion = useMemo(() => {
    let total = 0, done = 0;
    questions.forEach(q => q.revisions.forEach(r => { total++; if (r.status === 'completed') done++; }));
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [questions]);

  const weekCount = useMemo(
    () => questions.filter(q => (Date.now() - new Date(q.solvedDate).getTime()) / 86400000 <= 7).length,
    [questions]
  );

  /* ── DSA Universe topic nodes ─────────────────────────── */
  const topics = useMemo(() => {
    const map = new Map<string, { count: number; done: number; total: number; due: number }>();
    questions.forEach((q: Question) => {
      const t = map.get(q.topic) || { count: 0, done: 0, total: 0, due: 0 };
      t.count++;
      q.revisions.forEach(r => {
        t.total++;
        if (r.status === 'completed') t.done++;
        else {
          if (r.dueDate <= todayStr) t.due++;
        }
      });
      map.set(q.topic, t);
    });
    return [...map.entries()]
      .map(([name, v]) => ({ name, ...v, pct: v.total ? Math.round((v.done / v.total) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [questions, todayStr]);

  /* ── Recent activity feed ─────────────────────────────── */
  const feed = useMemo<FeedItem[]>(() => {
    const items: FeedItem[] = [];
    questions.forEach(q => q.revisions.forEach(r => {
      if (r.status === 'completed' && r.revisedAt) items.push({ kind: 'done', name: q.name, at: r.revisedAt });
      else if (r.status === 'skipped' && r.revisedAt) items.push({ kind: 'fail', name: q.name, at: r.revisedAt });
    }));
    return items.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 5);
  }, [questions]);

  /* ── Revision radar ───────────────────────────────────── */
  const radar = useMemo<RadarRow[]>(() => {
    const pending = questions
      .flatMap(q => q.revisions.filter(r => r.status === 'pending' || r.status === 'overdue').map(r => ({ topic: q.topic, due: r.dueDate })))
      .sort((a, b) => a.due.localeCompare(b.due))
      .slice(0, 3)
      .map<RadarRow>(({ topic, due }) => ({
        topic,
        label: due < todayStr ? `${Math.round((Date.now() - new Date(due).getTime()) / 86400000)}d overdue` : due === todayStr ? 'Due today' : fmtAgo(due + 'T00:00:00').replace(' ago', ''),
        urgent: true,
      }));
    const lastDone = questions
      .flatMap(q => q.revisions.filter(r => r.status === 'completed' && r.revisedAt).map(r => ({ topic: q.topic, at: r.revisedAt! })))
      .sort((a, b) => b.at.localeCompare(a.at))[0];
    const rows: RadarRow[] = pending;
    if (lastDone) rows.push({ topic: lastDone.topic, label: `cleared ${fmtAgo(lastDone.at)}`, urgent: false });
    return rows;
  }, [questions, todayStr]);

  const dueTotal = stats.dueTodayCount + stats.overdueCount;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left column 75% ── */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          {/* Hero — ALGO_ELITE precision (private ds) with live data */}
          <Reveal>
            <section className="relative overflow-hidden rounded-lg border border-white/10 bg-[#0c0c0c] dark:bg-[#0c0c0c] p-6 sm:p-8">
              <ShaderBackground className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none" intensity={0.35} />
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="flex flex-col gap-4 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-emerald-400 font-mono text-xs tracking-wider uppercase font-bold">{greeting()}, Aaryan • Session Active</span>
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-[0.9] text-[#f5f5f5]">
                    ALGORITHMIC<br /><span className="text-brand-300">MASTERY</span> & SYSTEM RECALL
                  </h1>
                  <p className="text-sm text-zinc-400 max-w-lg leading-relaxed">Crafting high-performance intuition with clean invariants, optimal complexity, and disciplined spaced recall. {dueTotal > 0 ? `${dueTotal} revisions due —` : 'No due revisions —'} keep the streak alive.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-white/10">
                    <div className="flex flex-col"><span className="text-2xl font-black text-white">{stats.currentStreak}D</span><span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Day Streak</span></div>
                    <div className="flex flex-col"><span className="text-2xl font-black text-emerald-400">{weekCount}</span><span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Solved / Wk</span></div>
                    <div className="flex flex-col"><span className="text-2xl font-black text-white">{completion.pct}%</span><span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Accuracy</span></div>
                    <div className="flex flex-col"><span className="text-2xl font-black text-white">{Math.round(stats.totalRevisionsCompleted * 0.35 + stats.solvedCount * 0.5)}h</span><span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Practice</span></div>
                  </div>
                  {dueTotal > 0 && (<Button variant="primary" onClick={() => navigate('/today')} className="mt-2 w-fit group bg-emerald-500 text-[#042f2e] hover:bg-emerald-400">Start Revising ({dueTotal} due) <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" /></Button>)}
                </div>
                <div className="shrink-0 flex items-center justify-center self-center lg:self-auto p-4 bg-[#161616] border border-white/10">
                  <ProgressRing percent={completion.pct} size={128} />
                </div>
              </div>
            </section>
          </Reveal>

          {/* DSA Universe — perfect private ds copy */}
          <Reveal delay={0.06}>
            <UniverseMap
              topics={topics}
              onSelectTopic={(name) => {
                const q = questions.find((qq) => qq.topic.toLowerCase() === name.toLowerCase());
                if (q) navigate(`/questions`); else navigate('/calendar');
              }}
              onExploreRoadmap={() => navigate('/calendar')}
            />
          </Reveal>
        </div>

        {/* ── Right column 25% ── */}
        <aside className="lg:col-span-3 flex flex-col gap-6">
          {/* Recent Activity — perfect private ds copy */}
          <Reveal delay={0.08}>
            <section className="border border-[#ffffff15] bg-[#0c0c0c] p-5 sm:p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                <h3 className="font-heading text-base font-black uppercase tracking-tight text-[#f5f5f5]">RECENT TELEMETRY</h3>
                <span className="text-[10px] font-mono text-[#10b981] font-bold uppercase tracking-widest">LIVE</span>
              </div>
              <div className="flex flex-col gap-2">
                {feed.length > 0 ? feed.map((f, i) => {
                  const isSolved = f.kind === 'done';
                  const isFailed = f.kind === 'fail';
                  return (
                    <div
                      key={i}
                      onClick={() => navigate('/questions')}
                      className={`flex items-start gap-3 p-2.5 border border-transparent transition-all hover:bg-[#161616] hover:border-[#27272a] cursor-pointer group ${isFailed ? 'opacity-85' : ''}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isSolved && <CheckCircle2 className="w-4 h-4 text-[#10b981]" />}
                        {isFailed && <AlertCircle className="w-4 h-4 text-[#ef4444]" />}
                        {!isSolved && !isFailed && <Award className="w-4 h-4 text-[#ffb869]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold uppercase tracking-tight text-[#f5f5f5] truncate group-hover:text-[#10b981] transition-colors">{f.name}</p>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#71717a] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                        <p className="text-[11px] text-[#a1a1aa] line-clamp-1 mt-0.5">{isSolved ? 'Cleared revision' : isFailed ? 'Postponed' : 'Activity'} • {f.name}</p>
                        <span className="font-mono text-[10px] uppercase text-[#71717a] block mt-1">{fmtAgo(f.at)}</span>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="py-6 text-center font-mono text-xs text-[#71717a]">No telemetry yet.</p>
                )}
              </div>
            </section>
          </Reveal>

          {/* Revision Radar — perfect private ds copy */}
          <Reveal delay={0.12}>
            <section className="border border-[#ffffff15] bg-[#0c0c0c] p-5 sm:p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                <div className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-[#10b981]" />
                  <h3 className="font-heading text-base font-black uppercase tracking-tight text-[#f5f5f5]">REVISION RADAR</h3>
                </div>
                <button onClick={() => navigate('/today')} className="text-xs font-mono font-bold uppercase tracking-wider text-[#10b981] hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                  <span>All</span><ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-col divide-y divide-[#27272a]">
                {radar.length > 0 ? radar.map((r, i) => {
                  const isUrgent = r.urgent;
                  return (
                    <div
                      key={i}
                      onClick={() => navigate('/today')}
                      className="py-3 flex items-center justify-between hover:bg-[#161616] px-2 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        {isUrgent ? <AlertTriangle className="w-4 h-4 text-[#ef4444] shrink-0" /> : <Check className="w-4 h-4 text-[#10b981] shrink-0" />}
                        <div className="flex flex-col">
                          <span className={`font-mono text-xs font-bold uppercase group-hover:text-[#10b981] transition-colors ${isUrgent ? 'text-[#ef4444]' : 'text-[#f5f5f5]'}`}>{r.topic}</span>
                          <span className="text-[10px] text-[#71717a] font-mono uppercase tracking-wider">{r.topic}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-mono text-[10px] uppercase text-[#71717a]">{r.label}</span>
                        <div className="w-14 h-1.5 bg-[#27272a] mt-1.5 overflow-hidden">
                          <div className={`h-full ${isUrgent ? 'bg-[#ef4444]' : 'bg-[#10b981]'}`} style={{ width: isUrgent ? '32%' : '78%' }} />
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="py-6 text-center font-mono text-xs text-[#71717a]">Radar clear.</p>
                )}
              </div>
              <button onClick={() => navigate('/today')} className="w-full mt-2 py-2.5 bg-[#161616] hover:bg-[#10b981] hover:text-black border border-[#27272a] text-xs font-heading font-black uppercase tracking-wider text-[#f5f5f5] transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <span>Launch Spaced Repetition SRS</span>
              </button>
            </section>
          </Reveal>
        </aside>
      </div>

      {/* Activity heatmap (preserved feature, full width) */}
      <Reveal delay={0.1}>
        <section className="rounded-lg border border-white/10 bg-[var(--bg-card)]">
          <Heatmap questions={questions} />
        </section>
      </Reveal>
    </div>
  );
};
export default Dashboard;