import React, { useState } from 'react';
import { Compass, Play, CheckCircle2, X } from 'lucide-react';

type Node = { id?: string; name: string; pct: number; count: number; done: number; total: number; due: number };

interface UniverseMapProps {
  topics: Node[];
  onSelectTopic: (name: string) => void;
  onExploreRoadmap: () => void;
}

export default function UniverseMap({ topics, onSelectTopic, onExploreRoadmap }: UniverseMapProps) {
  const [activeNode, setActiveNode] = useState<Node | null>(null);

  // Map real topics to showcase ids (Arrays, Strings, Trees, Graphs) – perfect copy of private showcase
  const order = ['Arrays', 'Strings', 'Trees', 'Graphs'];
  const showcase = order.map(id => topics.find(t => t.name.toLowerCase() === id.toLowerCase())).filter(Boolean) as Node[];
  // Fallback if few topics: use top 4 by count
  const showcaseNodes: Node[] = showcase.length >= 2 ? showcase : topics.slice(0, 4);
  const secondary = topics.filter(t => !showcaseNodes.some(s => s.name === t.name));

  return (
    <section className="relative overflow-hidden bg-[#0c0c0c] border border-[#ffffff15] flex flex-col min-h-[420px]">
      <div className="relative z-10 p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#ffffff15] bg-[#0c0c0c]/90">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-[#10b981]" />
          <h2 className="font-display text-lg sm:text-xl font-black uppercase tracking-tight text-[#f5f5f5]">DSA UNIVERSE</h2>
          <span className="text-xs font-mono uppercase tracking-wider text-[#71717a] hidden sm:inline">// Neural Constellation</span>
        </div>
        <button onClick={onExploreRoadmap} className="px-4 py-1.5 border border-white text-xs uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-colors flex items-center gap-2 cursor-pointer">
          <Compass className="w-3.5 h-3.5" /><span>Full Roadmap</span>
        </button>
      </div>

      <div className="relative z-10 flex-grow p-6 sm:p-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-center gap-3 sm:gap-6 flex-wrap py-6">
          {showcaseNodes.map((node, index) => {
            const isCompleted = node.pct === 100;
            const isActiveNode = node.due > 0;
            const showActive = showcaseNodes.some(n => n.due > 0) ? isActiveNode : index === Math.min(2, showcaseNodes.length - 1);
            const isLocked = node.pct === 0 && !showActive;
            return (
              <React.Fragment key={node.name}>
                <div className="flex flex-col items-center gap-3 relative">
                  <button
                    onClick={() => setActiveNode(node)}
                    className={`relative z-10 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${showActive ? 'w-16 h-16 sm:w-20 sm:h-20 border-2 border-[#10b981] text-[#10b981] bg-[#161616] shadow-[0_0_20px_rgba(16,185,129,0.2)]' : isCompleted ? 'w-12 h-12 sm:w-14 sm:h-14 border border-[#10b981] text-[#10b981] bg-[#121212]' : isLocked ? 'w-12 h-12 sm:w-14 sm:h-14 border border-[#27272a] text-[#52525b] bg-[#121212]' : 'w-12 h-12 sm:w-14 sm:h-14 border border-[#52525b] text-[#f5f5f5] bg-[#161616]'}`}
                  >
                    <span className={`font-display font-black ${showActive ? 'text-sm sm:text-base text-[#10b981]' : 'text-xs'}`}>{node.pct}%</span>
                    {isCompleted && <CheckCircle2 className="w-3 h-3 text-[#10b981] absolute -top-1 -right-1 bg-black rounded-full" />}
                  </button>
                  <span className={`font-display text-xs font-bold uppercase tracking-widest ${showActive ? 'text-[#10b981]' : isLocked ? 'text-[#52525b]' : 'text-[#a1a1aa]'}`}>{node.name}</span>
                  {showActive && (
                    <button onClick={(e) => { e.stopPropagation(); onSelectTopic(node.name); }} className="mt-1 whitespace-nowrap px-3 py-1 bg-[#10b981] text-black hover:bg-white font-mono text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer">
                      <Play className="w-2.5 h-2.5 fill-current" /><span>Practice</span>
                    </button>
                  )}
                </div>
                {index < showcaseNodes.length - 1 && <div className="h-[1px] w-6 sm:w-12 bg-[#27272a] shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>

        {secondary.length > 0 && (
          <div className="w-full max-w-3xl mt-4 pt-6 border-t border-[#27272a] flex flex-wrap items-center justify-center gap-3">
            {secondary.map(n => (
              <button key={n.name} onClick={() => setActiveNode(n)} className="px-3.5 py-1.5 border border-[#27272a] bg-[#161616] hover:border-white transition-colors flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#a1a1aa] hover:text-white cursor-pointer">
                <span className="w-1.5 h-1.5 bg-[#10b981]" /><span>{n.name}</span><span className="text-[#10b981] font-bold">({n.pct}%)</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {activeNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" onClick={() => setActiveNode(null)}>
          <div className="relative w-full max-w-lg bg-[#0c0c0c] border border-[#27272a] shadow-2xl p-6 sm:p-8" onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveNode(null)} className="absolute top-4 right-4 text-[#71717a] hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 border border-[#10b981] flex items-center justify-center font-display font-black text-base text-[#10b981] bg-[#161616]">{activeNode.pct}%</div>
              <div><h3 className="text-xl font-display font-black uppercase tracking-tight text-white">{activeNode.name} Domain</h3><p className="text-xs font-mono uppercase tracking-wider text-[#10b981]">{activeNode.done}/{activeNode.total} revisions cleared • {activeNode.count} problems</p></div>
            </div>
            <p className="text-xs text-[#a1a1aa] mb-6 leading-relaxed bg-[#161616] p-4 border border-[#27272a]">Master {activeNode.name} patterns — {activeNode.pct}% of scheduled revisions completed. {activeNode.due > 0 ? `${activeNode.due} due now.` : 'Keep the streak.'}</p>
            <div className="flex gap-2">
              <button onClick={() => { onSelectTopic(activeNode.name); setActiveNode(null); }} className="flex-1 py-2 bg-[#10b981] text-black font-mono text-xs font-black uppercase tracking-wider hover:bg-white cursor-pointer">Practice {activeNode.name}</button>
              <button onClick={() => setActiveNode(null)} className="px-4 py-2 border border-[#27272a] text-xs font-mono uppercase tracking-wider text-[#a1a1aa] hover:border-white hover:text-white cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}