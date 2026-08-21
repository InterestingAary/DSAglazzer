import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, hoverable = false, className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-16px_rgba(0,0,0,0.12)] dark:shadow-none card-lift ${
        hoverable ? 'hover:border-brand-500/40 dark:hover:border-brand-400/30 hover:shadow-lg hover:shadow-brand-600/5 dark:hover:shadow-none hover:-translate-y-[2px]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;