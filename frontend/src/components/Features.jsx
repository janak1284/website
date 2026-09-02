import React from 'react';
import { motion } from 'framer-motion';
import { Box, Cpu, Network, Layers, Shield, Zap } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

const EASE = [0.16, 1, 0.3, 1];

const features = [
  {
    icon: Box,
    title: "Spatial Data Architecture",
    description: "Organize complex datasets in true 3D space, mapping relationships that flat tables hide."
  },
  {
    icon: Network,
    title: "Real-time Synchronization",
    description: "Every node in your network updates instantly across all connected clients."
  },
  {
    icon: Cpu,
    title: "Neural Processing",
    description: "Built-in AI models pre-process and categorize incoming streams automatically."
  },
  {
    icon: Shield,
    title: "Quantum Encryption",
    description: "Next-generation security protocols ensure your structural data remains uncompromised."
  },
  {
    icon: Zap,
    title: "Zero-latency Rendering",
    description: "Custom WebGL pipeline pushes millions of points without dropping frames."
  },
  {
    icon: Layers,
    title: "Infinite Scalability",
    description: "From ten points to ten billion, the architecture scales horizontally on demand."
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } }
};

export function Features() {
  return (
    <section className="py-32 relative z-10 bg-black/40 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-semibold mb-6">Built for the future</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            A comprehensive suite of tools designed to handle the complexity of modern spatial applications.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div key={i} variants={itemVariants}>
              <motion.div 
                whileHover="hover" 
                className="h-full"
              >
                <GlassCard className="p-8 h-full transition-colors duration-500 hover:border-brand-violet/50">
                  <motion.div 
                    variants={{
                      hover: { scale: 1.1 }
                    }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange/20 to-brand-violet/20 flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_15px_rgba(125,91,255,0.2)]"
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-medium text-white mb-3">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
