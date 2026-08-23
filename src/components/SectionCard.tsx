import React from "react";

interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  tapeColor?: "default" | "brand" | "amber" | "emerald";
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, subtitle, tapeColor = "default", children, className = "", ...props }) => {
  const tapeBg =
    tapeColor === "brand" ? "rgba(20,184,166,0.16)" : tapeColor === "amber" ? "rgba(251,191,36,0.16)" : tapeColor === "emerald" ? "rgba(16,185,129,0.14)" : "rgba(255,255,255,0.08)";
  return (
    <div className={`relative bg-white dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 pt-7 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-16px_rgba(0,0,0,0.12)] dark:shadow-none card-lift overflow-hidden ${className}`} {...props}>
      {/* washi tape */}
      <span
        className="absolute -top-2 left-1/2 h-4 w-20 -translate-x-1/2 -rotate-2 rounded-sm shadow-sm"
        style={{ background: `repeating-linear-gradient(90deg, ${tapeBg} 0 6px, transparent 6px 12px)`, border: "1px solid rgba(0,0,0,0.06)" }}
        aria-hidden="true"
      />
      {(title || subtitle) && (
        <div className="mb-4 border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
          {title && <h3 className="font-display font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 text-sm">{title}</h3>}
          {subtitle && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
};
export default SectionCard;