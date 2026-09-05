import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ResonanceWordmark } from './ResonanceWordmark';
import { Link } from 'react-router-dom';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  }
};

export function Hero({ scrollYProgress }) {
  // Fade out hero content as user scrolls
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.1], [0, -100]);

  return (
    <motion.section 
      style={{ opacity, y }}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pointer-events-none"
    >
      <div className="max-w-4xl mx-auto text-center pointer-events-auto transform -translate-y-4 translate-x-3">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeUpVariants} className="mb-6">
            <Badge icon={Sparkles} className="text-xs md:text-sm px-4 py-2">Code. Create. Innovate.</Badge>
          </motion.div>

          <motion.div variants={fadeUpVariants} className="w-full mb-8">
            <ResonanceWordmark />
          </motion.div>

          <motion.div variants={fadeUpVariants} className="flex flex-row items-center gap-2 md:gap-4 mb-8">
            <div className="h-[1px] flex-1 max-w-[48px] bg-gradient-to-r from-transparent to-[#8B5CF6]"></div>
            <span className="text-xs sm:text-lg md:text-2xl text-[#8B5CF6] font-['Orbitron'] tracking-widest uppercase text-center whitespace-nowrap">
              48-Hour Hackathon
            </span>
            <div className="h-[1px] flex-1 max-w-[48px] bg-gradient-to-l from-transparent to-[#8B5CF6]"></div>
          </motion.div>

          <motion.p 
            variants={fadeUpVariants}
            className="text-sm md:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6"
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8B5CF6] w-4 h-4 md:w-5 md:h-5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              7-9 SEP 2026
            </span>
            <span className="hidden md:inline text-white/30">•</span>
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8B5CF6] w-4 h-4 md:w-5 md:h-5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              VIT CHENNAI
            </span>
          </motion.p>

          <motion.div 
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-6 sm:px-0"
          >
            <a href="https://eventhubcc.vit.ac.in/EventHub/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto"><Button variant="primary" className="w-full sm:w-auto">Register Now</Button></a>
            <Link to="/schedule" className="w-full sm:w-auto"><Button variant="secondary" className="w-full sm:w-auto">View Schedule</Button></Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
