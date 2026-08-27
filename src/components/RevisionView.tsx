import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RevisionItem } from '../types';
import { useApp } from '../context/AppContext';
import { getUrgency } from '../utils/spacedRepetition';
import { RotateCcw, ArrowRight, AlertTriangle } from 'lucide-react';

interface RevisionViewProps {
  items: RevisionItem[];
  onReviewProblem: (problemId: string) => void;
}

export const RevisionView: React.FC<RevisionViewProps> = ({ items, onReviewProblem }) => {
  const { rateRevision } = useApp();
  const [activeRatings, setActiveRatings] = useState<Record<string, string>>({});

  const handleRate = (item: RevisionItem, rating: 'again' | 'hard' | 'good' | 'mastered') => {
    setActiveRatings(prev => ({ ...prev, [item.id]: rating }));
    rateRevision(item.id, rating, item.problemId, item.title, item.topic, item.difficulty);
  };

  return (
    <motion.section className="space-y-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center gap-2.5">
        <RotateCcw className="w-5 h-5 text-[var(--color-accent)]" />
        <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Spaced Repetition</h2>
      </div>

      <p className="text-sm text-[var(--color-text-secondary)]">
        {items.length === 0
          ? 'No reviews due. Solve problems to add them to your spaced repetition queue.'
          : `${items.length} problem${items.length === 1 ? '' : 's'} due for review. Rate your recall to schedule the next review.`}
      </p>

      {items.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="w-14 h-14 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="w-7 h-7 text-[var(--color-accent)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">All Caught Up</h3>
          <p className="text-sm text-[var(--color-text-muted)] max-w-md mx-auto">
            No problems due for review. Keep solving to build your revision queue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => {
            const urgency = getUrgency(item.nextReview);
            const daysSinceReview = Math.round((Date.now() - item.nextReview) / (24 * 60 * 60 * 1000));
            const isOverdue = urgency === 'overdue' || urgency === 'due';

            return (
              <div
                key={item.id}
                className={`card p-4 ${isOverdue ? 'border-[var(--color-accent-danger)]/20' : ''}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isOverdue ? 'bg-[var(--color-accent-danger)]/10 text-[var(--color-accent-danger)]' : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                  }`}>
                    {isOverdue ? <AlertTriangle className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[var(--color-text-primary)] text-sm">{item.title}</h4>
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5 font-mono">
                      {item.difficulty} · {item.topic}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                      {isOverdue ? `${Math.abs(daysSinceReview)}d overdue` : `Due in ${Math.max(0, daysSinceReview)}d`} · {Math.round(item.retention)}% retention
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)]">
                  <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-semibold">Rate Recall</p>
                  <div className="flex gap-1.5">
                    {[
                      { key: 'again' as const, label: 'Again', color: 'bg-[var(--color-accent-danger)]/10 text-[var(--color-accent-danger)] hover:bg-[var(--color-accent-danger)]/15' },
                      { key: 'hard' as const, label: 'Hard', color: 'bg-[var(--color-accent-amber)]/10 text-[var(--color-accent-amber)] hover:bg-[var(--color-accent-amber)]/15' },
                      { key: 'good' as const, label: 'Good', color: 'bg-[var(--color-accent-emerald)]/10 text-[var(--color-accent-emerald)] hover:bg-[var(--color-accent-emerald)]/15' },
                      { key: 'mastered' as const, label: 'Mastered', color: 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/15' },
                    ].map((rating) => (
                      <button
                        key={rating.key}
                        onClick={() => handleRate(item, rating.key)}
                        className={`flex-1 px-2 py-1.5 rounded-md text-[10px] uppercase font-semibold transition-all cursor-pointer ${rating.color}`}
                      >
                        {rating.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onReviewProblem(item.problemId)}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-[var(--color-accent)] bg-[var(--color-accent)]/5 hover:bg-[var(--color-accent)]/10 rounded-md transition-colors cursor-pointer"
                >
                  Open Problem <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
};
