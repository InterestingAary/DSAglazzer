import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Bell, Code2, Compass, BarChart3, RotateCcw,
  GitFork, Globe, Terminal, ExternalLink, CheckCircle2,
  Menu, X, User
} from 'lucide-react';
import { UserStats } from '../types';

interface NavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userStats: UserStats;
  onOpenDailyChallenge: () => void;
  onOpenPortfolioModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({currentTab, onSelectTab, userStats, onOpenDailyChallenge, onOpenPortfolioModal}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Terminal },
    { id: 'practice', label: 'Practice', icon: Code2 },
    { id: 'roadmap', label: 'Roadmap', icon: Compass },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'revision', label: 'Revision', icon: RotateCcw },
    { id: 'portfolio', label: 'Portfolio', icon: Globe },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel-heavy border-b-0 rounded-none">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8 lg:gap-12">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="text-xl sm:text-2xl font-black tracking-tighter text-text-primary group-hover:glow-text-accent transition-all">
              ALGO<span className="text-accent">.</span>ELITE
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative px-3 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-200 rounded-xl cursor-pointer ${
                    isActive
                      ? 'text-text-primary bg-glass-bg'
                      : 'text-text-secondary hover:text-text-primary hover:bg-glass-bg/50'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-accent rounded-full"
                      style={{ boxShadow: '0 0 12px rgba(99,102,241,0.5)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 glass-surface rounded-xl">
            <span className="w-2 h-2 bg-accent-emerald rounded-full animate-glow-pulse" />
            <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-text-primary">
              {userStats.streak}D STREAK
            </span>
          </div>

          <button
            onClick={onOpenDailyChallenge}
            className="spatial-btn px-4 py-1.5 text-xs uppercase font-bold tracking-widest text-accent cursor-pointer"
          >
            Blitz
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="p-2 text-text-secondary hover:text-text-primary glass-surface rounded-xl transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full animate-glow-pulse" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 spatial-card p-4 z-50"
                >
                  <div className="flex items-center justify-between border-b border-glass-border pb-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      System Telemetry
                    </span>
                    <span className="text-[10px] text-accent font-mono">3 New Alerts</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1 font-mono text-xs">
                    {[
                      { icon: CheckCircle2, color: 'text-accent-emerald', title: 'Merge Intervals Verified', detail: 'All 38 test suites executed successfully.' },
                      { icon: RotateCcw, color: 'text-accent-amber', title: 'DP Review Due', detail: '18 days since last Knapsack practice.' },
                      { icon: Flame, color: 'text-accent-emerald', title: 'Streak Milestone', detail: 'Consistency Machine badge unlocked.' },
                    ].map((alert, i) => (
                      <div key={i} className="p-2.5 glass-surface rounded-xl text-xs flex gap-2.5 items-start">
                        <alert.icon className={`w-3.5 h-3.5 ${alert.color} mt-0.5 shrink-0`} />
                        <div>
                          <p className="text-text-primary font-bold uppercase tracking-wide text-[11px]">{alert.title}</p>
                          <p className="text-[10px] text-text-muted">{alert.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1 glass-surface rounded-xl hover:border-accent/30 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 bg-accent rounded-lg flex items-center justify-center font-bold text-[10px] text-white">
                A
              </div>
              <span className="hidden sm:inline text-xs font-mono font-bold text-text-primary">
                {userStats.handle}
              </span>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 spatial-card p-4 z-50"
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-glass-border">
                    <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center font-black text-sm text-white">
                      A
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-text-primary uppercase tracking-tight">{userStats.name}</span>
                      <span className="text-xs font-mono text-text-muted">@{userStats.handle}</span>
                      <span className="text-[10px] text-accent font-mono uppercase tracking-wider font-bold">
                        {userStats.rank}
                      </span>
                    </div>
                  </div>

                  <div className="py-2 space-y-1 font-mono text-xs">
                    <button
                      onClick={() => {
                        onOpenPortfolioModal();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-2 glass-surface rounded-xl text-text-secondary hover:text-text-primary flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-accent" /> Bio & Projects
                      </span>
                    </button>

                    <a
                      href="https://github.com/InterestingAary"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full px-2.5 py-2 glass-surface rounded-xl text-text-secondary hover:text-text-primary flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <GitFork className="w-3.5 h-3.5 text-accent" /> GitHub Profile
                      </span>
                      <ExternalLink className="w-3 h-3 text-text-muted" />
                    </a>

                    <a
                      href="https://interestingaary.github.io/"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full px-2.5 py-2 glass-surface rounded-xl text-text-secondary hover:text-text-primary flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-accent" /> Live Portfolio
                      </span>
                      <ExternalLink className="w-3 h-3 text-text-muted" />
                    </a>
                  </div>

                  <div className="pt-3 border-t border-glass-border flex justify-between items-center text-[10px] text-text-muted font-mono uppercase tracking-wider">
                    <span>Rating: <strong className="text-text-primary">{userStats.rating}</strong></span>
                    <span className="text-accent font-bold">{userStats.totalSolved} SOLVED</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 glass-surface rounded-xl text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass-surface border-t border-glass-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'glass-surface text-accent'
                        : 'text-text-secondary hover:text-text-primary hover:bg-glass-bg'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="text-[10px] font-mono text-accent">ACTIVE</span>}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
