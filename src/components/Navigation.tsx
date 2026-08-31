import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Bell, Code2, Compass, BarChart3, RotateCcw,
  GitFork, Globe, ExternalLink, CheckCircle2,
  Menu, X, User, Search, ChevronDown
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
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'practice', label: 'Practice', icon: Code2 },
    { id: 'roadmap', label: 'Roadmap', icon: Compass },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'revision', label: 'Revision', icon: RotateCcw },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--color-surface)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-1.5 group text-left cursor-pointer shrink-0"
          >
            <span className="text-base font-bold tracking-tight text-[var(--color-text-primary)]">
              DSA
            </span>
            <span className="text-base font-bold tracking-tight text-[var(--color-accent)]">
              GLAZZER
            </span>
          </button>

          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-150 rounded-md cursor-pointer ${
                    isActive
                      ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]'
                  }`}
                >
                  {item.label}
                  {isActive && <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[var(--color-accent)] rounded-full" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
            <Flame className="w-3 h-3 text-[var(--color-accent-amber)]" />
            <span className="font-mono text-[11px] font-semibold text-[var(--color-text-primary)]">
              {userStats.streak}d
            </span>
          </div>

          <button
            onClick={onOpenDailyChallenge}
            className="btn btn-primary px-3 py-1.5 text-[11px] uppercase font-semibold tracking-wider"
          >
            Blitz
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-2 w-80 card-elevated p-4 z-50"
                >
                  <div className="flex items-center justify-between divider pb-2 mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Notifications
                    </span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {userStats.totalSolved === 0 && userStats.streak === 0 ? (
                      <p className="text-[11px] text-[var(--color-text-muted)] text-center py-3">No notifications yet.</p>
                    ) : (
                      <>
                        {userStats.totalSolved > 0 && (
                          <div className="p-2.5 rounded-lg bg-[var(--color-surface-elevated)] text-xs flex gap-2.5 items-start">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent-emerald)] mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[var(--color-text-primary)] font-semibold text-[11px]">Problems Solved</p>
                              <p className="text-[10px] text-[var(--color-text-muted)]">{userStats.totalSolved} problems solved so far.</p>
                            </div>
                          </div>
                        )}
                        {userStats.streak > 0 && (
                          <div className="p-2.5 rounded-lg bg-[var(--color-surface-elevated)] text-xs flex gap-2.5 items-start">
                            <Flame className="w-3.5 h-3.5 text-[var(--color-accent-emerald)] mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[var(--color-text-primary)] font-semibold text-[11px]">Streak Active</p>
                              <p className="text-[10px] text-[var(--color-text-muted)]">{userStats.streak}-day streak.</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
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
              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-[var(--color-surface-elevated)] transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 bg-[var(--color-accent)] rounded-md flex items-center justify-center font-bold text-[10px] text-white">
                A
              </div>
              <ChevronDown className="w-3 h-3 text-[var(--color-text-muted)] hidden sm:block" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-2 w-56 card-elevated p-3 z-50"
                >
                  <div className="flex items-center gap-2.5 pb-2.5 divider mb-2">
                    <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center font-bold text-xs text-white">
                      A
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[var(--color-text-primary)]">{userStats.name}</span>
                      <span className="text-[10px] font-mono text-[var(--color-text-muted)]">@{userStats.handle}</span>
                    </div>
                  </div>

                  <div className="space-y-0.5 text-[11px]">
                    <button
                      onClick={() => {
                        onOpenPortfolioModal();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[var(--color-accent)]" /> Bio & Projects
                    </button>
                    <a
                      href="https://github.com/InterestingAary"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full px-2.5 py-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <GitFork className="w-3.5 h-3.5 text-[var(--color-accent)]" /> GitHub
                      </span>
                      <ExternalLink className="w-3 h-3 text-[var(--color-text-muted)]" />
                    </a>
                    <a
                      href="https://interestingaary.github.io/"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full px-2.5 py-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-[var(--color-accent)]" /> Portfolio
                      </span>
                      <ExternalLink className="w-3 h-3 text-[var(--color-text-muted)]" />
                    </a>
                  </div>

                  <div className="pt-2 mt-2 divider flex justify-between items-center text-[10px] text-[var(--color-text-muted)] font-mono">
                    <span>Rating: <strong className="text-[var(--color-text-primary)]">{userStats.rating}</strong></span>
                    <span className="text-[var(--color-accent)] font-semibold">{userStats.totalSolved} solved</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] transition-colors cursor-pointer"
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
            transition={{ duration: 0.15 }}
            className="md:hidden bg-[var(--color-surface)] border-t border-[var(--color-border)] overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider rounded-md transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="text-[10px] font-mono text-[var(--color-accent)]">ACTIVE</span>}
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