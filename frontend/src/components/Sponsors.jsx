import React from 'react';
import { motion } from 'framer-motion';

import techknots from '../assets/sponsors_images/techknots.png';
import sponsor1 from '../assets/sponsors_images/sponsor1.jpeg';
import sponsor2 from '../assets/sponsors_images/sponsor2.jpeg';
import sponsor3 from '../assets/sponsors_images/sponsor3.jpeg';
import sponsor4 from '../assets/sponsors_images/sponsor4.jpeg';

const mainSponsor = { 
  name: "Techknots", 
  title: "Title Sponsor",
  logo: techknots, 
  width: "w-64 md:w-80" 
};

const otherSponsors = [
  { name: "Secure worldZ", title: "Co Sponsor", logo: sponsor1, width: "w-32 md:w-40" },
  { name: "Code Vipassana", title: "Mentoring Partner", logo: sponsor2, width: "w-32 md:w-40" },
  { name: "Decisome", title: "Branding Sponsor", logo: sponsor3, width: "w-32 md:w-40" },
  { name: "Eventopia", title: "Branding Partner", logo: sponsor4, width: "w-32 md:w-40" }
];

export default function Sponsors() {
  return (
    <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl font-bold text-white mb-6 font-display">Sponsors & Partners</h2>
      </motion.div>

      <div className="flex flex-col items-center gap-12">
        {/* Main Sponsor */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full flex justify-center"
        >
          <div className="p-10 md:p-14 bg-white/5 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center border border-white/10 hover:bg-white/10 transition-all shadow-2xl hover:scale-105 gap-6">
            <span className="text-xl md:text-2xl font-semibold text-purple-400 tracking-wider uppercase text-center">{mainSponsor.title}</span>
            <img src={mainSponsor.logo} alt={mainSponsor.name} className={`${mainSponsor.width} h-auto object-contain rounded-md`} />
          </div>
        </motion.div>

        {/* Other Sponsors (2 per row) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-6 md:gap-10 w-full max-w-3xl justify-items-center"
        >
          {otherSponsors.map((sponsor, i) => (
            <div key={i} className="w-full max-w-[280px] p-6 md:p-8 bg-white/5 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border border-white/10 hover:bg-white/10 transition-all shadow-lg hover:scale-105 gap-4">
              <span className="text-sm md:text-base font-medium text-purple-300/80 tracking-wide uppercase text-center">{sponsor.title}</span>
              <img src={sponsor.logo} alt={sponsor.name} className={`${sponsor.width} h-auto object-contain rounded-md`} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
