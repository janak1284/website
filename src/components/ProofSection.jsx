import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';

const EASE = [0.16, 1, 0.3, 1];

const cardVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction === 'left' ? -40 : 40,
    rotate: 0
  }),
  visible: (direction) => ({
    opacity: 1,
    x: 0,
    rotate: direction === 'left' ? -2 : 2,
    transition: { duration: 0.8, ease: EASE }
  })
};

export function ProofSection() {
  return (
    <section className="relative z-10 min-h-[250vh] pt-[50vh] pointer-events-none">
      <div className="max-w-6xl mx-auto px-6 h-full flex flex-col justify-between gap-[50vh] pb-[50vh]">
        
        {/* Left Card */}
        <div className="flex justify-start w-full">
          <motion.div
            custom="left"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            className="w-full max-w-sm pointer-events-auto"
          >
            <GlassCard tilt={-2} delay={0} className="p-8">
              <div className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
                Average Efficiency Gain
              </div>
              <div className="text-6xl font-bold bg-gradient-to-r from-brand-orange to-brand-red bg-clip-text text-transparent mb-4">
                68%
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                By streamlining data interactions in 3D space, teams report massive reductions in cognitive load.
              </p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Right Card */}
        <div className="flex justify-end w-full">
          <motion.div
            custom="right"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            className="w-full max-w-sm pointer-events-auto"
          >
            <GlassCard tilt={2} delay={1.5} className="p-8">
              <div className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
                Teams Worldwide
              </div>
              <div className="text-6xl font-bold bg-gradient-to-r from-brand-blue to-brand-violet bg-clip-text text-transparent mb-4">
                2,400+
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Trusted by enterprise organizations to visualize and navigate their most complex datasets.
              </p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Center smaller badge */}
        <div className="flex justify-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            viewport={{ once: false, amount: 0.5 }}
            className="pointer-events-auto"
          >
            <GlassCard className="px-6 py-4 flex items-center gap-4">
              <span className="text-3xl font-bold text-white">3x</span>
              <div className="h-8 w-px bg-white/20" />
              <span className="text-white/70 uppercase tracking-widest text-xs font-semibold">Faster deployment</span>
            </GlassCard>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
