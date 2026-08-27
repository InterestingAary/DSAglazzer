import React from 'react';
import { UserStats, UniverseNode } from '../types';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, Award } from 'lucide-react';

interface ProgressAnalyticsProps {
  userStats: UserStats;
  nodes: UniverseNode[];
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ userStats, nodes }) => {
  const totalProblems = userStats.easyTotal + userStats.mediumTotal + userStats.hardTotal;
  const accuracy = userStats.totalAttempts > 0 ? Math.round((userStats.totalSolved / userStats.totalAttempts) * 100) : 0;
  const hasData = userStats.totalSolved > 0 || userStats.totalAttempts > 0;

  return (
    <motion.section
      className="space-y-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2.5">
        <BarChart3 className="w-5 h-5 text-[var(--color-accent)]" />
        <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Progress Analytics</h2>
      </div>

      {!hasData ? (
        /* Empty state */
        <motion.div
          className="card p-10 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-14 h-14 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto mb-4">
            <Target className="w-7 h-7 text-[var(--color-accent)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Start Your Journey</h3>
          <p className="text-sm text-[var(--color-text-muted)] max-w-md mx-auto">
            Solve your first problem to see progress analytics here. Track accuracy, difficulty distribution, and topic mastery over time.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Solved', value: `${userStats.totalSolved}/${totalProblems}`, icon: Target, color: 'var(--color-accent)' },
              { label: 'Accuracy', value: `${accuracy}%`, icon: TrendingUp, color: 'var(--color-accent-emerald)' },
              { label: 'Streak', value: `${userStats.streak}D`, icon: Award, color: 'var(--color-accent-amber)' },
              { label: 'Practice', value: `${Math.round(userStats.totalPracticeMinutes / 60)}h`, icon: BarChart3, color: 'var(--color-text-secondary)' },
            ].map((stat) => (
              <div key={stat.label} className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">{stat.label}</span>
                </div>
                <span className="text-lg font-bold font-mono text-[var(--color-text-primary)]">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Charts grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Accuracy Gauge */}
            <div className="card p-5">
              <h3 className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mb-4 font-semibold">Accuracy</h3>
              <div className="relative h-40 flex items-center justify-center">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border-subtle)" strokeWidth="7" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="url(#gaugeGradient)" strokeWidth="7" strokeLinecap="round" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * accuracy) / 100} className="transition-all duration-700 ease-out" />
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-[var(--color-text-primary)] font-mono">{accuracy}%</span>
                  <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider font-medium mt-0.5">accuracy</span>
                </div>
              </div>
            </div>

            {/* Difficulty Distribution */}
            <div className="card p-5">
              <h3 className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mb-4 font-semibold">Difficulty</h3>
              <div className="space-y-4">
                {[
                  { label: 'Easy', solved: userStats.easySolved, total: userStats.easyTotal, color: 'var(--color-accent-emerald)' },
                  { label: 'Medium', solved: userStats.mediumSolved, total: userStats.mediumTotal, color: 'var(--color-accent-amber)' },
                  { label: 'Hard', solved: userStats.hardSolved, total: userStats.hardTotal, color: 'var(--color-accent-danger)' },
                ].map((d) => (
                  <div key={d.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-[var(--color-text-secondary)]">{d.label}</span>
                      <span className="text-[10px] font-mono text-[var(--color-text-muted)]">{d.solved}/{d.total}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--color-surface-elevated)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${d.total > 0 ? (d.solved / d.total) * 100 : 0}%`,
                          background: d.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Topic Mastery */}
            <div className="card p-5">
              <h3 className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mb-4 font-semibold">Topic Mastery</h3>
              <div className="space-y-3">
                {nodes.slice(0, 8).map((node) => (
                  <div key={node.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">{node.topic}</span>
                      <span className="text-[10px] font-mono text-[var(--color-text-muted)]">{Math.round(node.progress)}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[var(--color-surface-elevated)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${node.progress}%`,
                          background: node.progress > 70
                            ? 'var(--color-accent-emerald)'
                            : node.progress > 40
                            ? 'var(--color-accent-amber)'
                            : 'var(--color-accent)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </motion.section>
  );
};
