import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  {
    text: "This architecture fundamentally changed how we perceive our user data. It's not just a tool; it's a new medium.",
    author: "Elena Rostova",
    role: "CTO, DataTech Global"
  }
];

export function Testimonials() {
  return (
    <section className="py-32 relative z-10 bg-black/60 backdrop-blur-2xl border-y border-white/5">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-6xl text-brand-violet/40 font-serif mb-6 leading-none">"</div>
          <h3 className="text-3xl md:text-5xl font-medium leading-tight mb-10 text-white/90">
            {quotes[0].text}
          </h3>
          <div className="flex flex-col items-center">
            <div className="font-semibold text-white tracking-wide uppercase text-sm mb-1">{quotes[0].author}</div>
            <div className="text-white/50 text-sm">{quotes[0].role}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
