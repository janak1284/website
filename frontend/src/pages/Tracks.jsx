import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { Code, Cpu, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Tracks() {
  return (
    <div className="min-h-screen bg-[#0A0710] flex flex-col pt-24 pb-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full mx-auto"
      >
        <div className="text-center mb-12">
          <Badge className="mb-4">1 Core Theme, 2 Focused Tracks</Badge>
          <h1 className="text-4xl md:text-5xl font-display text-white mb-4">Hackathon Tracks | Planet 48</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">Tech for a resilient planet. Engineer a sustainable future.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-8">
          
          <GlassCard className="p-6 md:p-8 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#C026D3]/20 rounded-lg">
                <Cpu className="w-8 h-8 text-[#C026D3]" />
              </div>
              <div>
                <h2 className="text-2xl font-display text-white">Track 01</h2>
                <h3 className="text-xl font-['Orbitron'] text-[#C026D3]">Hardware/IoT BUILD</h3>
              </div>
            </div>
            <p className="text-white/70 leading-relaxed mb-6 flex-grow">
              Design physical, sensor-driven devices and embedded systems that interact directly with the environment.
            </p>
            <div className="mt-auto">
              <div className="p-4 bg-[#C026D3]/10 border border-[#C026D3]/20 rounded-lg">
                <p className="text-sm text-[#C026D3]">
                  <strong>Crucial PS Notice:</strong> Problem Statements for this track will be released 1-2 days before the hackathon.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 md:p-8 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#8B5CF6]/20 rounded-lg">
                <Code className="w-8 h-8 text-[#8B5CF6]" />
              </div>
              <div>
                <h2 className="text-2xl font-display text-white">Track 02</h2>
                <h3 className="text-xl font-['Orbitron'] text-[#8B5CF6]">Software & AI CODE</h3>
              </div>
            </div>
            <p className="text-white/70 leading-relaxed mb-6 flex-grow">
              Develop data-driven apps, predictive models, and platforms to drive systemic environmental change.
            </p>
            <div className="mt-auto">
              <div className="p-4 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-lg">
                <p className="text-sm text-[#8B5CF6]">
                  <strong>Crucial PS Notice:</strong> Problem Statements for this track will be released on the day of the hackathon.
                </p>
              </div>
            </div>
          </GlassCard>

        </div>

        <div className="flex justify-center mt-8">
          <Link to="/dashboard">
            <Button>Go to Dashboard to Register</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
