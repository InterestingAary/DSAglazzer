import React from "react";

interface ProgressRingProps {
  percent: number;
  size?: number;
  stroke?: number;
}

/** Faux-3D progress ring (Stitch hero). Percent 0-100. */
export const ProgressRing: React.FC<ProgressRingProps> = ({ percent, size = 128, stroke = 14 }) => {
  const r = (100 - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className="relative rounded-full border border-[var(--border-main)] bg-black/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Revision progress ${clamped}%`}
    >
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
        <circle className="text-white/10" cx="50" cy="50" fill="none" r={r} stroke="currentColor" strokeWidth={stroke} />
        <circle
          className="text-brand-300 drop-shadow-[0_0_10px_rgba(160,120,255,0.55)] transition-[stroke-dashoffset] duration-700"
          cx="50" cy="50" fill="none" r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (clamped / 100) * c}
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <span className="stat-number font-display font-bold text-brand-300 text-3xl leading-none">{clamped}%</span>
      </div>
    </div>
  );
};
export default ProgressRing;