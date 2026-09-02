import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from './Button';

export function GlassCard({ children, className, tilt = 0, delay = 0 }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={!prefersReducedMotion ? { y: [0, -6, 0] } : {}}
      transition={{ 
        repeat: Infinity, 
        duration: 4.5, 
        ease: "easeInOut",
        delay: delay 
      }}
      whileHover={!prefersReducedMotion ? { scale: 1.02, boxShadow: "0 0 30px rgba(139,92,246,0.15)" } : {}}
      className={cn(
        "bg-[#130d26]/40 border border-[#4C1D95]/40 backdrop-blur-md rounded-2xl shadow-2xl transition-all duration-300",
        className
      )}
      style={{
        rotate: !prefersReducedMotion ? tilt : 0
      }}
    >
      {children}
    </motion.div>
  );
}
