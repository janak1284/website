import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { RadioGroup, RadioGroupItem } from '../components/ui/RadioGroup';
import { Select } from '../components/ui/Select';
import { AlertDialog } from '../components/ui/AlertDialog';
import { Button } from '../components/ui/Button';

export const Onboarding = () => {
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState('');
  const [participantType, setParticipantType] = useState('internal');
  const [software, setSoftware] = useState('');
  
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const softwareOptions = [
    { value: 'vscode', label: 'Visual Studio Code' },
    { value: 'intellij', label: 'IntelliJ IDEA' },
    { value: 'figma', label: 'Figma' },
    { value: 'other', label: 'Other' }
  ];

  const handleAttemptSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !participantType || !software) {
      alert("Please fill in all fields.");
      return;
    }
    // Open warning dialog instead of submitting immediately
    setIsAlertOpen(true);
  };

  const handleFinalConfirm = () => {
    setIsAlertOpen(false);
    // Proceed with submission logic (e.g., API call)
    console.log("Submitted:", { fullName, participantType, software });
    // Navigate to dashboard or next step
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0A0710] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8B5CF6]/20 rounded-full blur-[120px] pointer-events-none" />

      <GlassCard className="w-full max-w-lg p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome to Resonance</h1>
          <p className="text-white/60 font-sans text-sm">Please complete your profile to continue.</p>
        </div>

        <form onSubmit={handleAttemptSubmit} className="space-y-6">
          {/* Step 1: Full Name */}
          <div>
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Step 2: Participant Type */}
          <div>
            <label className="text-sm text-white/60 font-sans mb-3 block">Participant Type</label>
            <RadioGroup value={participantType} onChange={setParticipantType}>
              <RadioGroupItem 
                value="internal" 
                label="Internal" 
                description="I am an internal team member"
              />
              <RadioGroupItem 
                value="external" 
                label="External" 
                description="I am an external participant or guest"
              />
            </RadioGroup>
          </div>

          {/* Step 3: Software Selection */}
          <div>
            <Select
              label="Assigned Software"
              options={softwareOptions}
              value={software}
              onChange={setSoftware}
              required
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <Button type="submit" variant="primary" className="w-full bg-[#8B5CF6] hover:bg-purple-600 text-white py-3 rounded-lg font-medium transition-colors">
              Continue
            </Button>
          </div>
        </form>
      </GlassCard>

      <AlertDialog 
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleFinalConfirm}
        title="Confirm Selection"
        message="Warning: You cannot go back or change your software once this selection is confirmed."
        confirmText="Yes, I'm sure"
        cancelText="Cancel"
      />
    </div>
  );
};
