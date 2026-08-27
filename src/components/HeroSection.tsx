import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { UserStats } from '../types';

interface HeroSectionProps {
  userStats: UserStats;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ userStats }) => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const totalProblems = userStats.easyTotal + userStats.mediumTotal + userStats.hardTotal;
  const percentage = totalProblems > 0 ? Math.round((userStats.totalSolved / totalProblems) * 100) : 0;
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  const stats = [
    { value: `${userStats.streak}D`, label: 'Day Streak', color: 'text-text-primary' },
    { value: userStats.problemsThisWeek, label: 'Solved / Wk', color: 'text-accent' },
    { value: `${userStats.totalSolved}`, label: 'Total Solved', color: 'text-text-primary' },
    { value: `${Math.round(userStats.totalPracticeMinutes / 60)}h`, label: 'Practice', color: 'text-text-primary' },
  ];

  return (
    <motion.section
      className="relative overflow-hidden spatial-card p-6 sm:p-10 noise-overlay gradient-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
        <div className="flex flex-col gap-4 max-w-2xl">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <span className="w-2 h-2 bg-accent-emerald rounded-full animate-glow-pulse" />
            <span className="text-accent-emerald font-mono text-xs tracking-wider uppercase font-bold">
              {greeting}, {userStats.name} • Session Active
            </span>
          </motion.div>

          <motion.h1
            className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[0.9] text-text-primary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            ALGORITHMIC<br />
            <span className="gradient-text">MASTERY</span> & SYSTEM RECALL
          </motion.h1>

          <motion.p
            className="text-sm sm:text-base text-text-secondary max-w-lg leading-relaxed font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Crafting high-performance algorithmic intuition with clean invariants, optimal complexity, and disciplined spaced recall.
          </motion.p>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-5 border-t border-glass-border"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className={`text-2xl sm:text-3xl font-black ${stat.color}`}>
                  {stat.value}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="shrink-0 flex items-center justify-center self-center lg:self-auto p-5 glass-surface rounded-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }}
        >
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="7" />
              <circle cx="50" cy="50" r={radius} fill="none" stroke="url(#heroGradient)" strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out" />
              <defs>
                <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex flex-col items-center justify-center z-10 select-none">
              <span className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-text-primary glow-text-accent">
                {percentage}%
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted font-bold mt-1">
                {userStats.totalSolved}/{totalProblems}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
