import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Problem, Topic } from '../types';
import { useApp } from '../context/AppContext';
import { problems } from '../data/problems';
import { Search, Filter, X, ChevronDown, ChevronUp, BookOpen, Clock, Award, Zap, CheckCircle2 } from 'lucide-react';

type FilterType = 'all' | 'solved' | 'attempted' | 'due' | 'learning' | 'mastered';
type PlatformFilter = 'all' | 'leetcode' | 'codechef' | 'hackerrank' | 'codecademy';
type DifficultyFilter = 'all' | 'Easy' | 'Medium' | 'Hard';

interface ProblemRowProps {
  problem: Problem;
  status: string;
  revisionStatus?: string;
  nextReview?: number;
  onPractice: () => void;
  onViewSolution: () => void;
}

const ProblemRow: React.FC<ProblemRowProps> = ({ problem, status, revisionStatus, nextReview, onPractice, onViewSolution }) => {
  const isSolved = status === 'solved';
  const isOverdue = nextReview && nextReview < Date.now();

  const difficultyClasses: Record<string, string> = {
    Easy: 'badge-emerald',
    Medium: 'badge-amber',
    Hard: 'badge-danger',
  };

  const revisionClasses: Record<string, string> = {
    learning: 'badge-accent',
    familiar: 'badge-amber',
    strong: 'badge-emerald',
    mastered: 'badge-emerald',
  };

  return (
    <motion.div
      className="card p-4 hover:border-[var(--color-border-strong)] transition-colors"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 min-w-[280px]">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[var(--color-text-muted)]" />
          </div>
          <div>
            <h4 className="font-medium text-[var(--color-text-primary)] text-sm line-clamp-1">{problem.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge ${difficultyClasses[problem.difficulty]} text-[9px]`}>{problem.difficulty}</span>
              {problem.topic && <span className="badge badge-accent text-[9px]">{problem.topic}</span>}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 hidden sm:flex">
            {isSolved && (
              <span className="flex items-center gap-1 text-[var(--color-accent-emerald)] text-sm font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Solved
              </span>
            )}
            {!isSolved && status === 'attempted' && (
              <span className="flex items-center gap-1 text-[var(--color-accent-amber)] text-sm font-medium">
                <Zap className="w-3.5 h-3.5" /> Attempted
              </span>
            )}
            {!isSolved && status === 'unattempted' && (
              <span className="text-[var(--color-text-muted)] text-sm">Not started</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono ${isOverdue ? 'text-[var(--color-accent-danger)]' : 'text-[var(--color-text-muted)]'}`}>
              <Clock className="w-3 h-3 inline mr-1" />
              {isOverdue ? `${Math.ceil((Date.now() - (nextReview || 0)) / (24 * 60 * 60 * 1000))}d overdue` : 'No review scheduled'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onPractice} className="btn btn-primary px-3 py-1.5 text-[11px] font-semibold">
              Practice
            </button>
            <button onClick={onViewSolution} className="btn btn-ghost px-3 py-1.5 text-[11px] font-medium">
              Solution
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const MyProblems: React.FC = () => {
  const { state, solveProblem, getProblemStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'solved' | 'attempted' | 'due'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const status = getProblemStatus(problem.id);
      const currentStatus = status?.status || 'unattempted';

      if (searchQuery && !problem.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      if (statusFilter !== 'all' && currentStatus !== statusFilter) {
        return false;
      }

      if (difficultyFilter !== 'all' && problem.difficulty !== difficultyFilter) {
        return false;
      }

      return true;
    });
  }, [searchQuery, statusFilter, difficultyFilter, getProblemStatus]);

  const allTopics = useMemo(() => {
    const topics = new Set(problems.map(p => p.topic));
    return ['all', ...Array.from(topics).sort()] as string[];
  }, []);

  const stats = useMemo(() => {
    const solved = problems.filter(p => getProblemStatus(p.id)?.status === 'solved').length;
    const attempted = problems.filter(p => getProblemStatus(p.id)?.status === 'attempted').length;
    const total = problems.length;
    return { solved, attempted, total };
  }, [getProblemStatus]);

  return (
    <motion.section className="space-y-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">My Problems</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {stats.solved} solved · {stats.attempted} attempted · {stats.total} total
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search problems..."
          className="input w-full pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1">
          {(['all', 'solved', 'attempted'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-md transition-colors ${
                statusFilter === filter
                  ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/20'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] border border-transparent'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-1">
          {(['all', 'Easy', 'Medium', 'Hard'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setDifficultyFilter(filter)}
              className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-md transition-colors ${
                difficultyFilter === filter
                  ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/20'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] border border-transparent'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {problems.filter((problem) => {
          const status = getProblemStatus(problem.id);
          const currentStatus = status?.status || 'unattempted';

          if (statusFilter !== 'all' && currentStatus !== statusFilter) {
            return false;
          }

          if (difficultyFilter !== 'all' && problem.difficulty !== difficultyFilter) {
            return false;
          }

          return true;
        }).map((problem, index) => {
          const status = getProblemStatus(problem.id);
          const currentStatus = status?.status || 'unattempted';

          return (
            <motion.div
              key={problem.id}
              className="card p-4 hover:border-[var(--color-border-strong)] transition-colors"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 min-w-[280px]">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[var(--color-text-muted)]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--color-text-primary)] text-sm line-clamp-1">{problem.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`badge ${({Easy: 'badge-emerald', Medium: 'badge-amber', Hard: 'badge-danger'} as Record<string, string>)[problem.difficulty]} text-[9px]`}>{problem.difficulty}</span>
                      {problem.topic && <span className="badge badge-accent text-[9px]">{problem.topic}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 hidden sm:flex">
                    {getProblemStatus(problem.id)?.status === 'solved' && (
                      <span className="flex items-center gap-1 text-[var(--color-accent-emerald)] text-sm font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                      </span>
                    )}
                    {!getProblemStatus(problem.id)?.status && (
                      <span className="text-[var(--color-text-muted)] text-sm">Not started</span>
                    )}
                    {getProblemStatus(problem.id)?.status === 'attempted' && (
                      <span className="flex items-center gap-1 text-[var(--color-accent-amber)] text-sm font-medium">
                        <Zap className="w-3.5 h-3.5" /> Attempted
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => {}} className="btn btn-primary px-3 py-1.5 text-[11px] font-semibold">
                      Practice
                    </button>
                    <button onClick={() => {}} className="btn btn-ghost px-3 py-1.5 text-[11px] font-medium">
                      Solution
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};