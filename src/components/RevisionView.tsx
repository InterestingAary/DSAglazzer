import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RevisionItem } from '../types';

interface RevisionViewProps {
  items: RevisionItem[];
  onReviewProblem: (problemId: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export const RevisionView: React.FC<RevisionViewProps> = ({items, onReviewProblem}) => {
  const [activeRatings, setActiveRatings] = useState<Record<string, string>>({});

  const handleRating = (itemId: string, rating: string) => {
    setActiveRatings(prev => ({ ...prev, [itemId]: rating }));
  };

  return (
    <motion.section
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="font-heading text-xl font-bold text-text-primary gradient-text"
        variants={cardVariants}
      >
        SPACED REPETITION
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        {items.map((item) => {
          const activeRating = activeRatings[item.id] || 'again';
          return (
            <motion.div
              key={item.id}
              className={`spatial-card p-5 ${
                item.urgency === 'urgent'
                  ? 'border-accent-danger/30'
                  : item.urgency === 'warning'
                  ? 'border-accent-amber/30'
                  : ''
              }`}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.urgency === 'urgent'
                    ? 'bg-accent-danger/20 text-accent-danger'
                    : item.urgency === 'warning'
                    ? 'bg-accent-amber/20 text-accent-amber'
                    : 'bg-accent/20 text-accent'
                }`}>
                  <span className="font-bold text-xs">{item.urgency === 'urgent' ? '!' : item.urgency === 'warning' ? '!!' : '○'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-text-primary text-sm">{item.title}</h4>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1 font-mono">
                    {item.daysAgo}d ago • {Math.round(item.retention * 100)}% retention
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-glass-border">
                <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2 font-bold">
                  Review Schedule
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { key: 'again', label: 'Again', interval: '1d' },
                    { key: 'hard', label: 'Hard', interval: '3d' },
                    { key: 'good', label: 'Good', interval: '7d' },
                    { key: 'mastered', label: 'Mastered', interval: '14d' },
                  ].map((rating) => (
                    <button
                      key={rating.key}
                      onClick={() => handleRating(item.id, rating.key)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] uppercase font-bold transition-all cursor-pointer ${
                        activeRating === rating.key
                          ? 'bg-accent text-white shadow-lg shadow-accent/20'
                          : 'glass-surface text-text-secondary hover:text-text-primary hover:bg-glass-bg'
                      }`}
                    >
                      {rating.label} ({rating.interval})
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
};
