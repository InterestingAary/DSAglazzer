import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { DSAUniverse } from '../components/DSAUniverse';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* ── ALGO_ELITE Hero Section & Telemetry Rings ──── */}
      <HeroSection />

      {/* ── DSA Domain Universe & Curated Arsenal ─────── */}
      <DSAUniverse />
    </div>
  );
};

export default Dashboard;
