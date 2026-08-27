import React, { useState } from 'react';
import { X, Menu } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({onSelectTab}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'practice', label: 'Practice' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'progress', label: 'Progress' },
    { id: 'revision', label: 'Revision' },
    { id: 'portfolio', label: 'Portfolio' },
  ];

  return (
    <footer className="glass-panel-heavy border-t border-glass-border mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8 pb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="text-xl sm:text-2xl font-black tracking-tighter text-text-primary">
              ALGO<span className="text-accent">.</span>ELITE
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-text-secondary">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className="py-1 transition-all duration-200 cursor-pointer text-text-secondary hover:text-text-primary"
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 glass-surface rounded-xl text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden glass-surface rounded-xl mt-4 px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl text-text-secondary hover:text-text-primary hover:bg-glass-bg transition-all cursor-pointer"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
};
