import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const schedule = [
  { day: "Day 1", events: [
    { time: "09:00 AM", title: "Check-in & Problem Release", desc: "Get settled, meet your team and discover the challenge" },
    { time: "10:00 AM", title: "Inauguration", desc: "Official opening of Resonance 1.0" },
    { time: "02:00 PM", title: "Hackathon Begins", desc: "The building starts" },
    { time: "05:00 PM", title: "Round 1 Idea Evaluation", desc: "Pitch your concept and show the potential behind your idea" },
    { time: "07:00 PM", title: "Round 1 Results", desc: "The overnight grind begins" }
  ]},
  { day: "Day 2", events: [
    { time: "07:00 AM", title: "Bonus Round", desc: "An extra challenge. Extra opportunity" },
    { time: "09:00 AM", title: "Round 2", desc: "Keep building. Keep improving" },
    { time: "11:00 AM", title: "Mentor Session", desc: "Get guidance from experienced minds" },
    { time: "04:00 PM", title: "Round 3 Evaluation", desc: "Time to show your progress" },
    { time: "05:00 PM", title: "Round 3 Results", desc: "The competition gets tighter" },
    { time: "08:00 PM", title: "Hackathon Continues", desc: "Keep building through the night" }
  ]},
  { day: "Day 3", events: [
    { time: "08:00 AM", title: "Final Bonus Round", desc: "One last challenge" },
    { time: "10:00 AM", title: "Mentor Session", desc: "Final feedback" },
    { time: "11:20 AM", title: "Progression Statement", desc: "Final refinements" },
    { time: "02:30 PM", title: "Building Ends", desc: "No more brainstorming. Time to deliver" },
    { time: "02:40 PM", title: "Round 4 Final Evaluation", desc: "Present. Demonstrate. Defend your solution" },
    { time: "By 05:00 PM", title: "Hackathon Closure", desc: "And that's a wrap!" }
  ]}
];

const TimelineNode = ({ ev, isLeft, index, totalEvents, scrollYProgress }) => {
  // Map this specific node's reveal to a bracket of the overall scroll progress
  // e.g., if there are 9 events, node 0 reveals from 0.0 to 0.1
  const start = index / totalEvents;
  const end = Math.min(1, start + (1 / totalEvents));
  
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [20, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [0, 1]);

  return (
    <motion.div 
      style={{ opacity, y }}
      className={`relative flex items-center justify-start md:justify-between w-full group`}
    >
      {/* Timeline Node Point */}
      <motion.div 
        style={{ scale }}
        className="absolute left-0 md:left-1/2 w-3 h-3 rounded-full bg-[#8B5CF6] transform -translate-x-[5px] md:-translate-x-1.5 shadow-[0_0_10px_#8B5CF6] group-hover:scale-150 transition-transform" 
      />
      
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
};

export default function Schedule() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  let globalEventIndex = 0;
  const totalEvents = schedule.reduce((acc, day) => acc + day.events.length, 0);

  return (
    <section ref={containerRef} className="relative z-10 py-32 px-6 max-w-5xl mx-auto">
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
        {/* The central vertical line background */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/5 transform md:-translate-x-1/2" />
        
        {/* The dynamic glowing scroll line */}
        <motion.div 
          style={{ height: lineHeight }}
          className="absolute left-8 md:left-1/2 top-0 w-px bg-gradient-to-b from-[#8B5CF6] to-[#C026D3] shadow-[0_0_15px_#8B5CF6] transform md:-translate-x-1/2"
        />

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
                  const currentIndex = globalEventIndex++;
                  return (
                    <TimelineNode 
                      key={j}
                      ev={ev}
                      isLeft={isLeft}
                      index={currentIndex}
                      totalEvents={totalEvents}
                      scrollYProgress={scrollYProgress}
                    />
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
