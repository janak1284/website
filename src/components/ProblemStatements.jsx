import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Cpu, Brain, Database, Shield, Layers, Terminal } from 'lucide-react';

const tracks = [
  {
    icon: Terminal,
    title: "Computer Science Engineering",
    brief: "Core developers, problem solvers, and system architects.",
    tag: "Core",
    color: "#8B5CF6",
    size: "col-span-1 md:col-span-2"
  },
  {
    icon: Brain,
    title: "AI & Machine Learning",
    brief: "Building intelligent systems and pushing the boundaries of AI.",
    tag: "Intelligence",
    color: "#C026D3",
    size: "col-span-1"
  },
  {
    icon: Database,
    title: "Data Science",
    brief: "Turning data into insights and driving data-powered solutions.",
    tag: "Analytics",
    color: "#4C1D95",
    size: "col-span-1"
  },
  {
    icon: Shield,
    title: "Cyber Security",
    brief: "Securing systems, networks, and the digital future.",
    tag: "Security",
    color: "#8B5CF6",
    size: "col-span-1 md:col-span-2"
  },
  {
    icon: Layers,
    title: "Software Engineering",
    brief: "Designing, developing and delivering scalable software solutions.",
    tag: "Systems",
    color: "#C026D3",
    size: "col-span-1 md:col-span-2"
  },
  {
    icon: Cpu,
    title: "IoT & Embedded Systems",
    brief: "Connecting devices and building smart, real-time applications.",
    tag: "Hardware",
    color: "#4C1D95",
    size: "col-span-1"
  }
];

const TrackCard = ({ track, index, scrollYProgress }) => {
  const start = index * 0.05;
  const end = start + 0.2;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [50, 0]);

  return (
    <motion.div 
      className={`group p-8 flex flex-col justify-between bg-[#130d26]/40 border border-white/5 hover:border-[${track.color}]/50 rounded-3xl transition-colors ${track.size}`}
      style={{ '--hover-color': track.color, opacity, y }}
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
        <h3 className="text-2xl font-bold font-['Orbitron'] tracking-wide text-white mb-4 group-hover:text-[var(--hover-color)] transition-colors">{track.title}</h3>
        <p className="text-white/60 leading-relaxed">{track.brief}</p>
      </div>
    </motion.div>
  );
};

export default function ProblemStatements() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "center center"]
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [30, 0]);

  return (
    <section ref={containerRef} className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
      <motion.div
        style={{ opacity: headerOpacity, y: headerY }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-['Orbitron'] tracking-wide uppercase">
          Hackathon <span className="text-[#8B5CF6]">Domains</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[minmax(200px,auto)] gap-4">
        {tracks.map((track, i) => (
          <TrackCard key={i} track={track} index={i} scrollYProgress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
