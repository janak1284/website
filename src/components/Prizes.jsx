import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { Trophy, Medal, Award } from 'lucide-react';

export default function Prizes() {
  return (
    <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24"
      >
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">Prize Pool</h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">Over $20,000 in cash and prizes to be won across all tracks and categories.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row items-end justify-center gap-6 mt-12 max-w-5xl mx-auto">
        
        {/* 2nd Place */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full md:w-1/3 order-2 md:order-1 relative z-10"
        >
          <GlassCard className="p-8 text-center flex flex-col items-center h-full border-b-4 border-b-[#C0C0C0] bg-[#130d26]/60">
            <Medal className="w-12 h-12 mb-4 text-[#C0C0C0]" />
            <h3 className="text-lg font-medium text-white/80 mb-2">2nd Place</h3>
            <div className="text-4xl md:text-5xl font-bold text-white mb-8 font-display">$2,000</div>
            <ul className="space-y-3 w-full text-left text-sm">
              <li className="text-white/70">Nintendo Switch</li>
              <li className="text-white/70">1 Year Vercel Pro</li>
            </ul>
          </GlassCard>
        </motion.div>

        {/* 1st Place */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0 }}
          className="w-full md:w-5/12 order-1 md:order-2 relative z-20 md:-mb-12"
        >
          <GlassCard className="p-10 text-center flex flex-col items-center h-full border-[#FFD700]/50 bg-gradient-to-b from-[#8B5CF6]/20 to-[#130d26]/80 shadow-[0_0_50px_rgba(139,92,246,0.3)] border-b-4 border-b-[#FFD700]">
            <Trophy className="w-16 h-16 mb-4 text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
            <h3 className="text-xl font-semibold text-white/90 mb-2 uppercase tracking-widest">1st Place</h3>
            <div className="text-6xl md:text-7xl font-bold text-white mb-8 font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-[#A78BFA]">$5,000</div>
            <ul className="space-y-4 w-full text-left">
              <li className="text-white/80 font-medium flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />MacBook Pro M3</li>
              <li className="text-white/80 font-medium flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />Y-Combinator Interview</li>
              <li className="text-white/80 font-medium flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />Exclusive Merch</li>
            </ul>
          </GlassCard>
        </motion.div>

        {/* 3rd Place */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full md:w-1/3 order-3 md:order-3 relative z-0 md:mt-12"
        >
          <GlassCard className="p-6 text-center flex flex-col items-center h-full border-b-4 border-b-[#CD7F32] bg-[#130d26]/40 opacity-90">
            <Award className="w-10 h-10 mb-4 text-[#CD7F32]" />
            <h3 className="text-base font-medium text-white/70 mb-2">3rd Place</h3>
            <div className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">$1,000</div>
            <ul className="space-y-2 w-full text-left text-sm">
              <li className="text-white/60">AirPods Pro</li>
              <li className="text-white/60">Swag Box</li>
            </ul>
          </GlassCard>
        </motion.div>

      </div>
    </section>
  );
}
