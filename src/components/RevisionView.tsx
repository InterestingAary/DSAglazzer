import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RevisionItem } from '../types';
import { useApp } from '../context/AppContext';
import { getUrgency } from '../utils/spacedRepetition';

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

export const RevisionView: React.FC<RevisionViewProps> = ({ items, onReviewProblem }) => {
  const { rateRevision } = useApp();
  const [activeRatings, setActiveRatings] = useState<Record<string, string>>({});

  const handleRate = (item: RevisionItem, rating: 'again' | 'hard' | 'good' | 'mastered') => {
    setActiveRatings(prev => ({ ...prev, [item.id]: rating }));
    rateRevision(item.id, rating, item.problemId, item.title, item.topic, item.difficulty);
  };

  return (
    <motion.section className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.h2 className="font-heading text-xl font-bold text-text-primary gradient-text" variants={cardVariants}>
        SPACED REPETITION
      </motion.h2>

      <motion.p className="text-sm text-text-secondary" variants={cardVariants}>
        {items.length === 0
          ? 'No reviews due. Solve problems to add them to your spaced repetition queue.'
          : `${items.length} problem${items.length === 1 ? '' : 's'} due for review. Rate your recall to schedule the next review.`}
      </motion.p>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" variants={containerVariants}>
        {items.map((item) => {
          const urgency = getUrgency(item.nextReview);
          const daysSinceReview = Math.round((Date.now() - item.nextReview) / (24 * 60 * 60 * 1000));
          const isOverdue = urgency === 'overdue' || urgency === 'due';

          return (
            <motion.div
              key={item.id}
              className={`spatial-card p-5 ${isOverdue ? 'border-accent-danger/30' : ''}`}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isOverdue ? 'bg-accent-danger/20 text-accent-danger' : 'bg-accent/20 text-accent'
                }`}>
                  <span className="font-bold text-xs">{isOverdue ? '!' : '○'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-text-primary text-sm">{item.title}</h4>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1 font-mono">
                    {item.difficulty} • {item.topic}
                  </p>
                  <p className="text-[10px] text-text-muted mt-1">
                    {isOverdue ? `${Math.abs(daysSinceReview)}d overdue` : `Due in ${Math.max(0, daysSinceReview)}d`} • {Math.round(item.retention)}% retention • Ease: {item.ease.toFixed(1)}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-glass-border">
                <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2 font-bold">Rate Recall</p>
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { key: 'again' as const, label: 'Again', color: 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30' },
                    { key: 'hard' as const, label: 'Hard', color: 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' },
                    { key: 'good' as const, label: 'Good', color: 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' },
                    { key: 'mastered' as const, label: 'Mastered', color: 'bg-accent/20 text-accent hover:bg-accent/30' },
                  ].map((rating) => (
                    <button
                      key={rating.key}
                      onClick={() => handleRate(item, rating.key)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] uppercase font-bold transition-all cursor-pointer ${rating.color}`}
                    >
                      {rating.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onReviewProblem(item.problemId)}
                className="mt-3 w-full spatial-btn px-3 py-1.5 text-xs font-bold cursor-pointer"
              >
                Open Problem →
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
};
