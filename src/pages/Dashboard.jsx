import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import toast from 'react-hot-toast';

export function Dashboard() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Forms
  const [teamName, setTeamName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoLink, setDemoLink] = useState('');
  
  const [problemStatements, setProblemStatements] = useState([]);
  const [timeLeft, setTimeLeft] = useState('');
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Stable tokens
  const [token] = useState(() => localStorage.getItem('access_token'));
  const [user] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));

  // Shared fetch helpers for action handlers
  const fetchTeam = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/teams/me', {
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

  const fetchProblemStatements = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/ps');
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
          fetch('http://127.0.0.1:8000/api/teams/me', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://127.0.0.1:8000/api/ps')
        ]);
        
        if (isMounted) {
          if (teamRes.ok) setTeam(await teamRes.json());
          else setTeam(null);
          
          if (psRes.ok) setProblemStatements(await psRes.json());
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

  // Timer logic for Sept 7, 2026, 1:00 PM IST (UTC+5:30)
  useEffect(() => {
    const targetDate = new Date('2026-09-07T13:00:00+05:30').getTime();
    
    const interval = setInterval(() => {
      const distance = targetDate - Date.now();
      
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft('00:00:00');
        setIsTimeUp(true);
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleCreateTeam = async () => {
    if (!teamName) return;
    try {
      const res = await fetch('http://127.0.0.1:8000/api/teams/create', {
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

  const handleAddMember = async () => {
    if (!newMemberEmail) return;
    try {
      const res = await fetch('http://127.0.0.1:8000/api/teams/add-member', {
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

  const handleClaimPS = async (ps_id) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/ps/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ps_id })
      });
      if (res.ok) {
        toast.success("Claimed successfully!");
        fetchTeam();
        fetchProblemStatements();
      } else {
        const data = await res.json();
        toast.error(data.detail || "An unexpected error occurred");
      }
    } catch (err) { toast.error("An unexpected error occurred"); }
  };

  const handleSubmitFinal = async () => {
    if (!githubUrl || !demoLink) return;
    try {
      const res = await fetch('http://127.0.0.1:8000/api/submissions/final', {
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

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-24 text-white">Loading...</div>;

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 max-w-7xl mx-auto z-10 relative">
      {!team ? (
        <div className="flex justify-center mt-20">
          <GlassCard className="p-12 max-w-md w-full text-center flex flex-col">
            <h2 className="text-3xl font-display text-white mb-6">Create Your Team</h2>
            <input 
              type="text" 
              placeholder="Team Name" 
              className="w-full p-3 rounded bg-white/10 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <Button variant="primary" onClick={handleCreateTeam} className="w-full mt-auto">Create Team</Button>
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
              </GlassCard>
            </div>
            
            {/* PS Selection */}
            <div className="md:col-span-2">
              <GlassCard className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display text-white">Problem Statements</h2>
                  <div className="text-right">
                    <p className="text-sm text-white/50 mb-1">Selection Deadline</p>
                    <div className="font-mono text-xl text-[#C026D3]">{timeLeft}</div>
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
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                    {problemStatements.map(ps => {
                      const isFull = ps.claimed_count >= ps.max_quota;
                      return (
                        <div key={ps.id} className="border border-white/10 rounded-xl p-4 flex flex-col bg-white/5">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline">{ps.track}</Badge>
                            <span className="text-xs text-white/50">{ps.claimed_count}/{ps.max_quota} Claimed</span>
                          </div>
                          <h4 className="text-lg font-semibold text-white mb-2">{ps.title}</h4>
                          <p className="text-sm text-white/60 mb-4 flex-grow">{ps.description}</p>
                          <Button 
                            variant={isFull || isTimeUp ? "outline" : "primary"}
                            disabled={isFull || isTimeUp || team.leader_id !== user.id}
                            onClick={() => handleClaimPS(ps.id)}
                            className="w-full mt-auto"
                          >
                            {isFull ? "Quota Full" : isTimeUp ? "Time Up" : team.leader_id !== user.id ? "Leader Only" : "Claim"}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </GlassCard>
            </div>
          </div>

          {/* Final Submission */}
          <GlassCard className="p-6 w-full flex flex-col">
            <h2 className="text-2xl font-display text-white mb-6">Round 4: Final Submission</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
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
            <div className="mt-6 flex justify-end">
              <Button variant="primary" onClick={handleSubmitFinal}>Submit Project</Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
