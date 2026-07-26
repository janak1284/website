import React from 'react';
import { motion } from 'framer-motion';
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
  
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-colors",
        isPrimary 
          ? "bg-white/10 text-white border border-white/20 hover:bg-white/15" 
          : "bg-transparent text-white/70 hover:text-white",
        className
      )}
      {...props}
    >
      {children}
      {isPrimary && (
        <motion.div 
          className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10"
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.div>
      )}
    </motion.button>
  );
}
