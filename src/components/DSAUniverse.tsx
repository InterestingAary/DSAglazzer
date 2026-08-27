import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseNode, Problem } from '../types';

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

  // Simple 2D orbital layout
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

  return (
    <div className="relative spatial-card p-4 overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-auto rounded-2xl"
        style={{ background: 'rgba(5,5,16,0.6)' }}
      />
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        {projectedNodes.map((node) => {
          const scaleRatio = (node.radius / 140);
          const leftPct = (node.x / 800) * 100;
          const topPct = (node.y / 600) * 100;
          return (
            <div
              key={node.id}
              className={`absolute pointer-events-auto transition-all duration-300 ${
                selectedNode?.id === node.id ? 'z-20' : 'z-10'
              }`}
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                transform: `translate(-50%, -50%) scale(${selectedNode?.id === node.id ? 1.3 : scaleRatio})`,
              }}
              onClick={() => {
                const problem = problems.find(p => p.topic === node.topic);
                if (problem) onSelectProblem(problem);
              }}
            >
              <div className={`relative group w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-[10px] transition-all duration-300 ${
                node.status === 'completed'
                  ? 'bg-accent text-white glow-accent'
                  : node.status === 'in_progress'
                  ? 'bg-accent-amber/20 text-accent-amber border border-accent-amber/30'
                  : 'bg-glass-bg text-text-muted border border-glass-border'
              }`}>
                <span className="text-[8px] uppercase tracking-wider leading-none mb-0.5">{node.topic.split(' ')[0]}</span>
                <span className="text-xs font-black leading-none">{node.solvedProblems}/{node.totalProblems}</span>
                {node.status === 'completed' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-emerald rounded-full flex items-center justify-center text-[8px] text-white">✓</div>
                )}
              </div>
            </div>
          );
        })}

        {/* Connection lines via SVG overlay */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
          {projectedNodes.map((node, i) =>
            projectedNodes.slice(i + 1).map((conn) => {
              if (!node.connections.includes(conn.id)) return null;
              return (
                <line
                  key={`${node.id}-${conn.id}`}
                  x1={node.x} y1={node.y}
                  x2={conn.x} y2={conn.y}
                  stroke="rgba(99,102,241,0.2)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })
          )}
        </svg>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-4 left-4 right-4 spatial-card-heavy p-5 rounded-2xl z-30"
          >
            <h3 className="font-heading text-lg font-bold text-text-primary mb-1">
              {selectedNode.topic}
            </h3>
            <p className="text-[10px] text-text-muted uppercase tracking-widest mb-3 font-bold">
              Progress: {Math.round(selectedNode.progress)}%
            </p>
            <p className="text-sm text-text-secondary mb-4 line-clamp-2">
              {selectedNode.description}
            </p>
            <button
              onClick={() => {
                const problem = problems.find(p => p.topic === selectedNode.topic);
                if (problem) onSelectProblem(problem);
              }}
              className="spatial-btn-solid px-5 py-2.5 text-sm font-bold uppercase tracking-wider cursor-pointer"
            >
              Start {selectedNode.topic}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
