import React from 'react';
import { UserStats, UniverseNode } from '../types';
import { motion } from 'framer-motion';

interface ProgressAnalyticsProps {
  userStats: UserStats;
  nodes: UniverseNode[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
};

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({userStats, nodes}) => {
  const difficultyDistribution = {
    easy: userStats.easySolved / userStats.easyTotal,
    medium: userStats.mediumSolved / userStats.mediumTotal,
    hard: userStats.hardSolved / userStats.hardTotal,
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
        variants={itemVariants}
      >
        PROGRESS ANALYTICS
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Accuracy Gauge */}
        <motion.div className="spatial-card p-6" variants={itemVariants}>
          <h3 className="text-xs uppercase tracking-widest text-text-muted mb-4 font-bold">Overall Accuracy</h3>
          <div className="relative h-52 flex items-center justify-center">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="40"
                fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="8"
              />
              <circle
                cx="50" cy="50" r="40"
                fill="none" stroke="url(#gaugeGradient)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * userStats.accuracy) / 100}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-text-primary glow-text-accent">
                {userStats.accuracy}%
              </span>
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold mt-1">accuracy</span>
            </div>
          </div>
        </motion.div>

        {/* Difficulty Distribution */}
        <motion.div className="spatial-card p-6" variants={itemVariants}>
          <h3 className="text-xs uppercase tracking-widest text-text-muted mb-4 font-bold">Difficulty Distribution</h3>
          <div className="space-y-5">
            {[
              { label: 'Easy', ratio: difficultyDistribution.easy, solved: userStats.easySolved, total: userStats.easyTotal, color: '#6366f1', glow: 'rgba(99,102,241,0.4)' },
              { label: 'Medium', ratio: difficultyDistribution.medium, solved: userStats.mediumSolved, total: userStats.mediumTotal, color: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
              { label: 'Hard', ratio: difficultyDistribution.hard, solved: userStats.hardSolved, total: userStats.hardTotal, color: '#ef4444', glow: 'rgba(239,68,68,0.4)' },
            ].map((d) => (
              <div key={d.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-text-primary">{d.label}</span>
                  <span className="text-[10px] font-mono text-text-muted">{d.solved}/{d.total}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-glass-bg overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${d.ratio * 100}%`,
                      background: `linear-gradient(90deg, ${d.color}, ${d.color}cc)`,
                      boxShadow: `0 0 12px ${d.glow}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Topic Mastery */}
        <motion.div className="spatial-card p-6" variants={itemVariants}>
          <h3 className="text-xs uppercase tracking-widest text-text-muted mb-4 font-bold">Topic Mastery</h3>
          <div className="space-y-4">
            {nodes.slice(0, 5).map((node) => (
              <div key={node.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-text-secondary font-medium">{node.topic}</span>
                  <span className="text-[10px] font-mono text-text-muted">{Math.round(node.progress * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-glass-bg overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${node.progress * 100}%`,
                      background: node.progress > 0.7
                        ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                        : node.progress > 0.4
                        ? 'linear-gradient(90deg, #f59e0b, #f97316)'
                        : 'linear-gradient(90deg, #ef4444, #f87171)',
                      boxShadow: node.progress > 0.7
                        ? '0 0 12px rgba(99,102,241,0.4)'
                        : node.progress > 0.4
                        ? '0 0 12px rgba(245,158,11,0.4)'
                        : '0 0 12px rgba(239,68,68,0.4)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
