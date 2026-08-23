import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  Lock,
  Play,
  Trophy,
} from 'lucide-react';
import { roadmapStages, sampleProblems } from '../data/mockData';

export const RoadmapPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="p-6 bg-[#0c0c0c] border border-[#27272a] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#10b981]" />
            <h1 className="text-xl sm:text-2xl font-black font-display text-white">
              Algorithmic Curriculum Roadmap
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Structured tier-by-tier curriculum progression from fundamental invariants to state compression.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-[#161616] border border-[#27272a] text-[#10b981] font-bold rounded flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" /> 3 of 4 Tiers Unlocked
          </span>
        </div>
      </div>

      {/* ── Tier Progression Timeline ───────────────────────── */}
      <div className="space-y-6">
        {roadmapStages.map((stage) => {
          const isUnlocked = stage.requiredUnlocked;
          const stageProblems = sampleProblems.filter((p) =>
            stage.problemIds.includes(p.id)
          );

          return (
            <div
              key={stage.id}
              className={`p-6 bg-[#0c0c0c] border rounded-xl space-y-4 transition-all ${
                isUnlocked
                  ? 'border-[#27272a] hover:border-[#10b981]/50'
                  : 'border-[#1f1f23] opacity-75'
              }`}
            >
              {/* Stage Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#27272a]">
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs ${
                      isUnlocked
                        ? 'bg-[#10b981] text-black shadow-md shadow-[#10b981]/20'
                        : 'bg-[#27272a] text-zinc-500'
                    }`}
                  >
                    T{stage.tier}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold font-display text-white">
                        {stage.title}
                      </h2>
                      {!isUnlocked && (
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-[#ffb869] block">
                      {stage.subtitle}
                    </span>
                  </div>
                </div>

                {/* Progress ratio */}
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-zinc-400">
                    {stage.completedCount} / {stage.problemsCount} Mastered
                  </span>
                  <div className="w-24 h-2 bg-[#1f1f23] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#10b981] rounded-full"
                      style={{
                        width: `${(stage.completedCount / stage.problemsCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                {stage.description}
              </p>

              {/* Topics tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-mono text-zinc-500 mr-1">Modules:</span>
                {stage.topics.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-mono px-2 py-0.5 bg-[#161616] border border-[#27272a] text-zinc-300 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Problems included in stage */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {stageProblems.map((problem) => {
                  const isSolved = problem.status === 'solved';
                  return (
                    <div
                      key={problem.id}
                      onClick={() => navigate(`/practice?id=${problem.id}`)}
                      className="p-3 bg-[#121212] border border-[#27272a] hover:border-[#10b981]/50 hover:bg-[#161616] rounded-lg flex items-center justify-between cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        {isSolved ? (
                          <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-zinc-600 shrink-0" />
                        )}
                        <div>
                          <span className="text-xs font-bold font-display text-white group-hover:text-[#10b981] transition-colors block">
                            {problem.title}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {problem.topic} · {problem.timeComplexity}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            problem.difficulty === 'Easy'
                              ? 'text-[#10b981] bg-[#10b981]/10'
                              : problem.difficulty === 'Medium'
                              ? 'text-[#ffb869] bg-[#ffb869]/10'
                              : 'text-[#ef4444] bg-[#ef4444]/10'
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                        <Play className="w-3 h-3 text-zinc-500 group-hover:text-[#10b981] fill-current" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapPage;
