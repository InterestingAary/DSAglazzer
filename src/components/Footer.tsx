import { ArrowRight, Globe, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

const GithubIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-[#1f1f23] bg-[#080808] py-8">
      <div className="mx-auto flex max-w-[1360px] flex-col items-center gap-4 px-4 sm:px-6 text-center">
        <p className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
          “Consistency beats intensity when intensity doesn't last.”
        </p>

        <Link
          to="/revision"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[#10b981] hover:underline cursor-pointer"
        >
          <span>Launch Spaced Repetition SRS Flashcards</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-xs text-zinc-400">
          <a
            href="https://github.com/InterestingAary/DSAglazzer"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white flex items-center gap-1 transition-colors"
          >
            <GithubIcon /> GitHub Repository
          </a>
          <a
            href="https://interestingaary.github.io/portfolio/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white flex items-center gap-1 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" /> Portfolio
          </a>
          <Link
            to="/portfolio"
            className="hover:text-[#10b981] flex items-center gap-1 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" /> Live Terminal
          </Link>
        </div>

        <p className="font-mono text-[11px] text-zinc-600">
          © {new Date().getFullYear()} ALGO_ELITE COMMAND CENTER · CRAFTED BY AARYAN · ALL INVARIANTS VERIFIED
        </p>
      </div>
    </footer>
  );
}
