import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Button({ 
  children, 
  variant = 'primary', 
  className,
  ...props 
}) {
  const isPrimary = variant === 'primary';
  const prefersReducedMotion = useReducedMotion();
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current || prefersReducedMotion) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.2;
    const y = (e.clientY - top - height / 2) * 0.2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      whileHover={!prefersReducedMotion ? { scale: 1.04 } : {}}
      whileTap={!prefersReducedMotion ? { scale: 0.98 } : {}}
      className={cn(
        "relative flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-colors shadow-lg",
        isPrimary 
          ? "bg-[#8B5CF6] text-white border border-[#4C1D95] hover:bg-[#A78BFA] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]" 
          : "bg-transparent text-white/70 hover:text-white hover:bg-white/5",
        className
      )}
      {...props}
    >
      {children}
      {isPrimary && (
        <motion.div 
          className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20"
          initial={{ x: 0 }}
          whileHover={!prefersReducedMotion ? { x: 4 } : {}}
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.div>
      )}
    </motion.button>
  );
}
