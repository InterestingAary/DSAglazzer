import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RevisionItem } from '../types';
import { useApp } from '../context/AppContext';
import { getUrgency } from '../utils/spacedRepetition';
import { RotateCcw, ArrowRight, AlertTriangle, HelpCircle } from 'lucide-react';

interface RevisionViewProps {
  items: RevisionItem[];
  onReviewProblem: (problemId: string) => void;
}

export const RevisionView: React.FC<RevisionViewProps> = ({ items, onReviewProblem }) => {
  const { rateRevision } = useApp();
  const [showHelp, setShowHelp] = useState(false);

  const handleRate = (item: RevisionItem, rating: 'again' | 'hard' | 'good' | 'mastered') => {
    rateRevision(item.id, rating, item.problemId, item.title, item.topic, item.difficulty);
  };

  const ratingOptions = [
    { key: 'again' as const, label: 'Again', color: 'badge-danger', quality: '0' },
    { key: 'hard' as const, label: 'Hard', color: 'badge-amber', quality: '3' },
    { key: 'good' as const, label: 'Good', color: 'badge-emerald', quality: '4' },
    { key: 'mastered' as const, label: 'Mastered', color: 'badge-accent', quality: '5' },
  ];

  return (
    <motion.section className="space-y-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center">
            <RotateCcw className="w-3.5 h-3.5 text-[var(--color-accent)]" />
          </div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Spaced Repetition</h2>
        </div>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] transition-colors cursor-pointer"
          aria-label="Spaced repetition help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {showHelp && (
        <motion.div
          className="card p-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h3 className="font-medium text-sm text-[var(--color-text-primary)] mb-3">How Spaced Repetition Works</h3>
          <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            <p>Rate your recall after reviewing a problem. The SM-2 algorithm schedules the next review based on your rating:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Again</strong> (q=0) — Complete blackout. Resets to 1 day.</li>
              <li><strong>Hard</strong> (q=3) — Difficult recall. Short interval.</li>
              <li><strong>Good</strong> (q=4) — Recalled with effort. Normal interval.</li>
              <li><strong>Mastered</strong> (q=5) — Perfect recall. Maximum boost.</li>
            </ul>
            <p className="pt-2">Reviews appear in <strong>Revision Radar</strong> on the dashboard when due.</p>
          </div>
        </motion.div>
      )}

      <p className="text-sm text-[var(--color-text-secondary)]">
        {items.length === 0
          ? 'No reviews due. Solve problems to add them to your spaced repetition queue.'
          : `${items.length} problem${items.length === 1 ? '' : 's'} due for review. Rate your recall to schedule the next review.`}
      </p>

      {items.length === 0 ? (
        <motion.div
          className="card p-10 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-14 h-14 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="w-7 h-7 text-[var(--color-accent)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">All Caught Up</h3>
          <p className="text-sm text-[var(--color-text-muted)] max-w-md mx-auto">
            No problems due for review. Keep solving to build your revision queue.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item, index) => {
            const urgency = getUrgency(item.nextReview);
            const daysSinceReview = Math.round((Date.now() - item.nextReview) / (24 * 60 * 60 * 1000));
            const isOverdue = urgency === 'overdue' || urgency === 'due';

            return (
              <motion.div
                key={item.id}
                className={`card p-4 ${isOverdue ? 'border-[var(--color-accent-danger)]/20' : ''}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
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

                <div className="mt-3 pt-3 divider">
                  <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-semibold">Rate Recall</p>
                  <div className="flex gap-1.5">
                    {ratingOptions.map((rating) => (
                      <button
                        key={rating.key}
                        onClick={() => handleRate(item, rating.key)}
                        className={`flex-1 px-2 py-1.5 rounded-md text-[10px] uppercase font-semibold transition-all cursor-pointer ${rating.color} hover:opacity-80`}
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
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
};