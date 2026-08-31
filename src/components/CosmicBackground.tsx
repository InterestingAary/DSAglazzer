import React from 'react';

export const CosmicBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.03) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.02) 0%, transparent 50%), var(--color-deep)',
      }}
    />
  );
};