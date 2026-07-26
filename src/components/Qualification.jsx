import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Users, Send } from 'lucide-react';

const steps = [
  {
    icon: Terminal,
    title: "1. Register on EventHub",
    desc: "Create your profile and link your GitHub to enter the portal."
  },
  {
    icon: Users,
    title: "2. Form a Squad",
    desc: "Join forces with up to 3 other builders. Solo hackers are welcome."
  },
  {
    icon: Send,
    title: "3. Submit Proposal",
    desc: "Outline your approach before hacking begins to secure your spot."
  }
];

export default function Qualification() {
  return (
    <section className="relative z-10 py-32 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24"
      >
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 font-display">How to Enter</h2>
      </motion.div>

      <div className="relative">
        {/* Dashed Path Line */}
        <div className="absolute top-12 bottom-12 left-[40px] md:left-[50%] w-px border-l-2 border-dashed border-white/20 transform md:-translate-x-1/2" />
        
        <div className="space-y-24">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2 }}
              className={`relative flex flex-col md:flex-row items-center justify-between ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Overlapping Number */}
              <div className="absolute left-4 md:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-[150px] md:text-[200px] font-display font-bold text-white/5 z-0 pointer-events-none select-none">
                0{i + 1}
              </div>

              {/* Node Icon */}
              <div className="absolute left-[40px] md:left-1/2 top-12 md:top-1/2 md:-translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#0A0710] border-2 border-[#8B5CF6] flex items-center justify-center z-10 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                <step.icon className="w-5 h-5 text-[#8B5CF6]" />
              </div>

              {/* Empty Space for layout */}
              <div className="hidden md:block w-5/12" />

              {/* Content Card */}
              <div className="w-full md:w-5/12 pl-24 md:pl-0 relative z-10">
                <div className="p-8 bg-[#130d26]/80 backdrop-blur-md border border-white/10 rounded-3xl hover:border-[#8B5CF6]/40 transition-colors">
                  <h3 className="text-2xl font-bold text-white mb-3 font-display">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
