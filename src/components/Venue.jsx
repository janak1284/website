import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, CalendarDays } from 'lucide-react';

export default function Venue() {
  return (
    <section className="relative z-10 py-32 border-y border-white/5 bg-[#0A0710]/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        
        {/* Typographic Address Block */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pr-0 lg:pr-12"
        >
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-[#8B5CF6]/20 border border-[#8B5CF6]/50 text-[#8B5CF6] text-xs font-bold uppercase tracking-widest rounded-full mb-6">In-Person & Virtual</span>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 font-display">The Nexus</h2>
            <p className="text-white/60 text-lg max-w-md">Our main hub for the 48 hours. A state-of-the-art facility equipped with hardware labs, rest zones, and infinite coffee.</p>
          </div>

          <div className="space-y-8 border-t border-white/10 pt-8 mt-8">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-[#C026D3] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-xl font-bold text-white mb-1 font-display">Innovation Center, Block B</h4>
                <p className="text-white/50">128 Tech Boulevard<br />San Francisco, CA 94105</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CalendarDays className="w-6 h-6 text-[#8B5CF6] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-xl font-bold text-white mb-1 font-display">Doors Open</h4>
                <p className="text-white/50">Friday, Oct 15 @ 8:00 AM PST</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Navigation className="w-4 h-4" /> Get Directions
            </button>
          </div>
        </motion.div>

        {/* Edge-to-Edge Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[500px] w-full lg:w-[120%] lg:-ml-12 rounded-l-3xl overflow-hidden border border-white/10 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[#130d26] z-0 flex items-center justify-center">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            {/* Map Pin UI */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-[#8B5CF6]/20 border border-[#8B5CF6] rounded-full flex items-center justify-center mb-4 relative">
                <div className="absolute inset-0 bg-[#8B5CF6] rounded-full animate-ping opacity-20" />
                <MapPin className="w-8 h-8 text-[#8B5CF6]" />
              </div>
              <div className="px-4 py-2 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-white font-medium text-sm">
                Interactive Map Load
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
