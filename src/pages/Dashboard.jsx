import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';

export function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4">
      <GlassCard className="p-12 max-w-4xl w-full text-center">
        <h1 className="text-4xl font-display text-white mb-6">Dashboard</h1>
        <p className="text-lg text-white/70">
          Placeholder for Dashboard content.
        </p>
      </GlassCard>
    </div>
  );
}
