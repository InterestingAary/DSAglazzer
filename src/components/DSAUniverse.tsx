import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseNode, Problem } from '../types';
import { ArrowRight } from 'lucide-react';

interface DSAUniverseProps {
  nodes: UniverseNode[];
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
}

export const DSAUniverse: React.FC<DSAUniverseProps> = ({nodes, problems, onSelectProblem}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<UniverseNode | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const cx = x * scaleX;
      const cy = y * scaleY;
      setSelectedNode(nodes.find(node => {
        const dx = cx - node.position.x;
        const dy = cy - node.position.y;
        return dx * dx + dy * dy < 2500;
      }) || null);
    };

    const handleClick = () => {
      if (selectedNode) {
        const problem = problems.find(p => p.topic === selectedNode.topic);
        if (problem) onSelectProblem(problem);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.style.cursor = selectedNode ? 'pointer' : 'default';

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [nodes, problems, onSelectProblem, selectedNode]);

  const angle = Date.now() * 0.0001;
  const nodes3D = nodes.map((node, i) => ({
    ...node,
    theta: (i * 0.628) + angle,
    radius: 120 + Math.sin(i * 0.5 + angle) * 20,
  }));

  const projectedNodes = nodes3D.map(node => ({
    ...node,
    x: node.radius * Math.cos(node.theta) + 400,
    y: node.radius * Math.sin(node.theta) + 300,
  }));

  const statusColors = {
    completed: 'bg-[var(--color-accent-emerald)] text-white',
    in_progress: 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/20',
    locked: 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)]',
  };

  return (
    <div className="relative card p-3 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between mb-3 px-2 gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">DSA Universe</h2>
          <span className="text-[10px] font-mono text-[var(--color-text-muted)]">{nodes.length} topics</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" /> In Progress
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-emerald)]" /> Completed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--color-border)]" /> Not Started
          </span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-auto rounded-lg"
        style={{ background: 'rgba(8,9,14,0.8)' }}
      />
      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
        {projectedNodes.map((node) => {
          const scaleRatio = (node.radius / 140);
          const leftPct = (node.x / 800) * 100;
          const topPct = (node.y / 600) * 100;
          return (
            <div
              key={node.id}
              className={`absolute pointer-events-auto transition-all duration-200 ${
                selectedNode?.id === node.id ? 'z-20' : 'z-10'
              }`}
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                transform: `translate(-50%, -50%) scale(${selectedNode?.id === node.id ? 1.2 : scaleRatio})`,
              }}
              onClick={() => {
                const problem = problems.find(p => p.topic === node.topic);
                if (problem) onSelectProblem(problem);
              }}
            >
              <div className={`relative group w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-[10px] transition-all duration-200 ${statusColors[node.status]}`}>
                <span className="text-[8px] uppercase tracking-wider leading-none mb-0.5 opacity-70">{node.topic.split(' ')[0]}</span>
                <span className="text-xs font-bold leading-none">{node.solvedProblems}/{node.totalProblems}</span>
                {node.status === 'completed' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-accent-emerald)] rounded-full flex items-center justify-center text-[8px] text-white">✓</div>
                )}
              </div>
            </div>
          );
        })}

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
          {projectedNodes.map((node, i) =>
            projectedNodes.slice(i + 1).map((conn) => {
              if (!node.connections.includes(conn.id)) return null;
              return (
                <line
                  key={`${node.id}-${conn.id}`}
                  x1={node.x} y1={node.y}
                  x2={conn.x} y2={conn.y}
                  stroke="rgba(99,102,241,0.08)"
                  strokeWidth="0.5"
                  strokeDasharray="3 3"
                />
              );
            })
          )}
        </svg>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-3 left-3 right-3 card-elevated p-4 rounded-lg z-30"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {selectedNode.topic}
                </h3>
                <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">
                  {Math.round(selectedNode.progress)}% complete · {selectedNode.description}
                </p>
              </div>
              <button
                onClick={() => {
                  const problem = problems.find(p => p.topic === selectedNode.topic);
                  if (problem) onSelectProblem(problem);
                }}
                className="btn btn-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
              >
                Start <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};