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
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-['Orbitron'] tracking-wide uppercase">₹60,000+ Prize Pool</h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">Massive rewards and goodies to be won by the most innovative teams.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
        
        {/* Prize Pool */}
        <motion.div 
          style={{ opacity: secondOpacity, y: secondY }}
          className="relative z-10"
        >
          <GlassCard className="p-8 text-center flex flex-col items-center h-full border-b-4 border-b-[#FFD700] bg-gradient-to-b from-[#8B5CF6]/10 to-[#130d26]/80 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            <Trophy className="w-12 h-12 mb-6 text-[#FFD700]" />
            <h3 className="text-xl font-semibold text-white/90 mb-4 uppercase tracking-widest">Rewards</h3>
            <div className="text-3xl font-bold text-white mb-4 font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-white to-[#A78BFA]">₹60K+ Prize Pool</div>
            <p className="text-white/70 leading-relaxed flex-grow">Massive cash rewards distributed among the top performing and most innovative teams.</p>
          </GlassCard>
        </motion.div>

        {/* Internships */}
        <motion.div 
          style={{ opacity: firstOpacity, y: firstY }}
          className="relative z-20"
        >
          <GlassCard className="p-8 text-center flex flex-col items-center h-full border-b-4 border-b-[#8B5CF6] bg-gradient-to-b from-[#C026D3]/10 to-[#130d26]/80 shadow-[0_0_30px_rgba(192,38,211,0.15)]">
            <Award className="w-12 h-12 mb-6 text-[#8B5CF6]" />
            <h3 className="text-xl font-semibold text-white/90 mb-4 uppercase tracking-widest">Career</h3>
            <div className="text-3xl font-bold text-white mb-4 font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-white to-[#C026D3]">Exclusive Internships</div>
            <p className="text-white/70 leading-relaxed flex-grow">Standout participants get a shot at exclusive internship opportunities with our partner companies.</p>
          </GlassCard>
        </motion.div>

        {/* Certificates */}
        <motion.div 
          style={{ opacity: thirdOpacity, y: thirdY }}
          className="relative z-10"
        >
          <GlassCard className="p-8 text-center flex flex-col items-center h-full border-b-4 border-b-[#4C1D95] bg-gradient-to-b from-[#8B5CF6]/10 to-[#130d26]/80 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            <Medal className="w-12 h-12 mb-6 text-[#4C1D95]" />
            <h3 className="text-xl font-semibold text-white/90 mb-4 uppercase tracking-widest">Recognition</h3>
            <div className="text-3xl font-bold text-white mb-4 font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-white to-[#A78BFA]">Certificates & Goodies</div>
            <p className="text-white/70 leading-relaxed flex-grow">Every participant receives a certificate of participation and exclusive event goodies.</p>
          </GlassCard>
        </motion.div>

      </div>

      <motion.div
        style={{ opacity: firstOpacity, y: firstY }}
        className="mt-32 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
      >
        <div className="p-6 rounded-2xl bg-[#130d26]/40 border border-white/5">
          <div className="text-4xl font-bold text-[#8B5CF6] font-['Orbitron'] mb-2">1-4</div>
          <div className="text-sm text-white/60 uppercase tracking-widest">Members / Team</div>
        </div>
        <div className="p-6 rounded-2xl bg-[#130d26]/40 border border-white/5">
          <div className="text-4xl font-bold text-[#C026D3] font-['Orbitron'] mb-2">48</div>
          <div className="text-sm text-white/60 uppercase tracking-widest">Hours Non-stop</div>
        </div>
        <div className="p-6 rounded-2xl bg-[#130d26]/40 border border-white/5">
          <div className="text-4xl font-bold text-[#4C1D95] font-['Orbitron'] mb-2">60K+</div>
          <div className="text-sm text-white/60 uppercase tracking-widest">Prize Pool</div>
        </div>
        <div className="p-6 rounded-2xl bg-[#130d26]/40 border border-white/5">
          <div className="text-3xl font-bold text-white font-['Orbitron'] mb-2 flex items-center justify-center h-10">VIT</div>
          <div className="text-sm text-white/60 uppercase tracking-widest">Chennai Venue</div>
        </div>
      </motion.div>
    </section>
  );
}
