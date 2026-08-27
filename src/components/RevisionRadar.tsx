import React from 'react';
import { motion } from 'framer-motion';
import { RevisionItem } from '../types';
import { getUrgency } from '../utils/spacedRepetition';
import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';

interface RevisionRadarProps {
  items: RevisionItem[];
  onReviewItem: (problemId: string) => void;
}

export const RevisionRadar: React.FC<RevisionRadarProps> = ({ items, onReviewItem }) => {
  const urgencyCounts = items.reduce((acc, item) => {
    const u = getUrgency(item.nextReview);
    acc[u] = (acc[u] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const buckets = [
    { key: 'overdue', label: 'Overdue', count: urgencyCounts['overdue'] || 0, icon: AlertTriangle, color: 'var(--color-accent-danger)', bgClass: 'bg-[var(--color-accent-danger)]/10 border-[var(--color-accent-danger)]/20' },
    { key: 'due', label: 'Due Now', count: urgencyCounts['due'] || 0, icon: Clock, color: 'var(--color-accent-amber)', bgClass: 'bg-[var(--color-accent-amber)]/10 border-[var(--color-accent-amber)]/20' },
    { key: 'upcoming', label: 'Upcoming', count: urgencyCounts['upcoming'] || 0, icon: Clock, color: 'var(--color-accent)', bgClass: 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/20' },
  ];

  return (
    <motion.section
      className="card p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Revision Radar</h2>
        <span className="text-[10px] font-mono text-[var(--color-text-muted)]">{items.length} items</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {buckets.map((bucket) => (
          <div
            key={bucket.key}
            className={`p-3 rounded-lg border ${bucket.bgClass} transition-all`}
          >
            <div className="flex items-center justify-between">
              <bucket.icon className="w-3.5 h-3.5" style={{ color: bucket.color }} />
              <span className="text-sm font-bold font-mono" style={{ color: bucket.color }}>
                {bucket.count}
              </span>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5 font-medium">{bucket.label}</p>
          </div>
        ))}
      </div>

      {/* Urgency dots */}
      <div className="pt-3 border-t border-[var(--color-border-subtle)]">
        <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-semibold">Status</p>
        <div className="flex gap-1.5 flex-wrap items-center">
          {items.length === 0 && (
            <span className="text-[10px] text-[var(--color-text-muted)] font-mono">No reviews scheduled</span>
          )}
          {items.slice(0, 16).map((item) => {
            const u = getUrgency(item.nextReview);
            const dotColor = u === 'overdue' || u === 'due'
              ? 'bg-[var(--color-accent-danger)]'
              : u === 'upcoming'
              ? 'bg-[var(--color-accent-amber)]'
              : 'bg-[var(--color-accent)]';
            return (
              <div
                key={item.id}
                className={`w-2.5 h-2.5 rounded-full ${dotColor} transition-all hover:scale-125 cursor-pointer`}
                title={`${item.title} — ${u}`}
                onClick={() => onReviewItem(item.problemId)}
              />
            );
          })}
          {items.length > 16 && <span className="text-[10px] text-[var(--color-text-muted)] font-mono">+{items.length - 16}</span>}
        </div>
      </div>
    </motion.section>
  );
};
