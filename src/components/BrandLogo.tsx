import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export const BrandLogo: React.FC<{ size?: number; withText?: boolean; className?: string }> = ({ size = 40, withText = true, className = "" }) => {
  const reduce = useReducedMotion();
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        style={{ width: size, height: size }}
        className="relative shrink-0 overflow-hidden rounded-[12px] shadow-lg shadow-brand-600/25"
        whileHover={reduce ? undefined : { scale: 1.04, rotate: -1.5 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        aria-hidden="true"
      >
        {/* base gradient */}
        <div className="absolute inset-0 brand-gradient" />
        {/* blueprint grid */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.22) 1px, transparent 1px)", backgroundSize: "7px 7px" }} />
        {/* diamond motif */}
        <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full p-[7px]">
          <rect x="7" y="7" width="26" height="26" rx="6" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" transform="rotate(45 20 20)" />
          <text x="20" y="24.5" textAnchor="middle" fontFamily="Space Grotesk, Inter, sans-serif" fontWeight="700" fontSize="13" fill="white" style={{ letterSpacing: "-0.02em" }}>
            D<tspan fontFamily="Instrument Serif, Georgia, serif" fontStyle="italic" fontWeight="400">g</tspan>
          </text>
        </svg>
        {/* scan line */}
        {!reduce && <motion.span className="absolute inset-x-0 h-px bg-white/40" initial={{ top: "20%" }} animate={{ top: ["20%", "80%", "20%"] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} />}
        {/* glint */}
        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
      </motion.div>
      {withText && (
        <div className="leading-none">
          <div className="font-display font-bold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50 flex items-baseline gap-[1px]" style={{ fontSize: size * 0.42 }}>
            <span>DSA</span><span className="text-brand-600 dark:text-brand-400">glazzer</span><span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
          </div>
          <div className="font-mono text-[10px] tracking-[0.18em] text-zinc-500 dark:text-zinc-400 -mt-0.5 flex items-center gap-1">
            <span className="h-px w-3 bg-brand-500/50 hidden sm:inline-block" />
            SPACED • REVISE • GLAZE
          </div>
        </div>
      )}
    </div>
  );
};
export default BrandLogo;