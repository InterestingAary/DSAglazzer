import React, { useState } from 'react';
import {
  BarChart3,
  Award,
  Calendar,
  Layers,
} from 'lucide-react';
import { initialUserStats, universeNodes } from '../data/mockData';

export const ProgressAnalytics: React.FC = () => {
  const stats = initialUserStats;

  // Generate 52 weeks (364 days) of realistic heatmap data with active streak
  const generateHeatmap = () => {
    const days = [];
    const totalDays = 52 * 7;
    for (let i = 0; i < totalDays; i++) {
      // Recent days have higher frequency
      const isRecent = i > totalDays - 20;
      let level = 0;
      const rand = Math.random();
      if (isRecent) {
        level = rand > 0.15 ? Math.floor(Math.random() * 3) + 2 : 1;
      } else {
        if (rand > 0.8) level = 4;
        else if (rand > 0.6) level = 3;
        else if (rand > 0.4) level = 2;
        else if (rand > 0.25) level = 1;
        else level = 0;
      }
      days.push({ dayIndex: i, count: level * 2, level });
    }
    return days;
  };

  const [heatmapData] = useState(generateHeatmap);
  const [hoveredDay, setHoveredDay] = useState<{ dayIndex: number; count: number } | null>(null);

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 4:
        return 'bg-[#10b981]';
      case 3:
        return 'bg-[#059669]';
      case 2:
        return 'bg-[#047857]';
      case 1:
        return 'bg-[#064e3b]';
      default:
        return 'bg-[#161616]';
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#0c0c0c] border border-[#27272a] rounded-xl">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#10b981]" />
            <span>Algorithmic Telemetry & Competency Matrix</span>
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Longitudinal solve velocity, difficulty distribution, and domain retention indexes.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 bg-[#161616] border border-[#27272a] rounded flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pip" />
            <span className="text-white font-bold">{stats.rating} ELO</span>
          </div>
          <div className="px-3 py-1.5 bg-[#161616] border border-[#27272a] rounded text-zinc-300">
            {stats.rank}
          </div>
        </div>
      </div>

      {/* ── 52-Week GitHub Style Heatmap ───────────────────── */}
      <div className="p-5 sm:p-6 bg-[#0c0c0c] border border-[#27272a] rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#10b981]" />
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
              Annual Solve Contribution Heatmap
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {stats.totalSolved} submissions in the last year
          </span>
        </div>

        {/* The Grid Container */}
        <div className="overflow-x-auto pb-2">
          <div
            className="grid grid-rows-7 grid-flow-col gap-1 w-max"
            style={{ minWidth: '700px' }}
          >
            {heatmapData.map((d, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredDay(d)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`w-3 h-3 rounded-[2px] transition-all cursor-pointer hover:scale-125 ${getHeatmapColor(
                  d.level
                )}`}
                title={`Day ${idx + 1}: ${d.count} algorithmic reviews`}
              />
            ))}
          </div>
        </div>

        {/* Heatmap Footer Legend */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-[#27272a]">
          <span>
            {hoveredDay
              ? `${hoveredDay.count} submissions logged on day ${hoveredDay.dayIndex + 1}`
              : 'Hover over cells to inspect daily logs'}
          </span>
          <div className="flex items-center gap-1.5">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-[2px] bg-[#161616]" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-[#064e3b]" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-[#047857]" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-[#059669]" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-[#10b981]" />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* ── Two-Column Breakdown: Difficulty Ratios & Domain Competency ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Difficulty Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-[#0c0c0c] border border-[#27272a] rounded-xl space-y-6">
          <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-[#ffb869]" />
            <span>Difficulty Breakdown</span>
          </h3>

          <div className="space-y-4 font-mono text-xs">
            {/* Easy */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#10b981] font-bold">Easy</span>
                <span className="text-white font-bold">
                  {stats.easySolved} / {stats.easyTotal}{' '}
                  <span className="text-zinc-500 font-normal">
                    ({Math.round((stats.easySolved / stats.easyTotal) * 100)}%)
                  </span>
                </span>
              </div>
              <div className="w-full h-2 bg-[#1f1f23] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10b981] rounded-full"
                  style={{ width: `${(stats.easySolved / stats.easyTotal) * 100}%` }}
                />
              </div>
            </div>

            {/* Medium */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#ffb869] font-bold">Medium</span>
                <span className="text-white font-bold">
                  {stats.mediumSolved} / {stats.mediumTotal}{' '}
                  <span className="text-zinc-500 font-normal">
                    ({Math.round((stats.mediumSolved / stats.mediumTotal) * 100)}%)
                  </span>
                </span>
              </div>
              <div className="w-full h-2 bg-[#1f1f23] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ffb869] rounded-full"
                  style={{ width: `${(stats.mediumSolved / stats.mediumTotal) * 100}%` }}
                />
              </div>
            </div>

            {/* Hard */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#ef4444] font-bold">Hard</span>
                <span className="text-white font-bold">
                  {stats.hardSolved} / {stats.hardTotal}{' '}
                  <span className="text-zinc-500 font-normal">
                    ({Math.round((stats.hardSolved / stats.hardTotal) * 100)}%)
                  </span>
                </span>
              </div>
              <div className="w-full h-2 bg-[#1f1f23] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ef4444] rounded-full"
                  style={{ width: `${(stats.hardSolved / stats.hardTotal) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-[#121212] border border-[#27272a] rounded-lg font-mono text-xs space-y-2 text-zinc-300">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Global Mastery:</span>
              <span className="text-[#10b981] font-bold">
                {Math.round((stats.totalSolved / stats.totalProblems) * 100)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">First-Pass Accuracy:</span>
              <span className="text-white font-bold">{stats.accuracy}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Total Practice Logged:</span>
              <span className="text-white font-bold">{stats.totalPracticeHours} Hours</span>
            </div>
          </div>
        </div>

        {/* Domain Competency Matrix (7 cols) */}
        <div className="lg:col-span-7 p-5 bg-[#0c0c0c] border border-[#27272a] rounded-xl space-y-4">
          <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#10b981]" />
            <span>Domain Competency Matrix</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {universeNodes.map((node) => (
              <div key={node.id} className="p-2.5 bg-[#121212] border border-[#27272a] rounded-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white font-bold">{node.topic}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500">
                      {node.solvedProblems} / {node.totalProblems}
                    </span>
                    <span
                      className={`font-bold ${
                        node.progress >= 75
                          ? 'text-[#10b981]'
                          : node.progress >= 50
                          ? 'text-[#ffb869]'
                          : 'text-zinc-400'
                      }`}
                    >
                      {node.progress}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#1f1f23] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      node.progress >= 75
                        ? 'bg-[#10b981]'
                        : node.progress >= 50
                        ? 'bg-[#ffb869]'
                        : 'bg-zinc-500'
                    }`}
                    style={{ width: `${node.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
