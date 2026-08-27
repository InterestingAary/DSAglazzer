import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { UserStats } from '../types';
import { Flame, Target, Clock, TrendingUp } from 'lucide-react';

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
    { icon: Flame, value: `${userStats.streak}D`, label: 'Streak', color: 'text-[var(--color-accent-amber)]' },
    { icon: Target, value: `${userStats.totalSolved}`, label: 'Solved', color: 'text-[var(--color-accent)]' },
    { icon: TrendingUp, value: `${userStats.problemsThisWeek}`, label: 'This Week', color: 'text-[var(--color-accent-emerald)]' },
    { icon: Clock, value: `${Math.round(userStats.totalPracticeMinutes / 60)}h`, label: 'Practice', color: 'text-[var(--color-text-secondary)]' },
  ];

  return (
    <motion.section
      className="relative overflow-hidden card p-6 sm:p-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
        {/* Left: Greeting + Stats */}
        <div className="flex flex-col gap-5 max-w-2xl">
          {/* Status indicator */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <span className="w-1.5 h-1.5 bg-[var(--color-accent-emerald)] rounded-full animate-glow-pulse" />
            <span className="text-[var(--color-accent-emerald)] font-mono text-[11px] tracking-wider uppercase font-semibold">
              {greeting}, {userStats.name}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--color-text-primary)] leading-tight"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Keep solving. Your next breakthrough is one problem away.
          </motion.h1>

          {/* Stats row */}
          <motion.div
            className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 border-t border-[var(--color-border-subtle)]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[var(--color-text-primary)] font-mono">
                    {stat.value}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Progress Ring */}
        <motion.div
          className="shrink-0 flex items-center justify-center self-center lg:self-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
        >
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
            {/* Progress ring background */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r={radius}
                fill="none"
                stroke="var(--color-border-subtle)"
                strokeWidth="6"
              />
              <circle
                cx="50" cy="50" r={radius}
                fill="none"
                stroke="url(#heroGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center text */}
            <div className="flex flex-col items-center justify-center z-10 select-none">
              <span className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] font-mono">
                {percentage}%
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium mt-1">
                {userStats.totalSolved} / {totalProblems}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
