import React from 'react';
import { motion } from 'framer-motion';
import { UniverseNode } from '../types';

interface RoadmapViewProps {
  nodes: UniverseNode[];
  onSelectProblemById: (problemId: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export const RoadmapView: React.FC<RoadmapViewProps> = ({nodes, onSelectProblemById}) => {
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
        CURRICULUM ROADMAP
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        {nodes.map((node) => {
          const statusConfig = {
            completed: { border: 'border-accent/30', bg: 'bg-accent/5', glow: 'shadow-accent/10', text: 'text-accent' },
            in_progress: { border: 'border-accent-amber/30', bg: 'bg-accent-amber/5', glow: 'shadow-accent-amber/10', text: 'text-accent-amber' },
            locked: { border: 'border-glass-border', bg: 'bg-glass-bg', glow: '', text: 'text-text-muted' },
          };
          const cfg = statusConfig[node.status];

          return (
            <motion.div
              key={node.id}
              className={`spatial-card p-5 ${cfg.border} ${cfg.border}`}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-text-primary">{node.topic}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${cfg.text}`}>
                  {Math.round(node.progress * 100)}%
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-glass-bg overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${node.progress * 100}%`,
                    background: node.status === 'completed'
                      ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                      : node.status === 'in_progress'
                      ? 'linear-gradient(90deg, #f59e0b, #f97316)'
                      : 'rgba(99,102,241,0.2)',
                  }}
                />
              </div>

              <p className="text-[10px] text-text-muted line-clamp-2 mb-4">
                {node.description}
              </p>

              <button
                onClick={() => {/* Navigate to first unsolved problem */}}
                className="w-full spatial-btn px-3 py-2 text-xs font-bold uppercase tracking-wider text-accent cursor-pointer"
              >
                Start {node.topic}
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
};
