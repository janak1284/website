import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"]
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const textX = useTransform(scrollYProgress, [0, 0.4], [-50, 0]);
  
  const statsOpacity = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);
  const statsX = useTransform(scrollYProgress, [0.2, 0.6], [50, 0]);

  return (
    <section ref={containerRef} className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
        
        <motion.div
          style={{ opacity: textOpacity, x: textX }}
          className="lg:col-span-7"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 font-['Orbitron'] tracking-wide">
            ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#C026D3]">RESONANCE</span>
          </h2>
          <p className="text-white/80 text-xl leading-relaxed font-light mb-6">
            <strong className="text-white font-medium">RESONANCE 1.0: The Ultimate Hackathon</strong> is a 48-hour national-level technical hackathon organized by TECHKNOTS and the School of Computer Science and Engineering, VIT Chennai.
          </p>
          <p className="text-white/60 text-lg leading-relaxed mb-6">
            Theme: <strong className="text-[#8B5CF6]">Planet 48: Tech for a resilient planet</strong>. The goal is to engineer a sustainable future by tackling meaningful challenges that matter to industries and society.
          </p>
          <p className="text-white/60 text-lg leading-relaxed">
            At Resonance, we believe in the power of collaboration, curiosity, and relentless problem-solving to create a better tomorrow.
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: statsOpacity, x: statsX }}
          className="lg:col-span-5 flex flex-col gap-6 lg:pl-12 py-4"
        >
          <div className="p-8 rounded-3xl bg-[#130d26]/40 border border-white/5 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-[#8B5CF6] font-['Orbitron'] mb-4 tracking-wider uppercase">Why Participate?</h3>
            <ul className="text-white/70 leading-relaxed space-y-4">
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> Solve Real-World Problems</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> Expert Mentorship</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> Win Exciting Prizes</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> Earn E-Certificates</li>
            </ul>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
