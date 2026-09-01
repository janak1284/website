import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AlertDialog } from '../components/ui/AlertDialog';
import toast from 'react-hot-toast';

export function Dashboard() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Forms
  const [teamName, setTeamName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoLink, setDemoLink] = useState('');
  
  const [problemStatements, setProblemStatements] = useState([]);
  const [timeLeft, setTimeLeft] = useState('');
  const [isWaitTime, setIsWaitTime] = useState(true);
  
  // Modal state
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [pendingPS, setPendingPS] = useState(null);
  
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [pendingTrack, setPendingTrack] = useState(null);

  // Stable tokens
  const [token] = useState(() => localStorage.getItem('access_token'));
  const [user] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));

  // Shared fetch helpers for action handlers
  const fetchTeam = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teams/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setTeam(await res.json());
      } else {
        setTeam(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProblemStatements = async (currentTeam = team) => {
    try {
      const url = currentTeam?.selected_track 
        ? `${import.meta.env.VITE_API_URL}/api/ps?track=${currentTeam.selected_track}` 
        : `${import.meta.env.VITE_API_URL}/api/ps`;
      const res = await fetch(url);
      if (res.ok) {
        setProblemStatements(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Initial load
  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
      try {
        const [teamRes, psRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/teams/me`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${import.meta.env.VITE_API_URL}/api/ps`)
        ]);
        
        if (isMounted) {
          if (teamRes.ok) {
            const teamData = await teamRes.json();
            setTeam(teamData);
            fetchProblemStatements(teamData);
          } else {
            setTeam(null);
            fetchProblemStatements(null);
          }
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    loadDashboardData();
    return () => { isMounted = false; };
  }, [token]);

  // Timer logic for Sept 7, 2026, 12:30 PM IST (UTC+5:30) (Opening time)
  useEffect(() => {
    const targetDate = new Date('2026-09-07T12:30:00+05:30').getTime();
    
    const interval = setInterval(() => {
      const distance = targetDate - Date.now();
      
      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft('00:00:00');
        setIsWaitTime(false);
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        setIsWaitTime(true);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleCreateTeam = async () => {
    if (!teamName) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teams/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: teamName })
      });
      if (res.ok) fetchTeam();
      else {
        const data = await res.json();
        toast.error(data.detail || "An unexpected error occurred");
      }
    } catch (err) { toast.error("An unexpected error occurred"); }
  };

  const handleJoinTeam = async () => {
    if (!joinCode) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teams/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ join_code: joinCode })
      });
      if (res.ok) {
        toast.success("Joined team successfully!");
        fetchTeam();
      } else {
        const data = await res.json();
        toast.error(data.detail || "An unexpected error occurred");
      }
    } catch (err) { toast.error("An unexpected error occurred"); }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teams/add-member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email: newMemberEmail })
      });
      if (res.ok) {
        setNewMemberEmail('');
        fetchTeam();
        toast.success("Member added successfully!");
      } else {
        const data = await res.json();
        toast.error(data.detail || "An unexpected error occurred");
      }
    } catch (err) { toast.error("An unexpected error occurred"); }
  };

  const handleClaimPS = async () => {
    if (!pendingPS) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ps/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ps_id: pendingPS.id })
      });
      if (res.ok) {
        toast.success("Claimed successfully!");
        setShowClaimModal(false);
        setPendingPS(null);
        fetchTeam();
      } else {
        const data = await res.json();
        toast.error(data.detail || "An unexpected error occurred");
      }
    } catch (err) { toast.error("An unexpected error occurred"); }
  };

  const handleSubmitFinal = async () => {
    if (!githubUrl || !demoLink) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions/final`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ github_url: githubUrl, demo_link: demoLink })
      });
      if (res.ok) toast.success("Final submission saved!");
      else {
        const data = await res.json();
        toast.error(data.detail || "An unexpected error occurred");
      }
    } catch (err) { toast.error("An unexpected error occurred"); }
  };

  const handleSelectTrack = async () => {
    if (!pendingTrack) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teams/select-track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ track: pendingTrack })
      });
      if (res.ok) {
        toast.success(`Track '${pendingTrack}' locked successfully!`);
        setShowTrackModal(false);
        setPendingTrack(null);
        fetchTeam();
      } else {
        const data = await res.json();
        toast.error(data.detail);
      }
    } catch (err) { toast.error("An unexpected error occurred"); }
  };

  const handleLeaveTeam = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teams/leave`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success(team.leader_id === user.id ? "Team disbanded successfully" : "Left team successfully");
        setTeam(null);
      } else {
        const data = await res.json();
        toast.error(data.detail || "An unexpected error occurred");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-24 text-white">Loading...</div>;

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 max-w-7xl mx-auto z-10 relative">
      {!team ? (
        <div className="flex flex-col md:flex-row justify-center mt-20 gap-8">
          <GlassCard className="p-12 max-w-md w-full text-center flex flex-col">
            <h2 className="text-3xl font-display text-white mb-6">Create Your Team</h2>
            <p className="text-white/70 mb-6 text-sm">Start a new team as a leader.</p>
            <input 
              type="text" 
              placeholder="Team Name" 
              className="w-full p-3 rounded bg-white/10 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <Button variant="primary" onClick={handleCreateTeam} className="w-full mt-auto">Create Team</Button>
          </GlassCard>
          
          <GlassCard className="p-12 max-w-md w-full text-center flex flex-col">
            <h2 className="text-3xl font-display text-white mb-6">Join a Team</h2>
            <p className="text-white/70 mb-6 text-sm">Join an existing team with a code.</p>
            <input 
              type="text" 
              placeholder="Team Join Code" 
              className="w-full p-3 rounded bg-white/10 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <Button variant="primary" onClick={handleJoinTeam} className="w-full mt-auto">Join Team</Button>
          </GlassCard>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Header & Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <GlassCard className="p-6 h-full flex flex-col">
                <h2 className="text-2xl font-display text-white mb-2">{team.name}</h2>
                <div className="mb-4">
                  <Badge variant="glow">Join Code: {team.join_code}</Badge>
                </div>
                <div className="flex-grow">
                  <h3 className="text-[#A78BFA] font-semibold mb-2">Members ({team.members?.length || 1}/4)</h3>
                  <ul className="space-y-2 mb-6">
                    {team.members?.map(m => (
                      <li key={m.id} className="text-white/80 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#C026D3]"></div>
                        {m.name} {m.id === team.leader_id && "(Leader)"}
                      </li>
                    ))}
                  </ul>
                </div>
                {team.leader_id === user.id && (
                  <div className="mt-auto pt-4 border-t border-white/10 flex gap-2">
                    <input 
                      type="email" 
                      placeholder="Member Email" 
                      className="w-full p-2 rounded bg-white/10 text-white text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      disabled={team.members?.length >= 4}
                    />
                    <Button variant="outline" size="sm" onClick={handleAddMember} disabled={team.members?.length >= 4}>Add</Button>
                  </div>
                )}
                <div className="mt-4 flex">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={team.leader_id === user.id ? "border-red-500/50 text-red-400 hover:bg-red-500/10 w-full" : "w-full"}
                    onClick={handleLeaveTeam}
                  >
                    {team.leader_id === user.id ? "Disband Team" : "Leave Team"}
                  </Button>
                </div>
              </GlassCard>
            </div>
            
            {/* PS Selection */}
            <div className="md:col-span-2">
              <GlassCard className="p-6 h-full flex flex-col">
                {!team.selected_track ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-display text-white">Track Selection</h2>
                    </div>
                    <div className="text-white/70 mb-8 text-center">
                      <p>The team leader must lock in a track before problem statements can be claimed.</p>
                      <p className="text-[#C026D3] font-semibold mt-2">Warning: This choice is permanent.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                      {/* Software Track */}
                      <div className="border border-white/10 rounded-xl p-6 flex flex-col items-center text-center bg-white/5 hover:bg-white/10 transition-colors">
                        <h3 className="text-xl font-bold text-white mb-2">Software & AI</h3>
                        <p className="text-sm text-white/60 mb-6 flex-grow">Build web apps, mobile apps, or train AI models to solve digital challenges.</p>
                        {team.leader_id === user.id ? (
                          <Button variant="primary" className="w-full mt-auto" onClick={() => { setPendingTrack("software"); setShowTrackModal(true); }}>
                            Select Software
                          </Button>
                        ) : (
                          <Badge variant="outline" className="w-full justify-center mt-auto py-2 text-white/50">Waiting for Leader</Badge>
                        )}
                      </div>
                      
                      {/* Hardware Track */}
                      <div className="border border-white/10 rounded-xl p-6 flex flex-col items-center text-center bg-white/5 hover:bg-white/10 transition-colors">
                        <h3 className="text-xl font-bold text-white mb-2">Hardware/IoT</h3>
                        <p className="text-sm text-white/60 mb-6 flex-grow">Design circuits, microcontrollers, and IoT systems for physical challenges.</p>
                        {team.leader_id === user.id ? (
                          <Button variant="primary" className="w-full mt-auto" onClick={() => { setPendingTrack("hardware"); setShowTrackModal(true); }}>
                            Select Hardware
                          </Button>
                        ) : (
                          <Badge variant="outline" className="w-full justify-center mt-auto py-2 text-white/50">Waiting for Leader</Badge>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-display text-white">Problem Statements <span className="text-sm text-[#A78BFA] ml-2">({team.selected_track} track)</span></h2>
                      <div className="text-right">
                        
                      </div>
                    </div>
                
                {team.ps_id ? (
                  <div className="flex-grow flex items-center justify-center border border-[#8B5CF6]/30 rounded-xl bg-[#8B5CF6]/5 p-6">
                    <div className="text-center">
                      <Badge variant="glow" className="mb-4">Successfully Claimed</Badge>
                      <h3 className="text-2xl text-white font-semibold mb-2">{team.problem_statement?.title}</h3>
                      <p className="text-white/70">{team.problem_statement?.description}</p>
                    </div>
                  </div>
                ) : problemStatements.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center border border-white/5 rounded-xl bg-white/5 flex-grow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 w-12 h-12 mb-4">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <p className="text-white/60 text-lg font-display">Problem statements yet to be released.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                    {problemStatements.map(ps => {
                      const isFull = ps.claimed_count >= ps.max_quota;
                      const isSoftware = team.selected_track === 'software';
                      const isLocked = isSoftware && isWaitTime;
                      return (
                        <div key={ps.id} className="border border-white/10 rounded-xl p-4 flex flex-col bg-white/5 relative">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline">{ps.track}</Badge>
                            <span className="text-xs text-white/50">{ps.claimed_count}/{ps.max_quota} Claimed</span>
                          </div>
                          <h4 className="text-lg font-semibold text-white mb-2">{ps.title}</h4>
                          <p className="text-sm text-white/60 mb-4 flex-grow">{ps.description}</p>
                          
                          {isLocked && (
                            <Badge variant="outline" className="absolute top-4 left-1/2 -translate-x-1/2 text-yellow-400 border-yellow-400/50 bg-yellow-400/10">
                              Unlocks in {timeLeft}
                            </Badge>
                          )}
                          
                          {team.leader_id === user.id ? (
                            <Button 
                              variant={isFull || isLocked ? "outline" : "primary"}
                              disabled={isFull || isLocked}
                              onClick={() => { setPendingPS(ps); setShowClaimModal(true); }}
                              className="w-full mt-auto"
                            >
                              {isFull ? "Quota Full" : isLocked ? "Locked" : "Claim"}
                            </Button>
                          ) : (
                            <Badge variant="outline" className="mt-auto w-full justify-center py-2 text-white/50 border-white/10">View Only</Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
                </>
              )}
              </GlassCard>
            </div>
          </div>

          {/* Final Submission */}
          <GlassCard className="p-6 w-full flex flex-col">
            <h2 className="text-2xl font-display text-white mb-6">Round 4: Final Submission</h2>
            {team.leader_id === user.id ? (
              <div className="flex flex-col h-full flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow mb-6">
                  <div className="flex flex-col">
                    <label className="block text-sm text-white/70 mb-2">GitHub Repository URL</label>
                    <input 
                      type="url" 
                      placeholder="https://github.com/..." 
                      className="w-full p-3 rounded bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] mb-auto"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm text-white/70 mb-2">Demo Video Link</label>
                    <input 
                      type="url" 
                      placeholder="https://youtube.com/..." 
                      className="w-full p-3 rounded bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] mb-auto"
                      value={demoLink}
                      onChange={(e) => setDemoLink(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-auto">
                  <Button variant="primary" onClick={handleSubmitFinal}>Submit Project</Button>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-xl">
                {team.final_submission ? (
                  <div className="space-y-4 text-center w-full max-w-md">
                    <div className="text-xl text-white mb-6 font-display">Submission Completed</div>
                    <a href={team.final_submission.github_url} target="_blank" rel="noreferrer" className="block w-full p-4 bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 rounded-lg text-[#A78BFA] transition-colors shadow-lg">
                      View GitHub Repository
                    </a>
                    <a href={team.final_submission.demo_link} target="_blank" rel="noreferrer" className="block w-full p-4 bg-[#C026D3]/10 hover:bg-[#C026D3]/20 border border-[#C026D3]/30 rounded-lg text-[#e879f9] transition-colors shadow-lg">
                      View Demo Video
                    </a>
                  </div>
                ) : (
                  <div className="text-white/50 text-center text-lg">
                    Waiting for Team Leader to submit.
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        </div>
      )}
      
      {/* Confirmation Modal */}
      {showClaimModal && pendingPS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <GlassCard className="p-8 max-w-md w-full border-red-500/30 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <path d="M12 9v4"/>
                <path d="M12 17h.01"/>
              </svg>
            </div>
            <h3 className="text-2xl font-display text-white mb-4">Are you sure?</h3>
            <p className="text-white/70 mb-8">
              Once you claim <strong className="text-white">{pendingPS.title}</strong>, your choice is locked in and cannot be changed.
            </p>
            <div className="flex gap-4 w-full">
              <Button variant="outline" className="flex-1" onClick={() => { setShowClaimModal(false); setPendingPS(null); }}>
                Cancel
              </Button>
              <Button variant="primary" className="flex-1 bg-red-500 hover:bg-red-600 border-red-500" onClick={handleClaimPS}>
                Confirm Claim
              </Button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Track Selection Confirmation Modal */}
      <AlertDialog 
        isOpen={showTrackModal}
        onClose={() => { setShowTrackModal(false); setPendingTrack(null); }}
        onConfirm={handleSelectTrack}
        title="Lock in Track?"
        message={`Warning: You are about to lock your team into the ${pendingTrack === 'software' ? 'Software & AI' : 'Hardware/IoT'} track. This action is permanent and cannot be undone.`}
        confirmText="Yes, lock it in"
        cancelText="Cancel"
      />
    </div>
  );
}
