import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  CheckCircle2,
  Play,
} from 'lucide-react';
import { sampleProblems, universeNodes } from '../data/mockData';
import type { ALDifficulty } from '../data/mockData';

export const DSAUniverse: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');

  const topicsList = ['All', ...universeNodes.map((n) => n.topic)];

  const filteredProblems = sampleProblems.filter((p) => {
    const matchesTopic = selectedTopic === 'All' || p.topic === selectedTopic;
    const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.timeComplexity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesDiff && matchesSearch;
  });

  const getDifficultyColor = (diff: ALDifficulty) => {
    switch (diff) {
      case 'Easy':
        return 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30';
      case 'Medium':
        return 'text-[#ffb869] bg-[#ffb869]/10 border-[#ffb869]/30';
      case 'Hard':
        return 'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Universe Domain Matrix ─────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#10b981]" />
              <span>DSA Domain Universe</span>
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              Core conceptual nodes with mastery metrics and asymptotic bounds.
            </p>
          </div>
          <button
            onClick={() => navigate('/roadmap')}
            className="text-xs font-mono font-bold uppercase tracking-wider text-[#10b981] hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Roadmap</span> →
          </button>
        </div>

        {/* Domain Matrix Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {universeNodes.map((node) => {
            const isSelected = selectedTopic === node.topic;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedTopic(isSelected ? 'All' : node.topic)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#161616] border-[#10b981] shadow-lg shadow-[#10b981]/10 scale-[1.02]'
                    : 'bg-[#0c0c0c] border-[#27272a] hover:border-[#10b981]/40 hover:bg-[#121212]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1">
                    <span>{node.tier}</span>
                    <span className="text-[#10b981] font-bold">{node.progress}%</span>
                  </div>
                  <h3 className="text-xs font-bold font-display text-white truncate">
                    {node.topic}
                  </h3>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="w-full h-1 bg-[#1f1f23] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#10b981] rounded-full"
                      style={{ width: `${node.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                    <span>{node.solvedProblems} Solved</span>
                    <span>{node.totalProblems} Total</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Problem Arsenal Filter & List ───────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 bg-[#0c0c0c] border border-[#27272a] rounded-xl">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search problems, patterns, time complexity (e.g. O(N), Two Pointers)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#121212] border border-[#27272a] focus:border-[#10b981] rounded-lg text-xs font-mono text-white placeholder-zinc-500 outline-none transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Topic Filter */}
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-2 bg-[#121212] border border-[#27272a] text-xs font-mono text-zinc-200 rounded-lg outline-none cursor-pointer hover:border-[#10b981]/40"
            >
              {topicsList.map((t) => (
                <option key={t} value={t}>
                  Topic: {t}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <div className="flex items-center bg-[#121212] border border-[#27272a] rounded-lg p-0.5">
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-2.5 py-1 text-xs font-mono uppercase rounded transition-colors cursor-pointer ${
                    difficultyFilter === diff
                      ? 'bg-[#27272a] text-white font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problem Arsenal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredProblems.map((problem) => {
            const isSolved = problem.status === 'solved';
            return (
              <div
                key={problem.id}
                onClick={() => navigate(`/practice?id=${problem.id}`)}
                className="p-4 bg-[#0c0c0c] hover:bg-[#121212] border border-[#27272a] hover:border-[#10b981]/50 rounded-xl transition-all cursor-pointer flex flex-col justify-between group shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 border rounded ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {problem.acceptanceRate} Pass
                    </span>
                  </div>

                  <h3 className="text-sm font-bold font-display text-white group-hover:text-[#10b981] transition-colors">
                    {problem.title}
                  </h3>

                  <p className="text-xs text-zinc-400 font-mono line-clamp-2 mt-1.5 leading-relaxed">
                    {problem.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#1f1f23] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">T: {problem.timeComplexity}</span>
                    <span className="text-zinc-600">/</span>
                    <span className="text-zinc-500">S: {problem.spaceComplexity}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[#10b981]">
                    {isSolved ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#10b981]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 group-hover:text-[#10b981]">
                        <Play className="w-3 h-3 fill-current" /> Solve
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
