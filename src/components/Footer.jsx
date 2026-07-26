import React from 'react';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="py-12 border-t border-white/10 relative z-10 bg-black"
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-white/40 text-sm">
          © {new Date().getFullYear()} New Era Inc. All rights reserved.
        </div>
        <div className="flex gap-8 text-sm">
          <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy</a>
          <a href="#" className="text-white/60 hover:text-white transition-colors">Terms</a>
          <a href="#" className="text-white/60 hover:text-white transition-colors">Twitter</a>
          <a href="#" className="text-white/60 hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </motion.footer>
  );
}
