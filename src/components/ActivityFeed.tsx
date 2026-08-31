import React from 'react';
import { motion } from 'framer-motion';
import { ActivityItem } from '../types';
import { CheckCircle2, AlertCircle, Award, RotateCcw, Zap } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityItem[];
  onSelectProblemById: (problemId: string) => void;
}

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, onSelectProblemById }) => {
  return (
    <motion.section
      className="card p-5 flex flex-col gap-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Activity</h3>
        <span className="text-[10px] font-mono text-[var(--color-accent-emerald)] font-semibold">LIVE</span>
      </div>

      <div className="flex flex-col gap-1">
        {activities.length === 0 && (
          <p className="text-[var(--color-text-muted)] text-xs text-center py-4">No activity yet. Solve a problem to get started.</p>
        )}
        {activities.map((item) => {
          const isSolved = item.type === 'solved';
          const isAttempted = item.type === 'attempted';
          const isRevision = item.type === 'revision';

          return (
            <motion.div
              key={item.id}
              onClick={() => item.problemId && onSelectProblemById(item.problemId)}
              className={`flex items-start gap-2.5 p-2 rounded-md transition-colors ${
                item.problemId ? 'hover:bg-[var(--color-surface-elevated)] cursor-pointer' : ''
              }`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mt-0.5 shrink-0">
                {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent-emerald)]" />}
                {isAttempted && <AlertCircle className="w-3.5 h-3.5 text-[var(--color-accent-amber)]" />}
                {item.type === 'badge' && <Award className="w-3.5 h-3.5 text-[var(--color-accent-amber)]" />}
                {isRevision && <RotateCcw className="w-3.5 h-3.5 text-[var(--color-accent)]" />}
                {item.type === 'streak' && <Zap className="w-3.5 h-3.5 text-[var(--color-accent-emerald)]" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-[var(--color-text-primary)] truncate">
                  {item.title}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] line-clamp-1 mt-0.5">{item.detail}</p>
                <span className="font-mono text-[9px] text-[var(--color-text-muted)] block mt-0.5">{timeAgo(item.timestamp)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};