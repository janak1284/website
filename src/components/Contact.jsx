import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { Button } from './ui/Button';

export default function Contact() {
  return (
    <section className="relative z-10 py-24 px-6 max-w-4xl mx-auto text-center border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6">Ready to Resonate?</h2>
        <p className="text-white/60 text-lg mb-10">Registration closes on September 1st. Don't miss your chance to build the future.</p>
        
        <div className="flex justify-center mb-16">
          <a href="#" className="inline-block">
            <Button variant="primary" className="text-lg px-8 py-4">
              Register on EventHub
            </Button>
          </a>
        </div>

        <GlassCard className="p-8 md:p-12 text-left">
          <h3 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-2">Who can participate?</h4>
              <p className="text-white/60">Open to all UG & PG students from colleges across India.</p>
            </div>
            <div className="w-full h-px bg-white/5" />
            <div>
              <h4 className="text-lg font-medium text-white mb-2">Team Size?</h4>
              <p className="text-white/60">1 to 4 members per team.</p>
            </div>
            <div className="w-full h-px bg-white/5" />
            <div>
              <h4 className="text-lg font-medium text-white mb-2">Still have questions?</h4>
              <p className="text-white/60">
                Reach out to our Coordinators:<br/><br/>
                <strong className="text-white">Student Coordinators:</strong><br/>
                Nerolena: <a href="tel:8122226901" className="text-[#8B5CF6] hover:underline">8122226901</a><br/>
                Shriram: <a href="tel:9884464562" className="text-[#8B5CF6] hover:underline">9884464562</a><br/><br/>
                <strong className="text-white">Faculty Coordinators:</strong><br/>
                Dr. Yogesh C.<br/>
                Dr. Vatchala S.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
