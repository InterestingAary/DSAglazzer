import React from 'react';
import { motion } from 'framer-motion';
import { Problem } from '../types';
import { X, ArrowRight, Target } from 'lucide-react';

interface DailyChallengeModalProps {
  problem: Problem;
  onClose: () => void;
  onStartChallenge: (problem: Problem) => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({ problem, onClose, onStartChallenge }) => {
  const difficultyClasses = {
    Easy: 'badge-emerald',
    Medium: 'badge-amber',
    Hard: 'badge-danger',
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-[var(--color-deep)]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        className="relative card max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex justify-between items-center mb-5 divider pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-[var(--color-accent)]" />
            </div>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Daily Challenge</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[var(--color-surface-elevated)] rounded-lg p-4 mb-5 divider">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-[var(--color-text-primary)] text-sm">
              {problem.title}
            </h3>
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${difficultyClasses[problem.difficulty]}`}>
              {problem.difficulty}
            </span>
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-3 font-mono">
            {problem.topic}
          </p>

          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
            {problem.description}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 font-semibold">Constraints</p>
              <p className="text-[11px] text-[var(--color-text-secondary)]">{problem.constraints.join('. ')}.</p>
            </div>
            <div>
              <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 font-semibold">Tags</p>
              <div className="flex flex-wrap gap-1">
                {problem.tags.map((tag) => (
                  <span key={tag} className="text-[9px] rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] px-1.5 py-0.5 text-[var(--color-text-secondary)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 font-semibold">Example</p>
            {problem.examples.slice(0, 1).map((ex, i) => (
              <div key={i} className="bg-[var(--color-surface)] rounded-lg p-3 mt-1 divider">
                <p className="font-semibold text-[var(--color-accent)] text-[11px]">Input:</p>
                <p className="mt-0.5 break-all text-[11px] text-[var(--color-text-primary)] font-mono">{ex.input}</p>
                <p className="font-semibold text-[var(--color-accent)] mt-2 text-[11px]">Output:</p>
                <p className="mt-0.5 break-all text-[11px] text-[var(--color-text-primary)] font-mono">{ex.output}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onStartChallenge(problem)}
            className="w-full spatial-btn-solid py-2.5 text-[11px] uppercase font-semibold tracking-wider cursor-pointer flex items-center justify-center gap-2"
          >
            Start Challenge <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="w-full spatial-btn py-2.5 text-[11px] uppercase font-semibold tracking-wider text-[var(--color-text-secondary)] cursor-pointer"
          >
            Skip
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};