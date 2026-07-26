import React from 'react';
import { motion } from 'framer-motion';

const schedule = [
  { day: "Day 1 - Friday, Oct 15", events: [
    { time: "09:00 AM", title: "Check-in & Breakfast", desc: "Arrive at the venue and collect your swag." },
    { time: "11:00 AM", title: "Opening Ceremony", desc: "Keynotes and track announcements." },
    { time: "12:00 PM", title: "Hacking Begins", desc: "Teams finalize ideas and start building." },
  ]},
  { day: "Day 2 - Saturday, Oct 16", events: [
    { time: "10:00 AM", title: "Mentorship Round 1", desc: "Experts visit tables to review progress." },
    { time: "03:00 PM", title: "Mini-Event: Lightning Talks", desc: "Short tech talks by our sponsors." },
    { time: "08:00 PM", title: "Checkpoint 2", desc: "Submit progress report." },
  ]},
  { day: "Day 3 - Sunday, Oct 17", events: [
    { time: "08:00 AM", title: "Code Freeze", desc: "Stop hacking, finalize presentations." },
    { time: "10:00 AM", title: "Judging Round 1", desc: "Science fair style judging." },
    { time: "02:00 PM", title: "Closing Ceremony", desc: "Winners announced, prizes distributed." },
  ]}
];

export default function Schedule() {
  return (
    <section className="relative z-10 py-32 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24"
      >
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">Event Timeline</h2>
      </motion.div>

      <div className="relative pl-8 md:pl-0">
        {/* The central vertical line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#8B5CF6]/50 to-transparent transform md:-translate-x-1/2" />

        <div className="space-y-24">
          {schedule.map((dayPlan, i) => (
            <div key={i} className="relative">
              
              {/* Day Header */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="sticky top-24 z-20 mb-12 flex justify-start md:justify-center"
              >
                <div className="bg-[#130d26] border border-[#8B5CF6]/40 text-[#8B5CF6] px-6 py-2 rounded-full font-display font-medium shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  {dayPlan.day}
                </div>
              </motion.div>

              <div className="space-y-16">
                {dayPlan.events.map((ev, j) => {
                  const isLeft = j % 2 === 0;
                  return (
                    <motion.div 
                      key={j}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className={`relative flex items-center justify-start md:justify-between w-full group`}
                    >
                      {/* Timeline Node Point */}
                      <div className="absolute left-0 md:left-1/2 w-3 h-3 rounded-full bg-[#8B5CF6] transform -translate-x-[5px] md:-translate-x-1.5 shadow-[0_0_10px_#8B5CF6] group-hover:scale-150 transition-transform" />
                      
                      {/* Time Marker */}
                      <div className={`hidden md:block w-5/12 ${isLeft ? 'text-right pr-12' : 'text-left pl-12 order-2'}`}>
                        <span className="text-[#A78BFA] font-display text-xl tracking-wider">{ev.time}</span>
                      </div>

                      {/* Content Branch */}
                      <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${isLeft ? 'md:pl-12 order-2' : 'md:pr-12 md:text-right'}`}>
                        <div className="md:hidden text-[#A78BFA] font-display mb-2">{ev.time}</div>
                        <h4 className="text-2xl font-semibold text-white mb-3 font-display">{ev.title}</h4>
                        <p className="text-white/60 leading-relaxed">{ev.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
