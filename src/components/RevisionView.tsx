import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
} from 'lucide-react';
import { flashcardsDeck } from '../data/mockData';
import type { ARevisionItem } from '../data/mockData';

export const RevisionView: React.FC = () => {
  const navigate = useNavigate();
  const [deck, setDeck] = useState<ARevisionItem[]>(flashcardsDeck);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'warning' | 'normal'>('all');

  const filteredDeck = deck.filter((card) => {
    if (filter === 'all') return true;
    return card.urgency === filter;
  });

  const activeCard = filteredDeck[currentIndex] || filteredDeck[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredDeck.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredDeck.length) % filteredDeck.length);
  };

  const handleRateCard = (rating: 'again' | 'hard' | 'good' | 'mastered') => {
    if (!activeCard) return;

    let newRetention = activeCard.retention;
    let newInterval = activeCard.intervalDays;
    let newUrgency = activeCard.urgency;

    switch (rating) {
      case 'again':
        newRetention = Math.max(20, activeCard.retention - 25);
        newInterval = 1;
        newUrgency = 'urgent';
        break;
      case 'hard':
        newRetention = Math.min(75, activeCard.retention + 10);
        newInterval = 3;
        newUrgency = 'warning';
        break;
      case 'good':
        newRetention = Math.min(92, activeCard.retention + 20);
        newInterval = 7;
        newUrgency = 'normal';
        break;
      case 'mastered':
        newRetention = 98;
        newInterval = 14;
        newUrgency = 'normal';
        break;
    }

    const updatedDeck = deck.map((c) =>
      c.id === activeCard.id
        ? {
            ...c,
            retention: newRetention,
            intervalDays: newInterval,
            urgency: newUrgency,
            daysAgo: 0,
          }
        : c
    );

    setDeck(updatedDeck);
    setIsFlipped(false);

    // Save state
    try {
      localStorage.setItem('algo_elite_srs_deck', JSON.stringify(updatedDeck));
    } catch {}

    setTimeout(() => {
      handleNext();
    }, 250);
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/30';
      case 'warning':
        return 'text-[#ffb869] bg-[#ffb869]/10 border-[#ffb869]/30';
      default:
        return 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30';
    }
  };

  const urgentCount = deck.filter((c) => c.urgency === 'urgent').length;
  const warningCount = deck.filter((c) => c.urgency === 'warning').length;
  const normalCount = deck.filter((c) => c.urgency === 'normal').length;

  return (
    <div className="space-y-8">
      {/* ── Header & SRS Telemetry ────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-[#0c0c0c] border border-[#27272a] rounded-xl">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-[#ffb869]" />
            <span>Spaced Repetition SRS Flashcard Deck</span>
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Active recall invariants, formal proofs, and asymptotic complexity flashcards.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={() => {
              setFilter('all');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-[#10b981] text-black font-bold'
                : 'bg-[#161616] text-zinc-400 border border-[#27272a]'
            }`}
          >
            All ({deck.length})
          </button>
          <button
            onClick={() => {
              setFilter('urgent');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
              filter === 'urgent'
                ? 'bg-[#ef4444] text-white font-bold'
                : 'bg-[#161616] text-[#ef4444] border border-[#ef4444]/30'
            }`}
          >
            Critical ({urgentCount})
          </button>
          <button
            onClick={() => {
              setFilter('warning');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
              filter === 'warning'
                ? 'bg-[#ffb869] text-black font-bold'
                : 'bg-[#161616] text-[#ffb869] border border-[#ffb869]/30'
            }`}
          >
            Decaying ({warningCount})
          </button>
          <button
            onClick={() => {
              setFilter('normal');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
              filter === 'normal'
                ? 'bg-[#10b981] text-black font-bold'
                : 'bg-[#161616] text-[#10b981] border border-[#10b981]/30'
            }`}
          >
            Mastered ({normalCount})
          </button>
        </div>
      </div>

      {/* ── Flashcard 3D Interactive Container ────────────── */}
      {filteredDeck.length === 0 ? (
        <div className="p-12 text-center bg-[#0c0c0c] border border-[#27272a] rounded-xl text-zinc-500 font-mono text-xs">
          All flashcards in this filter category have been revised. Great job!
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Card counter & deck progression */}
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
              Card {currentIndex + 1} of {filteredDeck.length}
            </span>
            <span>Click card to reveal proof & invariant</span>
          </div>

          {/* 3D Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="group relative w-full min-h-[380px] p-6 sm:p-8 bg-[#0c0c0c] hover:bg-[#121212] border border-[#27272a] hover:border-[#10b981]/50 rounded-2xl cursor-pointer shadow-2xl transition-all flex flex-col justify-between"
          >
            {/* Top Card Badges */}
            <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 border rounded ${
                    activeCard.difficulty === 'Easy'
                      ? 'text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10'
                      : activeCard.difficulty === 'Medium'
                      ? 'text-[#ffb869] border-[#ffb869]/30 bg-[#ffb869]/10'
                      : 'text-[#ef4444] border-[#ef4444]/30 bg-[#ef4444]/10'
                  }`}
                >
                  {activeCard.difficulty}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-[#161616] text-zinc-300 rounded border border-[#27272a]">
                  {activeCard.topic}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 border rounded ${getUrgencyBadge(
                    activeCard.urgency
                  )}`}
                >
                  {activeCard.urgency.toUpperCase()} · {activeCard.retention}% Retention
                </span>
              </div>
            </div>

            {/* Middle Card Content: Front vs Back */}
            {!isFlipped ? (
              /* FRONT: Prompt Question & Problem Title */
              <div className="my-auto py-8 text-center space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#10b981] font-bold">
                  Recall Prompt
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                  {activeCard.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-mono max-w-md mx-auto leading-relaxed">
                  What is the optimal loop invariant, asymptotic runtime, and edge-case boundary check for this problem?
                </p>

                {/* Retention Gauge */}
                <div className="max-w-xs mx-auto pt-4 space-y-1">
                  <div className="w-full h-1.5 bg-[#1f1f23] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        activeCard.retention >= 75
                          ? 'bg-[#10b981]'
                          : activeCard.retention >= 50
                          ? 'bg-[#ffb869]'
                          : 'bg-[#ef4444]'
                      }`}
                      style={{ width: `${activeCard.retention}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>Memory Decay</span>
                    <span>Next: +{activeCard.intervalDays} Days</span>
                  </div>
                </div>
              </div>
            ) : (
              /* BACK: Intuition, Invariant & Complexity Proof */
              <div className="my-auto py-4 space-y-4 font-mono text-xs text-left animate-fadeIn">
                <div className="space-y-1">
                  <span className="text-[#ffb869] font-bold uppercase tracking-wider text-[11px] block">
                    Core Algorithmic Intuition
                  </span>
                  <p className="text-zinc-200 leading-relaxed bg-[#161616] p-3 rounded-lg border border-[#27272a]">
                    {activeCard.intuition}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[#10b981] font-bold uppercase tracking-wider text-[11px] block">
                    Formal Invariant & Proof
                  </span>
                  <p className="text-zinc-300 leading-relaxed bg-[#161616] p-3 rounded-lg border border-[#27272a]">
                    {activeCard.invariant}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-[#121212] border border-[#27272a] rounded">
                    <span className="text-zinc-500 block">Time Complexity:</span>
                    <span className="text-white font-bold">{activeCard.timeComplexity}</span>
                  </div>
                  <div className="p-2 bg-[#121212] border border-[#27272a] rounded">
                    <span className="text-zinc-500 block">Space Complexity:</span>
                    <span className="text-white font-bold">{activeCard.spaceComplexity}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Card Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[#27272a] text-xs font-mono text-zinc-400">
              <span className="text-[11px]">
                {isFlipped ? 'Flip back' : 'Click anywhere to reveal'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/practice?id=${activeCard.problemId}`);
                }}
                className="flex items-center gap-1.5 text-xs text-[#10b981] hover:underline font-bold"
              >
                <Play className="w-3 h-3 fill-current" /> Solve in IDE
              </button>
            </div>
          </div>

          {/* ── Spaced Repetition SRS Rating Buttons ─────────── */}
          {isFlipped && (
            <div className="p-4 bg-[#0c0c0c] border border-[#27272a] rounded-xl space-y-3 animate-fadeIn">
              <span className="text-xs font-mono uppercase font-bold text-zinc-400 text-center block">
                Rate Your Recall (Updates SRS Spacing Algorithm)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                <button
                  onClick={() => handleRateCard('again')}
                  className="p-3 bg-[#ef4444]/10 hover:bg-[#ef4444]/20 border border-[#ef4444]/30 text-[#ef4444] rounded-lg font-bold transition-all cursor-pointer text-center"
                >
                  Again <span className="block text-[10px] text-zinc-400 font-normal">1 Day</span>
                </button>
                <button
                  onClick={() => handleRateCard('hard')}
                  className="p-3 bg-[#ffb869]/10 hover:bg-[#ffb869]/20 border border-[#ffb869]/30 text-[#ffb869] rounded-lg font-bold transition-all cursor-pointer text-center"
                >
                  Hard <span className="block text-[10px] text-zinc-400 font-normal">3 Days</span>
                </button>
                <button
                  onClick={() => handleRateCard('good')}
                  className="p-3 bg-[#10b981]/10 hover:bg-[#10b981]/20 border border-[#10b981]/30 text-[#10b981] rounded-lg font-bold transition-all cursor-pointer text-center"
                >
                  Good <span className="block text-[10px] text-zinc-400 font-normal">7 Days</span>
                </button>
                <button
                  onClick={() => handleRateCard('mastered')}
                  className="p-3 bg-[#06b9d4]/10 hover:bg-[#06b9d4]/20 border border-[#06b9d4]/30 text-[#06b9d4] rounded-lg font-bold transition-all cursor-pointer text-center"
                >
                  Mastered <span className="block text-[10px] text-zinc-400 font-normal">14 Days</span>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-[#121212] hover:bg-[#161616] border border-[#27272a] text-zinc-300 hover:text-white rounded-lg font-mono text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-[#121212] hover:bg-[#161616] border border-[#27272a] text-zinc-300 hover:text-white rounded-lg font-mono text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
