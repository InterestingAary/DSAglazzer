import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  CheckCircle2,
  Sparkles,
  XCircle
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import Heatmap from '../components/Heatmap';
import ShaderBackground from '../components/ShaderBackground';
import ProgressRing from '../components/ProgressRing';
import Reveal from '../components/Reveal';
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
  const { questions, stats, notificationPermission } = useDatabase();
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

  const activeIdx = useMemo(() => {
    const withDue = topics.findIndex(t => t.due > 0);
    if (withDue >= 0) return withDue;
    const partial = topics.findIndex(t => t.pct > 0 && t.pct < 100);
    return partial >= 0 ? partial : Math.min(2, Math.max(0, topics.length - 1));
  }, [topics]);

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
          {/* Hero */}
          <Reveal>
            <section className="relative overflow-hidden rounded-lg border border-white/10 bg-[var(--bg-card)] p-6 md:p-8">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/[0.07] to-transparent" aria-hidden="true" />
              <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <h1 className="font-display text-3xl md:text-[2.6rem] font-bold leading-tight tracking-tight text-zinc-950 dark:text-[#e7e0ed]">
                    {greeting()}, Aaryan.
                  </h1>
                  <p className="mt-1.5 text-sm text-zinc-600 dark:text-[#cbc3d7]">
                    Keep solving. Your next breakthrough is one problem away.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs text-zinc-700 dark:text-[#cbc3d7]">
                    {[`${stats.currentStreak} Day Streak`, `${weekCount} Problems This Week`, `${completion.pct}% Revision Accuracy`, `${stats.overdueCount} Overdue`].map(chip => (
                      <span key={chip} className="rounded-full border border-white/10 bg-black/5 dark:bg-white/[0.04] px-3 py-1">{chip}</span>
                    ))}
                  </div>
                  {dueTotal > 0 && (
                    <Button variant="primary" onClick={() => navigate('/today')} className="mt-5 group">
                      Start Revising ({dueTotal} due)
                      <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  )}
                </div>
                <div className="shrink-0 self-center">
                  <ProgressRing percent={completion.pct} />
                  <p className="mt-2 text-center font-mono text-xs text-zinc-500 dark:text-[#958ea0]">
                    {stats.totalRevisionsCompleted} revisions cleared
                  </p>
                </div>
              </div>
            </section>
          </Reveal>

          {/* DSA Universe */}
          <Reveal delay={0.06}>
            <section className="group relative flex min-h-[400px] flex-col overflow-hidden rounded-lg border border-white/10">
              <ShaderBackground className="absolute inset-0 opacity-60 mix-blend-screen transition-opacity duration-500 group-hover:opacity-90" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg-app)] via-transparent to-[var(--bg-app)]/40" aria-hidden="true" />
              <header className="relative z-10 flex items-center justify-between border-b border-white/10 bg-black/30 px-4 py-3 backdrop-blur-md">
                <h2 className="font-display text-xl font-semibold tracking-tight text-zinc-100">Your DSA Universe</h2>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/questions')}
                  className="border-brand-500/50 !bg-brand-500/15 !text-brand-300 shadow-[0_0_12px_rgba(160,120,255,0.18)] hover:!bg-brand-500/25"
                >
                  Explore Practice
                </Button>
              </header>
              <div className="relative z-10 flex flex-grow items-center justify-center p-6">
                {topics.length > 0 ? (
                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
                    {topics.map((t, i) => {
                      const active = i === activeIdx;
                      const dim = t.pct === 0 && !active;
                      return (
                        <React.Fragment key={t.name}>
                          {i > 0 && <span className="hidden h-px w-7 bg-white/20 sm:block" aria-hidden="true" />}
                          <div className="relative flex flex-col items-center gap-2">
                            {active && <span className="absolute inset-x-2 top-2 aspect-square rounded-full bg-brand-500/30 blur-lg animate-pulse-subtle" aria-hidden="true" />}
                            <div
                              className={`relative z-10 flex items-center justify-center rounded-full border font-mono bg-black/70 ${
                                active
                                  ? 'h-16 w-16 border-2 border-brand-300 text-brand-200 text-sm shadow-[0_0_22px_rgba(160,120,255,0.45)]'
                                  : dim
                                    ? 'h-12 w-12 border-white/15 text-zinc-500'
                                    : 'h-12 w-12 border-brand-500/60 text-brand-300 shadow-[0_0_14px_rgba(160,120,255,0.15)]'
                              }`}
                            >
                              {t.pct}%
                            </div>
                            <span className={`font-mono text-xs ${active ? 'font-bold text-brand-300' : dim ? 'text-zinc-600' : 'text-zinc-400'}`}>{t.name}</span>
                            {active && (
                              <button
                                onClick={() => navigate(t.due > 0 ? '/today' : '/questions')}
                                className="absolute top-full mt-2 whitespace-nowrap rounded bg-brand-300 px-3 py-1 text-xs font-bold text-brand-950 hover:bg-brand-200 cursor-pointer"
                              >
                                Continue Practice
                              </button>
                            )}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Sparkles size={26} className="text-brand-300" />
                    <p className="font-display text-lg font-semibold text-zinc-200">Your universe is empty</p>
                    <Button variant="primary" size="sm" onClick={() => navigate('/questions')}>Add your first problem</Button>
                  </div>
                )}
              </div>
            </section>
          </Reveal>
        </div>

        {/* ── Right column 25% ── */}
        <aside className="lg:col-span-3 flex flex-col gap-6">
          {/* Recent Activity */}
          <Reveal delay={0.08}>
            <section className="rounded-lg border border-white/10 bg-[var(--bg-card)] p-4">
              <h3 className="border-b border-white/10 pb-2 font-display text-base font-semibold tracking-tight text-zinc-900 dark:text-[#e7e0ed]">
                Recent Activity
              </h3>
              <div className="mt-3 flex flex-col gap-3">
                {feed.length > 0 ? feed.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {f.kind === 'done' && <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500 dark:text-[#34d399]" />}
                    {f.kind === 'fail' && <XCircle size={15} className="mt-0.5 shrink-0 text-rose-500 dark:text-[#ffb4ab]" />}
                    {f.kind === 'award' && <Award size={15} className="mt-0.5 shrink-0 text-[var(--tertiary)]" />}
                    <div className="min-w-0">
                      <p className="truncate text-sm text-zinc-800 dark:text-[#e7e0ed]">
                        {f.kind === 'done' ? 'Cleared revision — ' : f.kind === 'fail' ? 'Postponed — ' : 'Unlocked '}
                        <span className="font-mono text-xs">{f.name}</span>
                      </p>
                      <span className="font-mono text-[10px] text-zinc-500 dark:text-[#958ea0]">{fmtAgo(f.at)}</span>
                    </div>
                  </div>
                )) : (
                  <p className="py-4 text-center font-mono text-xs text-zinc-500 dark:text-[#958ea0]">
                    No activity logged yet.
                  </p>
                )}
              </div>
            </section>
          </Reveal>

          {/* Revision Radar */}
          <Reveal delay={0.12}>
            <section className="rounded-lg border border-white/10 bg-[var(--bg-card)] p-4">
              <h3 className="border-b border-white/10 pb-2 font-display text-base font-semibold tracking-tight text-zinc-900 dark:text-[#e7e0ed]">
                Revision Radar
              </h3>
              <div className="mt-2 flex flex-col">
                {radar.length > 0 ? radar.map((r, i) => (
                  <div key={i} className={`flex items-center justify-between py-1.5 ${r.urgent ? '' : 'opacity-50'}`}>
                    <span className={`inline-flex items-center gap-1.5 font-mono text-xs ${r.urgent ? 'text-rose-600 dark:text-[#ffb4ab]' : 'text-emerald-600 dark:text-[#34d399]'}`}>
                      {r.urgent ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />} {r.topic}
                    </span>
                    <span className="font-mono text-xs text-zinc-500 dark:text-[#958ea0]">{r.label}</span>
                  </div>
                )) : (
                  <p className="py-4 text-center font-mono text-xs text-zinc-500 dark:text-[#958ea0]">Radar clear.</p>
                )}
              </div>
              <div className="mt-3 border-t border-white/10 pt-3">
                <Badge variant="default" className="w-full justify-center">
                  {notificationPermission === 'granted' ? 'Notifications ON' : 'Notifications off'}
                </Badge>
              </div>
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