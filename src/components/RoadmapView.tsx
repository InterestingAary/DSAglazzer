import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseNode, Topic, Problem } from '../types';
import { problems } from '../data/problems';
import { useApp } from '../context/AppContext';

interface RoadmapViewProps {
  nodes: UniverseNode[];
  onSelectProblemById: (problemId: string) => void;
  onSelectTopic: (topic: Topic) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-rose-400',
};

export const RoadmapView: React.FC<RoadmapViewProps> = ({ nodes, onSelectProblemById, onSelectTopic }) => {
  const { getProblemStatus } = useApp();
  const [expandedTopic, setExpandedTopic] = useState<Topic | null>(null);

  return (
    <motion.section className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.h2 className="font-heading text-xl font-bold text-text-primary gradient-text" variants={cardVariants}>
        CURRICULUM ROADMAP
      </motion.h2>

      <motion.p className="text-sm text-text-secondary" variants={cardVariants}>
        Master DSA systematically. Click a topic to see its problems and start practicing.
      </motion.p>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" variants={containerVariants}>
        {nodes.map((node) => {
          const statusConfig = {
            completed: { border: 'border-accent/30', text: 'text-accent' },
            in_progress: { border: 'border-accent-amber/30', text: 'text-accent-amber' },
            locked: { border: 'border-glass-border', text: 'text-text-muted' },
          };
          const cfg = statusConfig[node.status];
          const isExpanded = expandedTopic === node.topic;
          const topicProblems = problems.filter(p => p.topic === node.topic);

          return (
            <motion.div key={node.id} className={`spatial-card p-5 ${cfg.border}`} variants={cardVariants} layout>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-text-primary">{node.topic}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${cfg.text}`}>
                  {Math.round(node.progress)}%
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-glass-bg overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${node.progress}%`,
                    background: node.status === 'completed'
                      ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                      : node.status === 'in_progress'
                      ? 'linear-gradient(90deg, #f59e0b, #f97316)'
                      : 'rgba(99,102,241,0.2)',
                  }}
                />
              </div>

              <p className="text-[10px] text-text-muted mb-3">{node.description}</p>

              <button
                onClick={() => setExpandedTopic(isExpanded ? null : node.topic)}
                className="w-full spatial-btn px-3 py-2 text-xs font-bold uppercase tracking-wider text-accent cursor-pointer"
              >
                {isExpanded ? 'Collapse' : `View ${node.topic}`}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-2 pt-3 border-t border-glass-border">
                      {topicProblems.map((problem) => {
                        const status = getProblemStatus(problem.id);
                        const isSolved = status?.status === 'solved';
                        return (
                          <button
                            key={problem.id}
                            onClick={() => onSelectProblemById(problem.id)}
                            className={`w-full text-left p-2 rounded-lg text-xs transition-all cursor-pointer ${
                              isSolved
                                ? 'bg-emerald-500/10 border border-emerald-500/20'
                                : 'glass-surface hover:bg-glass-bg'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`font-medium ${isSolved ? 'text-emerald-400' : 'text-text-primary'}`}>
                                {isSolved && '✓ '}{problem.title}
                              </span>
                              <span className={`text-[10px] font-mono ${DIFFICULTY_COLORS[problem.difficulty]}`}>
                                {problem.difficulty}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
};
