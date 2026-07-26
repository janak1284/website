import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Globe, Lock, Code } from 'lucide-react';

const tracks = [
  {
    icon: Globe,
    title: "Web3 & Decentralization",
    brief: "Build the next generation of decentralized apps, smart contracts, and robust blockchain tooling.",
    tag: "Hard",
    color: "#8B5CF6",
    size: "col-span-1 md:col-span-2 row-span-2"
  },
  {
    icon: Cpu,
    title: "AI & ML",
    brief: "Leverage open models.",
    tag: "Medium",
    color: "#C026D3",
    size: "col-span-1"
  },
  {
    icon: Lock,
    title: "Cybersecurity",
    brief: "Zero-trust systems.",
    tag: "Hard",
    color: "#4C1D95",
    size: "col-span-1"
  },
  {
    icon: Code,
    title: "Open Innovation",
    brief: "Got an idea that doesn't fit? Build anything you want.",
    tag: "Flexible",
    color: "#ffffff",
    size: "col-span-1 md:col-span-2"
  }
];

export default function ProblemStatements() {
  return (
    <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 font-display">Hackathon<br />Tracks</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[minmax(200px,auto)] gap-4">
        {tracks.map((track, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`group p-8 flex flex-col justify-between bg-[#130d26]/40 border border-white/5 hover:border-[${track.color}]/50 rounded-3xl transition-colors ${track.size}`}
            style={{ '--hover-color': track.color }}
          >
            <div className="flex justify-between items-start mb-12">
              <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center border border-white/10 group-hover:border-[var(--hover-color)] transition-colors">
                <track.icon className="w-5 h-5 text-white group-hover:text-[var(--hover-color)] transition-colors" />
              </div>
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full bg-black/40 border border-white/10 text-white/50 group-hover:text-white transition-colors">
                {track.tag}
              </span>
            </div>
            
            <div>
              <h3 className="text-3xl font-display font-semibold text-white mb-4 group-hover:text-[var(--hover-color)] transition-colors">{track.title}</h3>
              <p className="text-white/60 leading-relaxed max-w-md">{track.brief}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
