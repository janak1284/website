import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';

export const Onboarding = () => {
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState('');
  const [participantType, setParticipantType] = useState('internal');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!fullName || !participantType) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://127.0.0.1:8000/api/auth/complete-profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          full_name: fullName, 
          participant_type: participantType
        })
      });
      
      if (res.ok) {
        toast.success("Profile completed successfully!");
        navigate('/dashboard');
      } else {
        const data = await res.json();
        toast.error(data.detail || "An unexpected error occurred");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error connecting to backend.");
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 flex items-center justify-center z-10 relative">
      <GlassCard className="p-12 max-w-md w-full flex flex-col">
        <h1 className="text-3xl font-display text-white mb-2 text-center">Welcome to Resonance</h1>
        <p className="text-white/70 text-sm mb-8 text-center">Please complete your profile to continue.</p>

        <div className="flex flex-col flex-grow">
          <div>
            <label className="text-sm text-white/60 mb-2 block font-sans">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded bg-white/10 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] border-none font-sans"
              required
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block font-sans">Participant Type</label>
            <div className="flex gap-4 font-sans">
              <div 
                onClick={() => setParticipantType('internal')}
                className={`flex-1 p-4 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center ${
                  participantType === 'internal'
                    ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/50'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="text-white font-display text-lg tracking-wide font-medium">Internal Participant</span>
              </div>
              
              <div 
                onClick={() => setParticipantType('external')}
                className={`flex-1 p-4 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center ${
                  participantType === 'external'
                    ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/50'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="text-white font-display text-lg tracking-wide font-medium">External Participant</span>
              </div>
            </div>
          </div>

          <Button variant="primary" className="w-full mt-8" onClick={handleSubmit}>
            Continue
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};
