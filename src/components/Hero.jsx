import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

const EASE = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const wordVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE }
  }
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: EASE } 
  }
};

export function Hero({ scrollYProgress }) {
  // Fade out hero content as user scrolls
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  const headline = "Technology that redefines the nature of interaction".split(" ");

  return (
    <motion.section 
      style={{ opacity, y }}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pointer-events-none"
    >
      <div className="max-w-4xl mx-auto text-center pointer-events-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeUpVariants} className="mb-8">
            <Badge icon={Sparkles}>Welcome to a new era</Badge>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white mb-6 leading-tight max-w-3xl flex flex-wrap justify-center gap-x-4">
            {headline.map((word, i) => (
              <motion.span key={i} variants={wordVariants}>
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p 
            variants={fadeUpVariants}
            className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl leading-relaxed"
          >
            We are building the foundational infrastructure for the next generation of digital experiences. Seamless, intelligent, and infinitely scalable.
          </motion.p>

          <motion.div 
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Button variant="primary">Get started</Button>
            <Button variant="secondary">See how it works</Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
