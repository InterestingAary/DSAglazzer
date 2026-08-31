import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseNode, Topic, Problem } from '../types';
import { problems } from '../data/problems';
import { useApp } from '../context/AppContext';
import { Compass, ChevronDown, ChevronUp } from 'lucide-react';

interface RoadmapViewProps {
  nodes: UniverseNode[];
  onSelectProblemById: (problemId: string) => void;
  onSelectTopic: (topic: Topic) => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'text-[var(--color-accent-emerald)]',
  Medium: 'text-[var(--color-accent-amber)]',
  Hard: 'text-[var(--color-accent-danger)]',
};

const ROADMAP_SECTIONS = [
  {
    title: 'Foundations',
    topics: ['Arrays', 'Strings', 'Two Pointers', 'Linked Lists', 'Stack & Queue'],
  },
  {
    title: 'Search & Trees',
    topics: ['Binary Search', 'Trees', 'Heaps', 'Graphs'],
  },
  {
    title: 'Advanced',
    topics: ['Dynamic Programming', 'Backtracking', 'Tries', 'Bit Manipulation'],
  },
];

export const RoadmapView: React.FC<RoadmapViewProps> = ({ nodes, onSelectProblemById, onSelectTopic }) => {
  const { getProblemStatus } = useApp();
  const [expandedTopic, setExpandedTopic] = useState<Topic | null>(null);

  return (
    <motion.section className="space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center gap-2">
        <Compass className="w-5 h-5 text-[var(--color-accent)]" />
        <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Curriculum Roadmap</h2>
      </div>

      <p className="text-sm text-[var(--color-text-secondary)]">
        Master DSA systematically. Click a topic to see its problems and start practicing.
      </p>

      {ROADMAP_SECTIONS.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionIndex * 0.1, duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-px h-8 bg-[var(--color-border)]" />
            <div className="pl-3 border-l border-[var(--color-border)]">
              <h3 className="text-[11px] uppercase tracking-wider text-[var(--color-accent)] font-semibold">{section.title}</h3>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{section.topics.length} topics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {section.topics.map((topic) => {
              const node = nodes.find(n => n.topic === topic);
              if (!node) return null;

              const isCompleted = node.status === 'completed';
              const isInProgress = node.status === 'in_progress';
              const isExpanded = expandedTopic === node.topic;
              const topicProblems = problems.filter(p => p.topic === node.topic);

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <div className="card p-4 group">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">{node.topic}</span>
                      <span className={`badge ${isCompleted ? 'badge-emerald' : isInProgress ? 'badge-accent' : ''}`}>
                        {Math.round(node.progress)}%
                      </span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-[var(--color-surface-elevated)] overflow-hidden mb-2.5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${node.progress}%`,
                          background: isCompleted
                            ? 'var(--color-accent-emerald)'
                            : isInProgress
                            ? 'var(--color-accent)'
                            : 'var(--color-border)',
                        }}
                      />
                    </div>

                    <p className="text-[10px] text-[var(--color-text-muted)] mb-3">{node.description}</p>

                    <button
                      onClick={() => setExpandedTopic(isExpanded ? null : node.topic)}
                      className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 rounded-md transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? 'Collapse' : `View ${node.topic}`}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 space-y-1.5 pt-3 divider">
                            {topicProblems.map((problem) => {
                              const status = getProblemStatus(problem.id);
                              const isSolved = status?.status === 'solved';
                              return (
                                <button
                                  key={problem.id}
                                  onClick={() => onSelectProblemById(problem.id)}
                                  className={`w-full text-left p-2.5 rounded-md text-xs transition-all cursor-pointer flex items-center justify-between ${
                                    isSolved
                                      ? 'bg-[var(--color-accent-emerald)]/5 border border-[var(--color-accent-emerald)]/15'
                                      : 'bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-overlay)] border border-[var(--color-border)]'
                                  }`}
                                >
                                  <span className={`font-medium ${isSolved ? 'text-[var(--color-accent-emerald)]' : 'text-[var(--color-text-primary)]'}`}>
                                    {isSolved && '✓ '}{problem.title}
                                  </span>
                                  <span className={`text-[10px] font-mono ${DIFFICULTY_COLORS[problem.difficulty]}`}>
                                    {problem.difficulty}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
};