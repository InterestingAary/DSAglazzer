import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Compass, RotateCcw, BarChart3, Globe } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'universe', label: 'UNIVERSE', icon: Compass, path: '/universe' },
  { id: 'roadmap', label: 'ROADMAP', icon: Compass, path: '/roadmap' },
  { id: 'revision', label: 'REVISION', icon: RotateCcw, path: '/revision' },
  { id: 'telemetry', label: 'TELEMETRY', icon: BarChart3, path: '/telemetry' },
  { id: 'portfolio', label: 'PORTFOLIO', icon: Globe, path: '/portfolio' },
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#080808]/95 backdrop-blur-xl border-b border-[#ffffff15]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
        {/* Brand & Title */}
        <div className="flex items-center gap-8 lg:gap-12">
          <NavLink
            to="/"
            className="flex items-center gap-2 group text-left cursor-pointer"
            style={{ textDecoration: 'none' }}
          >
            <div className="text-xl sm:text-2xl font-black tracking-tighter text-[#f5f5f5] group-hover:text-white transition-colors">
              ALGO<span className="text-[#10b981]">.</span>ELITE
            </div>
          </NavLink>

          {/* Desktop Navigation links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-[#a1a1aa]">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={`relative py-1 transition-all duration-150 cursor-pointer ${
                    active ? 'text-[#f5f5f5] font-bold' : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#10b981]" />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Right Section / Stats / CTAs */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Daily Streak Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#121212] border border-[#27272a]">
            <span className="w-2 h-2 bg-[#10b981]" />
            <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#f5f5f5]">
              12D STREAK
            </span>
          </div>

          {/* Daily Blitz Button */}
          <button
            className="px-4 py-1.5 border border-white text-xs uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer"
            style={{ background: 'none', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            Daily Blitz
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              className="p-2 text-[#a1a1aa] hover:text-white border border-[#27272a] bg-[#121212] transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <span className="w-3.5 h-3.5 bg-[#10b981] rounded-full" />
            </button>
          </div>

          {/* Profile Initials */}
          <div className="flex items-center gap-2 px-2.5 py-1 border border-[#27272a] hover:border-white bg-[#121212] transition-all cursor-pointer">
            <div className="w-5 h-5 bg-[#10b981] flex items-center justify-center font-bold text-[10px] text-black">
              A
            </div>
            <span className="hidden sm:inline text-xs font-mono font-bold text-[#f5f5f5] uppercase tracking-wider">
              InterestingAary
            </span>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 border border-[#27272a] text-[#a1a1aa] hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? ('X') : ('☰')}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0c0c] border-b border-[#27272a] px-4 py-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => {
                  window.location.href = item.path;
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-widest ${
                  active ? 'bg-[#161616] text-[#10b981] border-l-2 border-[#10b981]' : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {active && <span className="text-[10px] font-mono text-[#10b981]">ACTIVE</span>}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};