import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-8"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 font-display leading-[1.1]">
            We are building a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#C026D3]">new resonance</span> in technology.
          </h2>
          <p className="text-white/70 text-xl leading-relaxed font-light mb-6">
            Resonance is a 48-hour global hackathon challenging developers, designers, and visionaries to rethink the fundamentals of human-computer interaction, decentralized trust, and synthetic intelligence.
          </p>
          <p className="text-white/50 text-lg leading-relaxed">
            Forget standard web apps. We're looking for deep tech, paradigm-shifting interfaces, and solutions that push the boundary of what's possible in a weekend.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-4 flex flex-col gap-8 border-l border-white/10 pl-8 lg:pl-12 py-4"
        >
          <div>
            <div className="text-6xl font-display font-bold text-[#8B5CF6] mb-2">48<span className="text-3xl text-white/40 ml-1">Hrs</span></div>
            <p className="text-white/60 font-medium uppercase tracking-widest text-sm">Of Continuous Building</p>
          </div>
          <div>
            <div className="text-6xl font-display font-bold text-[#C026D3] mb-2">10k<span className="text-3xl text-white/40 ml-1">+</span></div>
            <p className="text-white/60 font-medium uppercase tracking-widest text-sm">Global Hackers</p>
          </div>
          <div>
            <div className="text-6xl font-display font-bold text-white mb-2">$20k</div>
            <p className="text-white/60 font-medium uppercase tracking-widest text-sm">In No-Equity Prizes</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
