import React from "react";

export const BrandLogo: React.FC<{ size?: number; withText?: boolean; className?: string }> = ({ size = 36, withText = true, className = "" }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        style={{ width: size, height: size }}
        className="relative rounded-xl brand-gradient flex items-center justify-center shadow-lg shadow-brand-600/30 shrink-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* grid texture */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)", backgroundSize: "8px 8px" }} />
        {/* monogram */}
        <span className="relative font-display font-bold text-white tracking-tight" style={{ fontSize: size * 0.48, lineHeight: 1 }}>
          D<span className="font-serif italic font-normal text-white/90">G</span>
        </span>
        {/* spark */}
        <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-white shadow" />
      </div>
      {withText && (
        <div className="leading-none">
          <div className="font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50" style={{ fontSize: size * 0.38 }}>DSA<span className="text-brand-600 dark:text-brand-400">glazzer</span></div>
          <div className="font-mono text-[10px] tracking-widest text-zinc-500 dark:text-zinc-400 -mt-0.5">SPACED • REVISE • SHIP</div>
        </div>
      )}
    </div>
  );
};
export default BrandLogo;