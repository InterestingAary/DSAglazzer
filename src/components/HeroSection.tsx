import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  RotateCcw,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { initialUserStats } from '../data/mockData';
import { DailyBlitzModal } from './DailyBlitzModal';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [stats] = useState(initialUserStats);
  const [isBlitzOpen, setIsBlitzOpen] = useState(false);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return 'Midnight Session Active';
    if (hour < 12) return 'Good Morning, Commander';
    if (hour < 17) return 'Good Afternoon, Commander';
    return 'Good Evening, Commander';
  };

  const solvedPercentage = Math.round((stats.totalSolved / stats.totalProblems) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#27272a] bg-[#0c0c0c] p-6 sm:p-8 lg:p-10 shadow-2xl">
      {/* Background ambient radial glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#10b981]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-[#ffb869]/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Left Column: Greeting, Big Tracked Heading, and Telemetry Pills */}
        <div className="flex flex-col gap-5 max-w-2xl">
          {/* Status Pip */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pip" />
            <span className="text-[#10b981] font-mono text-xs tracking-wider uppercase font-bold">
              {getGreeting()} · {stats.rank} ({stats.rating} ELO)
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-[0.95] text-[#f5f5f5]">
            ALGORITHMIC <br />
            <span className="text-[#10b981]">MASTERY</span> & SYSTEM RECALL
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 font-mono max-w-xl leading-relaxed">
            Spaced repetition mastery engine for data structures & algorithmic patterns. Optimize asymptotic time bounds, internalize loop invariants, and maintain permanent recall.
          </p>

          {/* Telemetry Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-4 border-t border-[#27272a]">
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-1">
                <Flame className="w-5 h-5 text-[#ffb869] fill-current" />
                {stats.currentStreak}D
              </span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono font-bold mt-0.5">
                Active Streak
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black font-display text-[#10b981]">
                {stats.totalSolved}
                <span className="text-xs text-zinc-500 font-normal ml-1">/ {stats.totalProblems}</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono font-bold mt-0.5">
                Solved Arsenal
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black font-display text-white">
                {stats.accuracy}%
              </span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono font-bold mt-0.5">
                First-Pass Rate
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black font-display text-white">
                {stats.totalPracticeHours}h
              </span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono font-bold mt-0.5">
                Total Practice
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/practice')}
              className="px-5 py-2.5 bg-[#10b981] hover:bg-[#34d399] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-[#10b981]/20 cursor-pointer"
            >
              <span>Launch IDE Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsBlitzOpen(true)}
              className="px-4 py-2.5 bg-[#161616] hover:bg-[#202020] border border-[#27272a] hover:border-[#ffb869]/50 text-white font-mono text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#ffb869] fill-current" />
              <span>Speed Sprint (Blitz)</span>
            </button>

            <button
              onClick={() => navigate('/revision')}
              className="px-4 py-2.5 bg-[#161616] hover:bg-[#202020] border border-[#27272a] hover:border-[#10b981]/50 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#10b981]" />
              <span>SRS Deck ({stats.dueForRevisionCount} Due)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Circular Mastery Ring & SRS Urgency Monitor */}
        <div className="flex flex-col items-center justify-center p-6 bg-[#121212] border border-[#27272a] rounded-2xl shrink-0 w-full sm:w-auto min-w-[240px]">
          {/* SVG Circular Ring */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-[#1f1f23]"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-[#10b981] transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * solvedPercentage) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black font-display text-white">
                {solvedPercentage}%
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                Mastery
              </span>
            </div>
          </div>

          <div className="mt-4 text-center space-y-1">
            <div className="text-xs font-mono font-bold text-white">
              {stats.dueForRevisionCount} Invariants Overdue
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              Spaced Repetition Active
            </div>
          </div>
        </div>
      </div>

      {/* Daily Speed Blitz Modal */}
      <DailyBlitzModal isOpen={isBlitzOpen} onClose={() => setIsBlitzOpen(false)} />
    </div>
  );
};
