import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Code2,
  RotateCcw,
  BarChart3,
  Globe,
  Flame,
  Zap,
  Bell,
  Menu,
  X,
  Trophy,
  LayoutDashboard,
} from 'lucide-react';
import { DailyBlitzModal } from './DailyBlitzModal';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard, path: '/' },
  { id: 'practice', label: 'PRACTICE', icon: Code2, path: '/practice' },
  { id: 'roadmap', label: 'ROADMAP', icon: Compass, path: '/roadmap' },
  { id: 'telemetry', label: 'TELEMETRY', icon: BarChart3, path: '/telemetry' },
  { id: 'revision', label: 'REVISION', icon: RotateCcw, path: '/revision' },
  { id: 'portfolio', label: 'PORTFOLIO', icon: Globe, path: '/portfolio' },
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [blitzModalOpen, setBlitzModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/universe';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#080808]/90 backdrop-blur-md border-b border-[#27272a]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Title */}
          <div className="flex items-center gap-6 lg:gap-10">
            <NavLink
              to="/"
              className="flex items-center gap-2 group text-left cursor-pointer transition-transform hover:scale-105"
            >
              <div className="w-8 h-8 rounded bg-[#10b981]/10 border border-[#10b981]/40 flex items-center justify-center text-[#10b981]">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white font-display">
                  ALGO<span className="text-[#10b981]">.</span>ELITE
                </span>
                <span className="text-[9px] font-mono text-zinc-400 tracking-wider uppercase -mt-1 hidden sm:block">
                  DSA Command Center
                </span>
              </div>
            </NavLink>

            {/* Desktop Navigation links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold tracking-wider text-zinc-400">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
                      active
                        ? 'bg-[#161616] text-[#10b981] border border-[#10b981]/30 shadow-sm shadow-[#10b981]/10 font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-[#121212]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Right Section / Stats / CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Daily Streak Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#121212] border border-[#27272a] rounded">
              <Flame className="w-3.5 h-3.5 text-[#ffb869] fill-[#ffb869]/20 animate-bounce" />
              <span className="font-mono text-xs font-bold tracking-wide text-zinc-200">
                12D <span className="text-zinc-500 font-normal text-[10px]">STREAK</span>
              </span>
            </div>

            {/* Elo Rating Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#121212] border border-[#27272a] rounded">
              <Trophy className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="font-mono text-xs font-bold text-[#10b981]">
                1842 <span className="text-zinc-500 font-normal text-[10px]">ELO</span>
              </span>
            </div>

            {/* Daily Blitz Button */}
            <button
              onClick={() => setBlitzModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10b981]/10 hover:bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] rounded text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 cursor-pointer shadow-sm shadow-[#10b981]/10"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Daily Blitz</span>
              <span className="sm:hidden">Blitz</span>
            </button>

            {/* Notifications toggle */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-zinc-400 hover:text-white border border-[#27272a] bg-[#121212] hover:bg-[#161616] rounded transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#10b981] rounded-full animate-pip" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0c0c0c] border border-[#27272a] rounded-lg shadow-2xl p-3 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
                    <span className="text-xs font-mono font-bold text-white uppercase">
                      SRS Flashcard Alerts
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#ef4444]/20 text-[#ef4444] rounded">
                      2 Overdue
                    </span>
                  </div>
                  <div className="py-2 space-y-2 text-xs">
                    <div
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigate('/revision');
                      }}
                      className="p-2 bg-[#161616] border border-[#27272a] rounded hover:border-[#10b981]/40 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-white font-bold">Course Schedule II</span>
                        <span className="text-[#ef4444]">32% Retention</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        Kahn&#39;s BFS in-degree invariant due for review.
                      </p>
                    </div>
                    <div
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigate('/revision');
                      }}
                      className="p-2 bg-[#161616] border border-[#27272a] rounded hover:border-[#10b981]/40 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-white font-bold">Trapping Rain Water</span>
                        <span className="text-[#ffb869]">45% Retention</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        Two-pointer bottleneck proof due for review.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Pill */}
            <NavLink
              to="/portfolio"
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 border border-[#27272a] hover:border-[#10b981]/50 bg-[#121212] rounded transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded bg-[#10b981] flex items-center justify-center font-black text-xs text-black">
                A
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-mono font-bold text-zinc-200 tracking-tight">
                  InterestingAary
                </span>
                <span className="text-[9px] font-mono text-[#10b981] uppercase -mt-0.5">
                  Guardian
                </span>
              </div>
            </NavLink>

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 border border-[#27272a] bg-[#121212] text-zinc-400 hover:text-white rounded"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0c0c0c] border-b border-[#27272a] px-4 py-3 space-y-1 animate-fadeIn">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-mono font-bold uppercase tracking-wider ${
                    active
                      ? 'bg-[#161616] text-[#10b981] border-l-2 border-[#10b981]'
                      : 'text-zinc-400 hover:text-white hover:bg-[#121212]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {active && <span className="text-[10px] text-[#10b981]">ACTIVE</span>}
                </button>
              );
            })}
          </div>
        )}
      </nav>

      {/* Daily Blitz Modal */}
      <DailyBlitzModal isOpen={blitzModalOpen} onClose={() => setBlitzModalOpen(false)} />
    </>
  );
};
