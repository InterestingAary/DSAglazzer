import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'easy' | 'medium' | 'hard' | 'leetcode' | 'striver' | 'gfg' | 'codestudio' | 'other' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const baseStyle = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors duration-150';
  
  const variants = {
    default: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800/80',
    easy: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/10',
    medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/10',
    hard: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 dark:border-rose-500/10',
    leetcode: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/25 dark:border-orange-500/10',
    striver: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/25 dark:border-violet-500/10',
    gfg: 'bg-emerald-600/10 text-emerald-800 dark:text-emerald-400 border-emerald-600/25 dark:border-emerald-600/10',
    codestudio: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/25 dark:border-sky-500/10',
    other: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/25 dark:border-zinc-500/10',
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
export default Badge;
