import React from 'react';
import { motion } from 'framer-motion';
import { ProjectInfo } from '../types';
import { ExternalLink, GitFork, Globe } from 'lucide-react';

interface PortfolioViewProps {
  projects?: ProjectInfo[];
}

const defaultProjects: ProjectInfo[] = [
  {
    id: 'proj-1',
    title: 'DSAglazzer',
    description: 'Offline-first spaced repetition DSA tracker with heatmap, streaks, and analytics',
    tech: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS'],
    githubUrl: 'https://github.com/InterestingAary/DSAglazzer',
    liveUrl: 'https://interestingaary.github.io/DSAglazzer/',
    featured: true,
  },
];

export const PortfolioView: React.FC<PortfolioViewProps> = ({projects = defaultProjects}) => {
  return (
    <motion.section
      className="space-y-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Portfolio</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`card p-5 group ${project.featured ? 'gradient-border' : ''}`}
          >
            <div className="h-20 rounded-lg mb-3 flex items-center justify-center bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
              <span className="text-[10px] text-[var(--color-text-muted)] font-mono">{project.title}</span>
            </div>
            <h4 className="font-medium text-[var(--color-text-primary)] text-sm group-hover:text-[var(--color-accent)] transition-colors">
              {project.title}
            </h4>
            <p className="text-[10px] text-[var(--color-text-muted)] line-clamp-2 mb-3 mt-1">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tech.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] uppercase font-semibold rounded-md bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] px-2 py-0.5 text-[var(--color-text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold text-[var(--color-accent)] hover:underline"
                >
                  <Globe className="w-3 h-3" /> Live
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <GitFork className="w-3 h-3" /> Source
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Terminal */}
      <div className="card p-5 noise-overlay">
        <h3 className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mb-3 font-semibold relative z-10">Terminal</h3>
        <div className="bg-[var(--color-surface-elevated)] rounded-lg overflow-hidden p-4 relative z-10 border border-[var(--color-border-subtle)]">
          <pre className="text-[10px] text-[var(--color-text-muted)] whitespace-pre-wrap font-mono leading-relaxed">
{`$ git status
On branch main
Your branch is up to date with 'origin/main'
nothing to commit, working tree clean

$ npm run revise
✓ Reviewing overdue items
└─ Practice problem: Two Sum
✓ Session complete. 0.5h added.`}
          </pre>
        </div>
      </div>
    </motion.section>
  );
};
