import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const scheduleData = {
  day1: [
    { time: "09:00 AM", event: "Check-in & Problem Release (Get settled, meet your team and discover the challenge)" },
    { time: "10:00 AM", event: "Inauguration (Official opening of Resonance 1.0)" },
    { time: "02:00 PM", event: "Hackathon Begins (The building starts)" },
    { time: "05:00 PM", event: "Round 1 Idea Evaluation (Pitch your concept and show the potential behind your idea)" },
    { time: "07:00 PM", event: "Round 1 Results (The overnight grind begins)" }
  ],
  day2: [
    { time: "07:00 AM", event: "Bonus Round (An extra challenge. Extra opportunity)" },
    { time: "09:00 AM", event: "Round 2 (Keep building. Keep improving)" },
    { time: "11:00 AM", event: "Mentor Session (Get guidance from experienced minds)" },
    { time: "04:00 PM", event: "Round 3 Evaluation (Time to show your progress)" },
    { time: "05:00 PM", event: "Round 3 Results (The competition gets tighter)" },
    { time: "08:00 PM", event: "Hackathon Continues (Keep building through the night)" }
  ],
  day3: [
    { time: "08:00 AM", event: "Final Bonus Round (One last challenge)" },
    { time: "10:00 AM", event: "Mentor Session (Final feedback)" },
    { time: "11:20 AM", event: "Progression Statement (Final refinements)" },
    { time: "02:30 PM", event: "Building Ends (No more brainstorming. Time to deliver)" },
    { time: "02:40 PM", event: "Round 4 Final Evaluation (Present. Demonstrate. Defend your solution)" },
    { time: "By 05:00 PM", event: "Hackathon Closure (And that's a wrap!)" }
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
