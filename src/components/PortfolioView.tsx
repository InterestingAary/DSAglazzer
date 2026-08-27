import React from 'react';
import { motion } from 'framer-motion';
import { ProjectInfo } from '../types';

interface PortfolioViewProps {
  projects?: ProjectInfo[];
}

const defaultProjects: ProjectInfo[] = [
  {
    id: 'proj-1',
    title: 'DSAglazzer',
    description: 'Offline-first spaced repetition DSA tracker with 365-day heatmap, streaks, and analytics',
    tech: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS'],
    githubUrl: 'https://github.com/InterestingAary/DSAglazzer',
    liveUrl: 'https://interestingaary.github.io/DSAglazzer/',
    featured: true,
  },
  {
    id: 'proj-2',
    title: 'Algorithm Visualizer',
    description: 'Interactive algorithm visualizations for learning DSA concepts',
    tech: ['D3.js', 'React', 'Canvas'],
    githubUrl: 'https://github.com/InterestingAary/algorithm-visualizer',
  },
  {
    id: 'proj-3',
    title: 'Code Challenges Bot',
    description: 'Telegram bot delivering daily coding problems with progress tracking',
    tech: ['Node.js', 'Python', 'API'],
    githubUrl: 'https://github.com/InterestingAary/code-bot',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export const PortfolioView: React.FC<PortfolioViewProps> = ({projects = defaultProjects}) => {
  return (
    <motion.section
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="font-heading text-xl font-bold text-text-primary gradient-text"
        variants={cardVariants}
      >
        PORTFOLIO & TERMINAL
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className={`spatial-card p-5 group ${project.featured ? 'gradient-border' : ''}`}
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-20 rounded-xl mb-3 flex items-center justify-center glass-surface">
              <span className="text-[10px] text-text-muted font-mono">Project Preview</span>
            </div>
            <h4 className="font-medium text-text-primary text-sm line-clamp-2 group-hover:text-accent transition-colors">
              {project.title}
            </h4>
            <p className="text-[10px] text-text-muted line-clamp-2 mb-3 mt-1">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] uppercase font-bold rounded-lg glass-surface px-2 py-1 text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs uppercase font-bold text-accent hover:underline"
                >
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs uppercase font-bold text-text-muted hover:text-text-primary transition-colors"
                >
                  GitHub
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Terminal Simulation */}
      <motion.div
        className="spatial-card p-6 noise-overlay"
        variants={cardVariants}
      >
        <h3 className="font-medium text-text-primary mb-4 text-sm uppercase tracking-wider relative z-10">CLI Transmission Terminal</h3>
        <div className="glass-surface rounded-2xl overflow-hidden p-4 relative z-10">
          <pre className="text-[10px] text-text-muted whitespace-pre-wrap font-mono leading-relaxed">
{`Terminal @interestingaary:~$ 
✓ ALGO_ELITE session active
│
├─ projects/ → 7 repos
├─ learning/ → DSA in progress
│
├─ $ git status
On branch main
Your branch is up to date with 'origin/main'
nothing to commit, working tree clean

└─ $ npm run revise
  ✓ Reviewing overdue items
  └─ Practice problem: Two Sum
✓ Session complete. 0.5h added.`}
          </pre>
        </div>
      </motion.div>
    </motion.section>
  );
};
