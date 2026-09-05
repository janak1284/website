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
                <h4 className="text-xl font-bold text-white mb-1 font-display">School of Computer Science and Engineering (SCOPE)</h4>
                <p className="text-white/50">VIT Chennai</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CalendarDays className="w-6 h-6 text-[#8B5CF6] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-xl font-bold text-white mb-1 font-display">Check-in begins</h4>
                <p className="text-white/50">Sept 7 @ 9:00 AM IST</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <a href="https://maps.google.com/?q=VIT+Chennai" target="_blank" className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Navigation className="w-4 h-4" /> Get Directions
            </a>
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
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.040784935981!2d80.15085341527373!3d12.84064099094292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5259af8e491f67%3A0x944b42131b757d2d!2sVellore%20Institute%20of%20Technology%20-%20VIT%20Chennai!5e0!3m2!1sen!2sin!4v1693000000000!5m2!1sen!2sin" className="absolute inset-0 w-full h-full border-0 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </motion.div>

      </div>
    </section>
  );
}
