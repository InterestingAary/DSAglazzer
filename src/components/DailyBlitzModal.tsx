import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, X, Clock, Play, Trophy, Sparkles } from 'lucide-react';
import { sampleProblems } from '../data/mockData';

interface DailyBlitzModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyBlitzModal: React.FC<DailyBlitzModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedProblem, setSelectedProblem] = useState(sampleProblems[0]);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Pick a random problem
      const randomIdx = Math.floor(Math.random() * sampleProblems.length);
      setSelectedProblem(sampleProblems[randomIdx]);
      setTimeLeft(900);
      setTimerRunning(true);
    } else {
      setTimerRunning(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeLeft]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleLaunch = () => {
    onClose();
    navigate(`/practice?id=${selectedProblem.id}`);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10';
      case 'Medium':
        return 'text-[#ffb869] border-[#ffb869]/30 bg-[#ffb869]/10';
      case 'Hard':
        return 'text-[#ef4444] border-[#ef4444]/30 bg-[#ef4444]/10';
      default:
        return 'text-zinc-400 border-zinc-700 bg-zinc-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0c0c0c] border border-[#27272a] shadow-2xl p-6 sm:p-8 rounded-lg">
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#10b981] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] rounded">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white uppercase font-display">
                  Daily Blitz Challenge
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#10b981]/20 text-[#10b981] font-bold uppercase rounded">
                  Live
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">15-minute speed intuition sprint</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white border border-transparent hover:border-[#27272a] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer display */}
        <div className="my-6 p-4 bg-[#161616] border border-[#27272a] rounded flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#ffb869]" />
            <div>
              <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider block">
                Sprint Target Time
              </span>
              <span className="text-2xl font-black font-mono text-white tracking-widest">
                {formattedTime}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-right">
            <div>
              <span className="text-[10px] text-zinc-400 font-mono uppercase block">Bonus Elo</span>
              <span className="text-sm font-mono font-bold text-[#10b981] flex items-center gap-1 justify-end">
                <Trophy className="w-3.5 h-3.5" /> +25 Rating
              </span>
            </div>
          </div>
        </div>

        {/* Challenge Problem Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400 font-bold">Assigned Problem</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 border rounded ${getDifficultyColor(
                  selectedProblem.difficulty
                )}`}
              >
                {selectedProblem.difficulty}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-[#27272a] text-zinc-300 rounded">
                {selectedProblem.topic}
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#121212] border border-[#27272a] rounded space-y-2">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <span>{selectedProblem.title}</span>
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
              {selectedProblem.description}
            </p>
            <div className="flex items-center gap-4 pt-2 text-[11px] font-mono text-zinc-400 border-t border-[#27272a]">
              <span>Time: {selectedProblem.timeComplexity}</span>
              <span>Space: {selectedProblem.spaceComplexity}</span>
              <span>Acceptance: {selectedProblem.acceptanceRate}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-[#27272a] flex items-center justify-between gap-4">
          <button
            onClick={() => {
              const randomIdx = Math.floor(Math.random() * sampleProblems.length);
              setSelectedProblem(sampleProblems[randomIdx]);
            }}
            className="px-3 py-2 text-xs font-mono uppercase text-zinc-400 hover:text-white border border-[#27272a] hover:bg-[#161616] rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reroll</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleLaunch}
              className="px-5 py-2 bg-[#10b981] hover:bg-[#34d399] text-black font-mono font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center gap-2 shadow-lg shadow-[#10b981]/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Launch IDE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
