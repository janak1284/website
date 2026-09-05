import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { AlertCircle, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export function Guidelines() {
  return (
    <div className="min-h-screen bg-[#0A0710] flex flex-col pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full mx-auto"
      >
        <div className="text-center mb-12">
          <Badge className="mb-4">Official Handbook</Badge>
          <h1 className="text-4xl md:text-5xl font-display text-white mb-6">Resonance 1.0 Guidelines</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <GlassCard className="p-6 md:p-8 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4 text-[#8B5CF6]">
              <ShieldCheck className="w-6 h-6" />
              <h2 className="text-2xl font-display text-white">Team Rules</h2>
            </div>
            <p className="text-white/70 leading-relaxed flex-grow">
              1 to 4 members per team. Open to all UG & PG students across India from any branch.
            </p>
          </GlassCard>

          <GlassCard className="p-6 md:p-8 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4 text-[#C026D3]">
              <Clock className="w-6 h-6" />
              <h2 className="text-2xl font-display text-white">Core Expectation</h2>
            </div>
            <p className="text-white/70 leading-relaxed flex-grow">
              48 hours to turn an idea into a working solution. From concept to prototype, every line of code counts.
            </p>
          </GlassCard>

          <GlassCard className="p-6 md:p-8 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4 text-[#8B5CF6]">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-2xl font-display text-white">Opportunities</h2>
            </div>
            <p className="text-white/70 leading-relaxed flex-grow">
              Winners get a shot at exclusive internship opportunities, and everyone gets to build their network and portfolio.
            </p>
          </GlassCard>

          <GlassCard className="p-6 md:p-8 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4 text-[#C026D3]">
              <MapPin className="w-6 h-6" />
              <h2 className="text-2xl font-display text-white">Venue Amenities</h2>
            </div>
            <p className="text-white/70 leading-relaxed flex-grow">
              High-speed internet, dedicated workspace, refreshments, and tech mentor support.
            </p>
          </GlassCard>

          <GlassCard className="p-6 md:p-8 h-full flex flex-col md:col-span-2">
            <div className="flex items-center gap-3 mb-4 text-[#8B5CF6]">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-2xl font-display text-white">Crucial Venue Protocols</h2>
            </div>
            <ul className="text-white/70 leading-relaxed space-y-2 flex-grow">
              <li>• Valid College ID card is mandatory for entry.</li>
              <li>• Hardware teams must bring their own components/microcontroller kits.</li>
              <li>• Leaving the premises after 8:00 PM without written approval is prohibited.</li>
              <li>• Organizing committee decisions are final.</li>
            </ul>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
}
