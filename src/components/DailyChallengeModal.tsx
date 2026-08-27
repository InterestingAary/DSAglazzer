import React from 'react';
import { motion } from 'framer-motion';
import { Problem } from '../types';

interface DailyChallengeModalProps {
  problem: Problem;
  onClose: () => void;
  onStartChallenge: (problem: Problem) => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({problem, onClose, onStartChallenge}) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-deep/80 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative spatial-card-heavy max-w-md w-full p-8 max-h-[90vh] overflow-y-auto rounded-3xl"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex justify-between items-center mb-6 border-b border-glass-border pb-4">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary gradient-text">
            Daily Challenge
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="glass-surface rounded-2xl p-5 mb-6">
          <h3 className="font-heading text-lg font-bold text-text-primary mb-3">
            {problem.title}
          </h3>
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-4 font-mono">
            {problem.difficulty} • {problem.topic}
          </p>

          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            {problem.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2 font-bold">Constraints</p>
              <p className="text-xs text-text-secondary">{problem.constraints.join('. ')}.</p>
            </div>
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2 font-bold">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {problem.tags.map((tag) => (
                  <span key={tag} className="text-[9px] rounded-lg glass-surface px-2 py-1 text-text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2 font-bold">Example</p>
            {problem.examples.slice(0, 1).map((ex, i) => (
              <div key={i} className="glass-surface rounded-xl p-3 mt-2">
                <p className="font-bold text-accent text-xs">Input:</p>
                <p className="mt-1 break-all text-xs text-text-primary font-mono">{ex.input}</p>
                <p className="font-bold text-accent mt-2 text-xs">Output:</p>
                <p className="mt-1 break-all text-xs text-text-primary font-mono">{ex.output}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <button
            onClick={() => onStartChallenge(problem)}
            className="w-full spatial-btn-solid py-3 text-sm uppercase font-bold tracking-wider cursor-pointer"
          >
            Start Challenge
          </button>
          <button
            onClick={onClose}
            className="w-full spatial-btn py-3 text-sm uppercase font-bold tracking-wider text-text-secondary cursor-pointer"
          >
            Skip
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
