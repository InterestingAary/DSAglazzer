import React, { useState } from 'react';
import { X, Menu } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'practice', label: 'Practice' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'progress', label: 'Progress' },
    { id: 'revision', label: 'Revision' },
  ];

  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-[var(--color-text-primary)]">DSA</span>
            <span className="text-sm font-bold text-[var(--color-accent)]">GLAZZER</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className="py-1 transition-colors duration-150 cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[var(--color-surface-elevated)] rounded-lg mt-3 px-3 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-wider rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-overlay)] transition-all cursor-pointer"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 divider text-center">
          <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
            Consistency beats intensity when intensity doesn't last.
          </p>
          <p className="text-[10px] text-[var(--color-text-muted)] font-mono mt-1">
            © 2024 DSAglazzer · Built with React, TypeScript, Vite
          </p>
        </div>
      </div>
    </footer>
  );
};