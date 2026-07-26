import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './Button';

export function GlassCard({ children, className, tilt = 0, delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -6, 0] }}
      transition={{ 
        repeat: Infinity, 
        duration: 4.5, 
        ease: "easeInOut",
        delay: delay 
      }}
      className={cn(
        "bg-white/[0.03] border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl",
        className
      )}
      style={{
        rotate: tilt
      }}
    >
      {children}
    </motion.div>
  );
}
