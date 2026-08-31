import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { UserStats } from '../types';
import { Flame, Target, TrendingUp } from 'lucide-react';

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
    { icon: Flame, value: `${userStats.streak}d`, label: 'Streak', color: 'text-[var(--color-accent-amber)]' },
    { icon: Target, value: `${userStats.totalSolved}`, label: 'Solved', color: 'text-[var(--color-accent)]' },
    { icon: TrendingUp, value: `${userStats.problemsThisWeek}`, label: 'This Week', color: 'text-[var(--color-accent-emerald)]' },
  ];

  return (
    <motion.section
      className="card p-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--color-accent-emerald)] rounded-full" />
            <span className="text-[var(--color-accent-emerald)] font-mono text-[11px] tracking-wider uppercase font-semibold">
              {greeting}, {userStats.name}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)] leading-tight">
            Keep solving. Your next breakthrough is one problem away.
          </h1>

          <div className="flex flex-wrap items-center gap-3 sm:gap-5 pt-3 border-t border-[var(--color-border)]">
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
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-center">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r={radius}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="4"
              />
              <circle
                cx="50" cy="50" r={radius}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="flex flex-col items-center justify-center select-none">
              <span className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] font-mono">
                {percentage}%
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium mt-1">
                {userStats.totalSolved} / {totalProblems}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};