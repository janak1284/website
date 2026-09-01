import React from 'react';
import { motion } from 'framer-motion';

const sponsors = {
  title: [ { name: "Vercel", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Vercel_logo_black.svg", width: "w-64" } ],
  gold: [
    { name: "Supabase", logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/Supabase_logo.svg", width: "w-48" },
    { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", width: "w-40" }
  ],
  partners: [
    { name: "GitHub", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg", width: "w-12" },
    { name: "Figma", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg", width: "w-10" },
    { name: "Notion", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg", width: "w-24" }
  ]
};

export default function Sponsors() {
  return (
    <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24"
      >
        <h2 className="text-5xl font-bold text-white mb-6 font-display">Powered By</h2>
      </motion.div>

      {/* Title Sponsor */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="flex justify-center mb-24 relative"
      >
        <div className="absolute inset-0 bg-[#8B5CF6]/20 blur-[100px] rounded-full" />
        <div className="relative p-12 bg-white rounded-3xl w-full max-w-3xl flex items-center justify-center border border-white/10 hover:border-[#8B5CF6]/50 transition-colors shadow-2xl">
          <img src={sponsors.title[0].logo} alt={sponsors.title[0].name} className={`${sponsors.title[0].width} object-contain`} />
        </div>
      </motion.div>

      {/* Gold Sponsors */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex justify-center gap-12 md:gap-24 mb-24 flex-wrap"
      >
        {sponsors.gold.map((sponsor, i) => (
          <div key={i} className="p-8 bg-white/90 rounded-2xl w-full max-w-md flex items-center justify-center border border-white/5 hover:bg-white transition-colors">
            <img src={sponsor.logo} alt={sponsor.name} className={`${sponsor.width} object-contain`} />
          </div>
        ))}
      </motion.div>

      {/* Partners */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex justify-center items-center gap-12 md:gap-20 flex-wrap opacity-50 hover:opacity-100 transition-opacity"
      >
        {sponsors.partners.map((sponsor, i) => (
          <div key={i} className="flex items-center justify-center invert">
            <img src={sponsor.logo} alt={sponsor.name} className={`${sponsor.width} object-contain`} />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
