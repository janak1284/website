import React from 'react';
import { motion } from 'framer-motion';

const speakers = [
  { name: "Alice Chen", role: "VP of Engineering", company: "TechNova", img: "https://i.pravatar.cc/400?img=1", type: "keynote" },
  { name: "Dr. Marcus Cole", role: "AI Researcher", company: "DeepMind", img: "https://i.pravatar.cc/400?img=11", type: "keynote" },
  { name: "Sarah Jenkins", role: "Founder", company: "Web3 Protocol", img: "https://i.pravatar.cc/300?img=5", type: "judge" },
  { name: "David Kim", role: "Design Director", company: "Creative Labs", img: "https://i.pravatar.cc/300?img=12", type: "judge" },
  { name: "Elena Rostova", role: "Security Lead", company: "ZeroTrust", img: "https://i.pravatar.cc/300?img=9", type: "mentor" },
];

export default function Speakers() {
  const keynotes = speakers.filter(s => s.type === 'keynote');
  const others = speakers.filter(s => s.type !== 'keynote');

  return (
    <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-8"
      >
        <h2 className="text-5xl md:text-7xl font-bold text-white font-display">Speakers &<br />Judges</h2>
        <p className="text-white/50 text-lg max-w-md mt-6 md:mt-0 text-right">Learn from the pioneers shaping the next decade of technology.</p>
      </motion.div>

      {/* Keynotes - Large Asymmetric Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {keynotes.map((speaker, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`group relative overflow-hidden bg-[#130d26]/40 border border-white/10 rounded-3xl aspect-square md:aspect-[4/5] ${i % 2 !== 0 ? 'md:mt-16' : ''}`}
          >
            <img src={speaker.img} alt={speaker.name} className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0710] via-[#0A0710]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="inline-block px-3 py-1 bg-[#8B5CF6] text-white text-xs font-bold uppercase tracking-widest rounded-full mb-3">Keynote</span>
              <h3 className="text-4xl font-display font-bold text-white mb-1">{speaker.name}</h3>
              <p className="text-white/80 text-lg">{speaker.role} @ {speaker.company}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Others - Tight Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {others.map((speaker, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            className="group flex flex-col"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl mb-4 border border-white/10">
              <img src={speaker.img} alt={speaker.name} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" />
            </div>
            <h3 className="text-xl font-display font-semibold text-white mb-1 group-hover:text-[#8B5CF6] transition-colors">{speaker.name}</h3>
            <p className="text-white/50 text-sm uppercase tracking-wider">{speaker.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
