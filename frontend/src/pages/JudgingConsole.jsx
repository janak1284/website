import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LogOut, Trash2, Download, Eye, EyeOff, Settings } from 'lucide-react';

const CRITERIA = {
  shared: [
    {id:'understanding', name:'Problem Understanding & Relevance', weight:10, desc:'Is the problem real, well-scoped, and clearly tied to the hackathon theme?'},
    {id:'innovation', name:'Innovation & Originality', weight:15, desc:'How novel is the approach vs. existing solutions? Creative use of tech/ideas.'},
    {id:'impact', name:'Impact & Feasibility', weight:15, desc:'Would this matter if it existed at scale? Is the path to real-world use credible?'},
    {id:'presentation', name:'Presentation, Demo & Q&A', weight:20, desc:'Clarity of pitch, quality of live demo, and how well the team handled questions.'},
  ],
  hardware: [
    {id:'hw_function', name:'Prototype Functionality', weight:20, desc:'Does the physical build actually work live, on demand, not just in a video?'},
    {id:'hw_engineering', name:'Engineering & Build Quality', weight:20, desc:'Robustness, design choices, component integration, and basic safety.'},
  ],
  software: [
    {id:'sw_technical', name:'Technical Implementation & Code Quality', weight:20, desc:'Architecture, correctness, and appropriate use of the tech stack.'},
    {id:'sw_ux', name:'Usability / UX & Completeness', weight:20, desc:'Is it usable end-to-end? Polish, flow, and how complete the build feels.'},
  ]
};

function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch(e) {
    return null;
  }
}

export function JudgingConsole() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('judging_token') || '');
  const [userContext, setUserContext] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Session Setup State
  const [sessionSetupComplete, setSessionSetupComplete] = useState(false);
  const [judgeDisplayName, setJudgeDisplayName] = useState('');
  

  // Judging State
  const [currentTrack, setCurrentTrack] = useState('hardware');
  const [selectedRound, setSelectedRound] = useState(2);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [scores, setScores] = useState({});
  const [totalScore, setTotalScore] = useState(0);

  // Admin State
  const [leaderboard, setLeaderboard] = useState([]);
  const [cutoffN, setCutoffN] = useState(8);
  const [leaderboardRound, setLeaderboardRound] = useState('all');

  useEffect(() => {
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUserContext(decoded);
        fetchTeams();
        if (decoded.role === 'admin') {
          fetchLeaderboard();
        }
      } else {
        handleLogout();
        toast.error("Session expired. Please login again.");
      }
    }
  }, [token, sessionSetupComplete]);

  useEffect(() => {
    if (userContext?.role === 'admin' && sessionSetupComplete) {
      fetchLeaderboard();
    }
  }, [leaderboardRound]);

  // Recalculate total when scores or track change
  useEffect(() => {
    const activeCriteria = [...CRITERIA.shared, ...CRITERIA[currentTrack]];
    let total = 0;
    activeCriteria.forEach(c => {
      const s = scores[c.id] || 0;
      total += (s / 5) * c.weight;
    });
    setTotalScore(total);
  }, [scores, currentTrack]);

  const fetchTeams = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/judging/teams`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      }
    } catch (e) {
      console.error("Failed to fetch teams", e);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const url = new URL(`${import.meta.env.VITE_API_URL}/api/judging/leaderboard`);
      if (leaderboardRound !== 'all') {
        url.searchParams.append('round_number', leaderboardRound);
      }
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (e) {
      console.error("Failed to fetch leaderboard", e);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/judging/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('judging_token', data.access_token);
        setToken(data.access_token);
        toast.success("Logged in successfully");
      } else {
        const errorData = await res.json();
        toast.error(errorData.detail || "Login failed");
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('judging_token');
    setToken('');
    setUserContext(null);
    setSessionSetupComplete(false);
    setJudgeDisplayName('');
    setScores({});
    setSelectedTeam('');
    setLeaderboard([]);
  };

  const handleSaveScore = async () => {
    if (!selectedTeam) {
      toast.error("Please select a team");
      return;
    }
    const activeCriteria = [...CRITERIA.shared, ...CRITERIA[currentTrack]];
    const missing = activeCriteria.filter(c => !scores[c.id]);
    if (missing.length > 0) {
      toast.error(`Score every criterion before saving: ${missing.map(m => m.name).join(', ')}`);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/judging/score`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          team_id: selectedTeam,
          track: currentTrack,
          round_number: selectedRound,
          judge_display_name: judgeDisplayName,
          total_score: Math.round(totalScore * 10) / 10,
          breakdown: scores
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.message.includes("overwritten")) {
          toast.success(`Admin: Overwrote score for Round ${selectedRound}`);
        } else {
          toast.success("Score submitted successfully");
        }
        setScores({});
        setSelectedTeam('');
        fetchTeams(); // Refresh teams to update scored_rounds
        if (userContext?.role === 'admin') {
          fetchLeaderboard();
        }
      } else {
        const err = await res.json();
        toast.error(err.detail || "Failed to submit score");
      }
    } catch (e) {
      toast.error("Network error");
    }
  };

  const handleDeleteScore = async (scoreId) => {
    if (!confirm("Are you sure you want to delete this round's score?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/judging/score/${scoreId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Score deleted");
        fetchTeams(); // Refresh teams to update scored_rounds
        fetchLeaderboard();
      } else {
        toast.error("Failed to delete score");
      }
    } catch (e) {
      toast.error("Network error");
    }
  };

  const exportCSV = () => {
    const rows = leaderboard.filter(e => e.track === currentTrack);
    if (!rows.length) {
      toast.error("No entries to export for this track.");
      return;
    }
    
    const lines = ['Team,Round,Judge,Admin_Overwrite,Total_Score'];
    rows.forEach(team => {
      team.rounds.forEach(r => {
        lines.push(`"${team.team_name}",${r.round_number},"${r.judge_username}",${r.overwritten_by_admin ? 'Yes' : 'No'},${r.score}`);
      });
    });
    
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTrack}_leaderboard_by_round.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // STEP 1: Login
  if (!token) {
    return (
      <div className="min-h-screen bg-[#130d26] text-white flex items-center justify-center p-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 max-w-md w-full backdrop-blur-sm shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">Judge Authentication</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-white/60 mb-1">Username</label>
              <input
                type="text"
                required
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="judge_username"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold py-3 rounded-lg text-sm mt-4 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // STEP 2: Session Setup
  if (token && !sessionSetupComplete) {
    return (
      <div className="min-h-screen bg-[#130d26] text-white flex items-center justify-center p-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 max-w-md w-full backdrop-blur-sm shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">Session Setup</h1>
            <p className="text-white/50 text-sm mt-2">Configure your judging session.</p>
          </div>
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              if(!judgeDisplayName.trim()) {
                toast.error("Please enter your name.");
                return;
              }
              setSessionSetupComplete(true); 
            }} 
            className="space-y-4"
          >
            <div>
              <label className="block text-xs text-white/60 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                value={judgeDisplayName}
                onChange={(e) => setJudgeDisplayName(e.target.value)}
                placeholder="e.g. Dr. John Doe"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Track</label>
              <select
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                value={currentTrack}
                onChange={(e) => {
                  setCurrentTrack(e.target.value);
                  setSelectedRound(e.target.value === 'hardware' ? 2 : 3); // Reset round on track change
                }}
              >
                <option value="hardware" className="bg-[#130d26]">Hardware</option>
                <option value="software" className="bg-[#130d26]">Software</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Select Round</label>
              <select
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                value={selectedRound}
                onChange={(e) => setSelectedRound(parseInt(e.target.value))}
              >
                {currentTrack === 'hardware' ? (
                  <>
                    <option value={2} className="bg-[#130d26]">Round 2</option>
                    <option value={3} className="bg-[#130d26]">Round 3 (Finals)</option>
                  </>
                ) : (
                  <>
                    <option value={3} className="bg-[#130d26]">Round 3</option>
                    <option value={4} className="bg-[#130d26]">Round 4 (Grand Finale)</option>
                  </>
                )}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold py-3 rounded-lg text-sm mt-4 transition-colors"
            >
              Start Judging
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-semibold py-3 rounded-lg text-sm mt-2 transition-colors border border-white/10"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    );
  }

  // STEP 3: Main Judging Console
  const activeTeams = teams.filter(t => t.selected_track === currentTrack);
  const activeCriteria = [...CRITERIA.shared, ...CRITERIA[currentTrack]];
  const trackLeaderboard = leaderboard.filter(e => e.track === currentTrack);
  
  const selectedTeamData = activeTeams.find(t => t.id === selectedTeam);
  const isSelectedTeamScored = selectedTeamData?.scored_rounds?.includes(selectedRound);

  return (
    <div className="min-h-screen bg-[#130d26] text-white pb-20">
      <div className="max-w-[1100px] mx-auto px-5 pt-8">
        
        {/* Header */}
        <header className="flex justify-between items-end gap-5 mb-6 pb-4 border-b border-white/10 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Hackathon 2026</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right text-[12px] text-white/60">
              Judging as <b className="text-white">{judgeDisplayName}</b><br/>
              Round {selectedRound}
            </div>
            <button 
              onClick={() => { setSessionSetupComplete(false); setSelectedTeam(''); setScores({}); }}
              className="flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg hover:border-white/30 hover:bg-white/5 transition-colors text-xs text-white/70 hover:text-white"
            >
              <Settings size={14} /> Change Setup
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg hover:border-white/30 hover:bg-white/5 transition-colors text-xs text-white/70 hover:text-white"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>

        {/* Track Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => { 
              if (currentTrack !== 'hardware') {
                setCurrentTrack('hardware'); 
                setSelectedRound(2); 
                setScores({}); 
                setSelectedTeam(''); 
              }
            }}
            className={`flex-1 p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
              currentTrack === 'hardware' 
                ? 'bg-white/5 border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.2)]' 
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${currentTrack === 'hardware' ? 'bg-[#8B5CF6]' : 'bg-white/40'}`}></span>
            <div>
              <div className="font-semibold text-sm">Hardware Track</div>
              <small className="block text-white/50 text-[11px] mt-0.5">Physical / embedded builds</small>
            </div>
          </button>
          <button
            onClick={() => { 
              if (currentTrack !== 'software') {
                setCurrentTrack('software'); 
                setSelectedRound(3); 
                setScores({}); 
                setSelectedTeam(''); 
              }
            }}
            className={`flex-1 p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
              currentTrack === 'software' 
                ? 'bg-white/5 border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.2)]' 
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${currentTrack === 'software' ? 'bg-[#8B5CF6]' : 'bg-white/40'}`}></span>
            <div>
              <div className="font-semibold text-sm">Software Track</div>
              <small className="block text-white/50 text-[11px] mt-0.5">Apps, platforms, models</small>
            </div>
          </button>
        </div>

        {isSelectedTeamScored && (
          <div className="bg-[#FFB020]/10 border border-[#FFB020]/30 text-[#FFB020] rounded-xl p-4 mb-6 text-sm flex items-center gap-2">
            <b>Warning:</b> This team has already been graded for Round {selectedRound}. {userContext?.role === 'admin' ? "Saving will overwrite the existing score." : ""}
          </div>
        )}

        {/* Selection Panel */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-[13px] uppercase tracking-[1.5px] text-white/60 font-semibold mb-4">Select Team</h2>
          <div>
            <select
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="" className="bg-[#130d26]">-- Select a team in the {currentTrack} track --</option>
              {activeTeams.map(t => {
                const isScored = t.scored_rounds?.includes(selectedRound);
                const isAdmin = userContext?.role === 'admin';
                const disabled = isScored && !isAdmin;
                
                return (
                  <option 
                    key={t.id} 
                    value={t.id} 
                    disabled={disabled}
                    className={isScored ? "text-white/30 bg-black/40 italic" : "bg-[#130d26]"}
                  >
                    {t.name} {isScored ? (isAdmin ? "(Scored - Admin Override Allowed)" : "(Already Scored)") : ""}
                  </option>
                );
              })}
            </select>
            {activeTeams.length === 0 && (
              <p className="text-xs text-[#FF5C5C] mt-2">No active teams found for this track.</p>
            )}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-[13px] uppercase tracking-[1.5px] text-white/60 font-semibold mb-4">Criteria</h2>
          <div className="space-y-2.5">
            {activeCriteria.map(c => (
              <div key={c.id} className="border border-white/10 rounded-xl p-4 bg-black/20">
                <div className="flex justify-between items-baseline mb-1">
                  <div className="font-semibold text-[14.5px] text-white">{c.name}</div>
                  <div className="text-[11px] text-white/60">{c.weight} PTS</div>
                </div>
                <div className="text-[12.5px] text-white/50 mb-3 leading-relaxed">{c.desc}</div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map(n => {
                    const isSelected = scores[c.id] === n;
                    return (
                      <button
                        key={n}
                        onClick={() => setScores({...scores, [c.id]: n})}
                        className={`flex-1 py-2.5 text-center rounded-lg border font-bold text-sm transition-colors ${
                          isSelected 
                            ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]' 
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Bar */}
        <div className="flex items-center justify-between sticky bottom-4 bg-[#130d26]/90 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 mt-2 shadow-2xl z-10">
          <div>
            <div className="text-[11px] text-white/60 uppercase tracking-[1px]">Weighted total</div>
            <div className="font-mono text-[32px] font-bold text-[#8B5CF6]">
              {totalScore.toFixed(1)}<span className="text-base text-white/50">/100</span>
            </div>
          </div>
          <div className="flex gap-2.5">
            <button 
              onClick={() => { setScores({}); setSelectedTeam(''); }}
              className="px-4 py-2 border border-white/10 text-white/70 hover:text-white bg-white/5 rounded-lg text-sm hover:border-white/30 transition-colors"
            >
              Clear form
            </button>
            <button 
              onClick={handleSaveScore}
              className="px-6 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold rounded-lg text-sm transition-colors"
            >
              Save score
            </button>
          </div>
        </div>

        {/* Admin Leaderboard */}
        {userContext?.role === 'admin' && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-8">
            <h2 className="text-[13px] uppercase tracking-[1.5px] text-white/60 font-semibold mb-4">
              Leaderboard — {currentTrack === 'hardware' ? 'Hardware' : 'Software'}
            </h2>
            
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2 text-[12.5px] text-white/60">
                Advance top 
                <input 
                  type="number" 
                  value={cutoffN}
                  onChange={(e) => setCutoffN(parseInt(e.target.value) || 0)}
                  className="w-16 bg-black/20 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                /> 
                teams
              </div>
              <div className="flex gap-2 items-center">
                <select
                  className="bg-black/20 border border-white/10 rounded px-2 py-1.5 text-[12.5px] text-white focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                  value={leaderboardRound}
                  onChange={(e) => setLeaderboardRound(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                >
                  <option value="all">All Rounds</option>
                  {currentTrack === 'hardware' ? (
                    <>
                      <option value={1}>Round 1</option>
                      <option value={2}>Round 2</option>
                      <option value={3}>Round 3</option>
                    </>
                  ) : (
                    <>
                      <option value={2}>Round 2 (Consolidated)</option>
                      <option value={3}>Round 3</option>
                      <option value={4}>Round 4</option>
                    </>
                  )}
                </select>
                <button 
                  onClick={exportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 rounded-lg text-[12.5px] text-white transition-colors"
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13.5px]">
                <thead>
                  <tr>
                    <th className="text-[11px] uppercase text-white/50 p-3 border-b border-white/10">#</th>
                    <th className="text-[11px] uppercase text-white/50 p-3 border-b border-white/10">Team</th>
                    <th className="text-[11px] uppercase text-white/50 p-3 border-b border-white/10">Rounds</th>
                    <th className="text-[11px] uppercase text-white/50 p-3 border-b border-white/10 text-right">Cumulative Score</th>
                    <th className="text-[11px] uppercase text-white/50 p-3 border-b border-white/10"></th>
                  </tr>
                </thead>
                <tbody>
                  {trackLeaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-white/40 py-8 text-[13px]">
                        No scores saved for this track yet.
                      </td>
                    </tr>
                  ) : (
                    trackLeaderboard.map((team, i) => (
                      <React.Fragment key={team.team_id}>
                        <tr className={`hover:bg-white/5 transition-colors ${cutoffN > 0 && i >= cutoffN ? 'opacity-60' : ''}`}>
                          <td className="p-3 border-b border-white/10 font-mono font-bold text-white/70">{i + 1}</td>
                          <td className="p-3 border-b border-white/10 text-white font-bold">{team.team_name}</td>
                          <td className="p-3 border-b border-white/10 text-white/70">
                            <div className="flex gap-1 flex-wrap">
                              {team.rounds.map(r => (
                                <span key={`badge-${r.score_id}`} className="bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30 text-[10px] px-1.5 py-0.5 rounded font-bold">
                                  R{r.round_number}
                                </span>
                              ))}
                              {team.rounds.length === 0 && <span className="text-[11px] opacity-50">No Rounds Scored</span>}
                            </div>
                          </td>
                          <td className="p-3 border-b border-white/10 font-mono font-bold text-[16px] text-right text-[#8B5CF6]">
                            {team.total_score.toFixed(1)}
                          </td>
                          <td className="p-3 border-b border-white/10"></td>
                        </tr>
                        {team.rounds.map(r => (
                          <tr key={r.score_id} className="bg-black/20 text-[12.5px] group">
                            <td className="p-2.5 border-b border-white/5 border-r border-white/5"></td>
                            <td className="p-2.5 border-b border-white/5 text-white/50 pl-6">↳ Round {r.round_number}</td>
                            <td className="p-2.5 border-b border-white/5 text-white/50">
                              {r.judge_username} 
                              {r.overwritten_by_admin && <span className="ml-2 text-[10px] bg-[#8B5CF6]/20 text-[#8B5CF6] px-1.5 py-0.5 rounded uppercase font-bold">Admin Override</span>}
                            </td>
                            <td className="p-2.5 border-b border-white/5 font-mono text-right text-white/60">{r.score.toFixed(1)}</td>
                            <td className="p-2.5 border-b border-white/5 text-right">
                              <button 
                                onClick={() => handleDeleteScore(r.score_id)}
                                className="text-white/30 hover:text-[#FF5C5C] opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Score"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
