import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const scheduleData = {
  day1: [
    { time: "08:30 AM", event: "Check-in + Problem Release" },
    { time: "09:00 AM", event: "Opening" },
    { time: "10:00 AM", event: "Workshop (10:00 AM - 12:00 PM)" },
    { time: "12:30 PM", event: "Problem Registration (12:30 - 1:00 PM)" },
    { time: "01:15 PM", event: "Lunch" },
    { time: "01:40 PM", event: "Venue Check-in" },
    { time: "02:00 PM", event: "Hackathon Begins" },
    { time: "05:00 PM", event: "Round 1 Evaluation" },
    { time: "05:15 PM", event: "Snacks (5:15 - 5:30 PM)" },
    { time: "07:00 PM", event: "Round 1 Results" },
    { time: "07:00 PM", event: "Dinner (7:00 - 7:50 PM)" },
    { time: "08:00 PM", event: "Venue Check-in" },
    { time: "08:00 PM+", event: "Hackathon Resumes (Night: JAM / Engagement Activities)" }
  ],
  day2: [
    { time: "07:00 AM", event: "Bonus Round" },
    { time: "09:00 AM", event: "Round 2 + 50% Breakfast" },
    { time: "11:00 AM", event: "Mentor Session" },
    { time: "12:10 PM", event: "Progression Statement" },
    { time: "04:00 PM", event: "Round 3 Evaluation" },
    { time: "05:00 PM", event: "Round 3 Results" },
    { time: "05:10 PM", event: "Snacks + JAM (5:10 - 5:20 PM)" },
    { time: "06:00 PM", event: "Bonus / Progression Statement" },
    { time: "07:00 PM", event: "Dinner (7:00 - 7:50 PM)" },
    { time: "08:00 PM", event: "Venue Check-in" },
    { time: "08:00 PM+", event: "Hackathon Continues" }
  ],
  day3: [
    { time: "12:00 AM", event: "Bonus Statement" },
    { time: "08:00 AM", event: "Bonus Round" },
    { time: "09:00 AM", event: "Breakfast Break (9:00 - 10:00 AM)" },
    { time: "10:00 AM", event: "Mentor Session (10:00 - 11:00 AM)" },
    { time: "11:20 AM", event: "Progression Statement" },
    { time: "01:00 PM", event: "Lunch Break (1:00 - 1:30 PM)" },
    { time: "02:30 PM", event: "Brainstorming Ends" },
    { time: "02:40 PM", event: "Round 4 Begins & Final Evaluation" },
    { time: "05:00 PM", event: "Hackathon Closure" }
  ]
};

export function ScheduleLive() {
  const [activeDay, setActiveDay] = useState('day1');

  return (
    <div className="min-h-screen bg-[#0A0710] flex flex-col pt-24 pb-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full mx-auto flex flex-col flex-grow"
      >
        <div className="text-center mb-10">
          <Badge className="mb-4">Critical Checkpoints & Judging</Badge>
          <h1 className="text-4xl md:text-5xl font-display text-white mb-6">Event Schedule | 3 Days, 4 Rounds</h1>
        </div>

        <GlassCard className="p-6 md:p-8 flex flex-col flex-grow">
          {/* Tab Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['day1', 'day2', 'day3'].map((day, idx) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-6 py-2 rounded-full font-display transition-all duration-300 border ${
                  activeDay === day 
                    ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.4)]' 
                    : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                Day {idx + 1}
              </button>
            ))}
          </div>

          <div className="relative min-h-[300px] flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {scheduleData[activeDay].map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-48 flex-shrink-0">
                      <span className="font-['Orbitron'] text-[#8B5CF6] tracking-wider font-semibold">
                        {item.time}
                      </span>
                    </div>
                    <div className="text-white/80 leading-relaxed font-medium">
                      {item.event}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
