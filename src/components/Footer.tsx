import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-4 px-6 text-center">
        <p className="font-display text-lg font-semibold text-[var(--accent)] dark:text-brand-300">
          “Consistency beats intensity when intensity doesn't last.”
        </p>
        <Link
          to="/today"
          className="inline-flex items-center gap-1.5 font-mono text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)] cursor-pointer"
        >
          Continue your journey <ArrowRight size={14} />
        </Link>
        <div className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-xs text-[var(--text-secondary)]">
          <a href="https://github.com/InterestingAary/DSAglazzer" target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">GitHub</a>
          <a href="https://interestingaary.github.io/portfolio/" target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">Portfolio</a>
          <a href="#main-content" className="hover:text-[var(--accent)]">Terminal Help</a>
        </div>
        <p className="font-mono text-xs text-zinc-500 dark:text-[#c8c5ca]">
          © 2026 DSAGLAZZER COMMAND CENTER. ALL LOGIC PATHS RESERVED.
        </p>
      </div>
    </footer>
  );
}