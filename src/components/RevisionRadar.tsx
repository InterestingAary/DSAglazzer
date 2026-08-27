import React from 'react';
import { motion } from 'framer-motion';
import { RevisionItem } from '../types';

interface RevisionRadarProps {
  items: RevisionItem[];
  onReviewItem: (problemId: string) => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export const RevisionRadar: React.FC<RevisionRadarProps> = ({items, onReviewItem}) => {
  const urgencyCounts = items.reduce((acc, item) => {
    acc[item.urgency] = (acc[item.urgency] || 0) + 1;
    return acc;
  }, {} as Record<'urgent' | 'warning' | 'normal', number>);

  const buckets = [
    { key: 'urgent', label: 'Urgent', color: 'accent-danger', borderClass: 'border-accent-danger/40', bgClass: 'bg-accent-danger/10' },
    { key: 'warning', label: 'Warning', color: 'accent-amber', borderClass: 'border-accent-amber/40', bgClass: 'bg-accent-amber/10' },
    { key: 'normal', label: 'Normal', color: 'accent', borderClass: 'border-accent/30', bgClass: 'bg-accent/10' },
  ];

  return (
    <motion.section
      className="spatial-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="font-heading text-lg font-bold text-text-primary mb-5 gradient-text">
        REVISION RADAR
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {buckets.map((bucket) => (
          <motion.div
            key={bucket.key}
            className={`p-4 rounded-2xl border ${bucket.borderClass} ${bucket.bgClass} transition-all hover:scale-[1.02]`}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-text-primary">{bucket.label}</span>
              <span className={`text-xs font-bold text-${bucket.color}`}>
                {urgencyCounts[bucket.key as keyof typeof urgencyCounts] || 0}
              </span>
            </div>
            <p className="text-[10px] text-text-muted mt-1">Problems needing review</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-glass-border">
        <p className="text-[10px] text-text-muted uppercase tracking-widest mb-3 font-bold">
          Overall Status
        </p>
        <div className="flex gap-2 flex-wrap items-center">
          {items.map((item) => (
            <div
              key={item.id}
              className={`w-3 h-3 rounded-full transition-all hover:scale-125 ${
                item.urgency === 'urgent'
                  ? 'bg-accent-danger shadow-lg shadow-accent-danger/30'
                  : item.urgency === 'warning'
                  ? 'bg-accent-amber shadow-lg shadow-accent-amber/30'
                  : 'bg-accent shadow-lg shadow-accent/30'
              }`}
              title={item.title}
            />
          ))}
          <span className="text-[10px] text-text-muted ml-2 font-mono">
            {items.length} total due
          </span>
        </div>
      </div>
    </motion.section>
  );
};
