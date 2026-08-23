import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variants = {
    primary: 'bg-brand-300 text-brand-950 hover:bg-brand-200 shadow-sm shadow-brand-500/30 active:scale-[0.98]',
    secondary: 'bg-[#efeaf6] dark:bg-night-700 hover:bg-[#e4dcf3] dark:hover:bg-[#37333d] text-zinc-900 dark:text-zinc-100 border border-black/10 dark:border-white/10',
    danger: 'bg-[#dc362e] hover:bg-[#c22c25] text-white dark:bg-[#ffb4ab] dark:hover:bg-[#ffc7c0] dark:text-[#690005] active:scale-[0.98]',
    ghost: 'hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 text-sm',
    lg: 'h-10 px-6 text-base',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;