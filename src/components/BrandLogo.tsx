import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export const BrandLogo: React.FC<{ size?: number; withText?: boolean; className?: string }> = ({ size = 38, withText = true, className = "" }) => {
  const reduce = useReducedMotion();
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <motion.div
        style={{ width: size, height: size }}
        className="relative shrink-0 rounded-[13px] brand-gradient shadow-lg shadow-iris-500/30 overflow-hidden"
        whileHover={reduce ? undefined : { scale: 1.06, rotate: -3 }}
        transition={{ type: "spring", stiffness: 320, damping: 16 }}
        aria-hidden="true"
      >
        {/* faceted gem — DSAglazzer */}
        <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="gemFace" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <g stroke="url(#gemFace)" strokeWidth="1.5" fill="none" strokeLinejoin="round">
            <path d="M12 14h16l4 6-12 11L8 20l4-6Z" fill="rgba(255,255,255,0.18)" />
            <path d="M8 20h24M12 14l4 6 4-6m0 0 4 6 4-6M16 20l4 11 4-11" strokeWidth="1.1" opacity="0.9" />
          </g>
          {/* sparkle */}
          <path d="M31.5 8.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z" fill="#fff" opacity="0.95" />
        </svg>
        {!reduce && (
          <motion.span
            className="absolute inset-x-0 h-[2px] bg-white/50 blur-[1px]"
            animate={{ top: ["12%", "84%", "12%"] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>
      {withText && (
        <div className="leading-none">
          <div className="font-display font-bold tracking-tight text-zinc-900 dark:text-white flex items-baseline gap-[1px]" style={{ fontSize: size * 0.44 }}>
            DSA<span className="brand-text-gradient">glazzer</span><span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse-subtle" />
          </div>
          <div className="font-mono text-[10px] tracking-[0.22em] text-brand-600 dark:text-brand-300 -mt-0.5">SPACED · REVISED · GLAZED</div>
        </div>
      )}
    </div>
  );
};
export default BrandLogo;