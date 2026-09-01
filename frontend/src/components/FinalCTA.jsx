import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';

const EASE = [0.16, 1, 0.3, 1];

export function FinalCTA() {
  return (
    <section className="py-40 relative z-10 overflow-hidden">
      {/* Soft blurred glow behind CTA */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-violet/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-5xl md:text-7xl font-semibold mb-8 tracking-tight"
        >
          Ready to enter the new era?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="text-xl text-white/60 mb-12 max-w-2xl mx-auto"
        >
          Join the waitlist today and be among the first to experience the future of spatial interaction.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="primary">Get started</Button>
          <Button variant="secondary">Contact sales</Button>
        </motion.div>
      </div>
    </section>
  );
}
