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
            Resonance is a <strong className="text-white font-medium">48-hour national level hackathon</strong> that brings together the brightest engineering minds from across the country to build innovative solutions for real-world challenges.
          </p>
          <p className="text-white/60 text-lg leading-relaxed mb-6">
            It is more than just a competition — it is a platform where creativity meets technology, ideas turn into impact, and future leaders are born.
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
            <h3 className="text-2xl font-bold text-[#8B5CF6] font-['Orbitron'] mb-4 tracking-wider uppercase">Our Vision</h3>
            <p className="text-white/70 leading-relaxed">
              To build a community of innovators who resonate with ideas, create meaningful solutions, and drive technological impact.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-[#130d26]/40 border border-white/5 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-[#C026D3] font-['Orbitron'] mb-4 tracking-wider uppercase">Our Mission</h3>
            <p className="text-white/70 leading-relaxed">
              To provide a high-energy, inclusive, and industry-connected platform that empowers students to innovate, collaborate, and transform ideas into real-world solutions.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
