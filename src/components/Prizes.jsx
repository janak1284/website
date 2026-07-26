import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { Trophy, Medal, Award } from 'lucide-react';

export default function Prizes() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "center center"]
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [30, 0]);

  // Staggered podium reveals
  const firstOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const firstY = useTransform(scrollYProgress, [0.1, 0.4], [50, 0]);

  const secondOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
  const secondY = useTransform(scrollYProgress, [0.3, 0.6], [50, 0]);

  const thirdOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);
  const thirdY = useTransform(scrollYProgress, [0.5, 0.8], [50, 0]);

  return (
    <section ref={containerRef} className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
      <motion.div
        style={{ opacity: headerOpacity, y: headerY }}
        className="text-center mb-24"
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-['Orbitron'] tracking-wide uppercase">Prize Pool</h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">Over ₹20,000 in cash and goodies to be won by the most innovative teams.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row items-end justify-center gap-6 mt-12 max-w-5xl mx-auto">
        
        {/* 2nd Place */}
        <motion.div 
          style={{ opacity: secondOpacity, y: secondY }}
          className="w-full md:w-1/3 order-2 md:order-1 relative z-10"
        >
          <GlassCard className="p-8 text-center flex flex-col items-center h-full border-b-4 border-b-[#C0C0C0] bg-[#130d26]/60">
            <Medal className="w-12 h-12 mb-4 text-[#C0C0C0]" />
            <h3 className="text-lg font-medium text-white/80 mb-2">2nd Place</h3>
            <div className="text-4xl md:text-5xl font-bold text-white mb-8 font-['Orbitron']">₹6,000</div>
            <ul className="space-y-3 w-full text-left text-sm">
              <li className="text-white/70 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#C0C0C0]" /> Cash Prize</li>
              <li className="text-white/70 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#C0C0C0]" /> Certificates</li>
            </ul>
          </GlassCard>
        </motion.div>

        {/* 1st Place */}
        <motion.div 
          style={{ opacity: firstOpacity, y: firstY }}
          className="w-full md:w-5/12 order-1 md:order-2 relative z-20 md:-mb-12"
        >
          <GlassCard className="p-10 text-center flex flex-col items-center h-full border-[#FFD700]/50 bg-gradient-to-b from-[#8B5CF6]/20 to-[#130d26]/80 shadow-[0_0_50px_rgba(139,92,246,0.3)] border-b-4 border-b-[#FFD700]">
            <Trophy className="w-16 h-16 mb-4 text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
            <h3 className="text-xl font-semibold text-white/90 mb-2 uppercase tracking-widest">1st Place</h3>
            <div className="text-5xl md:text-6xl font-bold text-white mb-8 font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-white to-[#A78BFA]">₹10,000</div>
            <ul className="space-y-4 w-full text-left">
              <li className="text-white/80 font-medium flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />Cash Prize</li>
              <li className="text-white/80 font-medium flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />Winner Certificates</li>
              <li className="text-white/80 font-medium flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />Exclusive Goodies</li>
            </ul>
          </GlassCard>
        </motion.div>

        {/* 3rd Place */}
        <motion.div 
          style={{ opacity: thirdOpacity, y: thirdY }}
          className="w-full md:w-1/3 order-3 md:order-3 relative z-0 md:mt-12"
        >
          <GlassCard className="p-6 text-center flex flex-col items-center h-full border-b-4 border-b-[#CD7F32] bg-[#130d26]/40 opacity-90">
            <Award className="w-10 h-10 mb-4 text-[#CD7F32]" />
            <h3 className="text-base font-medium text-white/70 mb-2">3rd Place</h3>
            <div className="text-3xl md:text-4xl font-bold text-white mb-6 font-['Orbitron']">₹4,000</div>
            <ul className="space-y-2 w-full text-left text-sm">
              <li className="text-white/60 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#CD7F32]" /> Cash Prize</li>
              <li className="text-white/60 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#CD7F32]" /> Certificates</li>
            </ul>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: firstOpacity, y: firstY }}
        className="mt-32 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
      >
        <div className="p-6 rounded-2xl bg-[#130d26]/40 border border-white/5">
          <div className="text-4xl font-bold text-[#8B5CF6] font-['Orbitron'] mb-2">300+</div>
          <div className="text-sm text-white/60 uppercase tracking-widest">Expected Students</div>
        </div>
        <div className="p-6 rounded-2xl bg-[#130d26]/40 border border-white/5">
          <div className="text-4xl font-bold text-[#C026D3] font-['Orbitron'] mb-2">2-5</div>
          <div className="text-sm text-white/60 uppercase tracking-widest">Members / Team</div>
        </div>
        <div className="p-6 rounded-2xl bg-[#130d26]/40 border border-white/5">
          <div className="text-4xl font-bold text-[#4C1D95] font-['Orbitron'] mb-2">48</div>
          <div className="text-sm text-white/60 uppercase tracking-widest">Hours Non-stop</div>
        </div>
        <div className="p-6 rounded-2xl bg-[#130d26]/40 border border-white/5">
          <div className="text-3xl font-bold text-white font-['Orbitron'] mb-2 flex items-center justify-center h-10">VIT</div>
          <div className="text-sm text-white/60 uppercase tracking-widest">Chennai Venue</div>
        </div>
      </motion.div>
    </section>
  );
}
