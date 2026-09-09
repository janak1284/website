import re

filepath = r"c:\janak\projects\hackathon_websites\new-era-landing\frontend\src\pages\JudgingConsole.jsx"

with open(filepath, 'r') as f:
    content = f.read()

# 1. State changes
content = content.replace(
    "const [globalSelectedRound, setGlobalSelectedRound] = useState(1);",
    ""
)
content = content.replace(
    "const [currentTrack, setCurrentTrack] = useState('hardware');",
    "const [currentTrack, setCurrentTrack] = useState('hardware');\n  const [selectedRound, setSelectedRound] = useState(2);"
)

# 2. Admin State
content = content.replace(
    "const [cutoffN, setCutoffN] = useState(8);",
    "const [cutoffN, setCutoffN] = useState(8);\n  const [leaderboardRound, setLeaderboardRound] = useState('all');"
)

# 3. useEffect for leaderboardRound
useEffect_str = """  useEffect(() => {
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
  }, [token, sessionSetupComplete]);"""

new_useEffect_str = useEffect_str + """

  useEffect(() => {
    if (userContext?.role === 'admin' && sessionSetupComplete) {
      fetchLeaderboard();
    }
  }, [leaderboardRound]);"""

content = content.replace(useEffect_str, new_useEffect_str)

# 4. fetchLeaderboard
old_fetch = """  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/judging/leaderboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });"""
new_fetch = """  const fetchLeaderboard = async () => {
    try {
      const url = new URL(`${import.meta.env.VITE_API_URL}/api/judging/leaderboard`);
      if (leaderboardRound !== 'all') {
        url.searchParams.append('round_number', leaderboardRound);
      }
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });"""
content = content.replace(old_fetch, new_fetch)

# 5. globalSelectedRound replacements
content = content.replace("globalSelectedRound", "selectedRound")

# 6. Session setup Track onChange
old_track_change = """onChange={(e) => {
                  setCurrentTrack(e.target.value);
                  setSelectedRound(1); // Reset round on track change
                }}"""
new_track_change = """onChange={(e) => {
                  setCurrentTrack(e.target.value);
                  setSelectedRound(e.target.value === 'hardware' ? 2 : 3);
                }}"""
content = content.replace(old_track_change, new_track_change)

# 7. Remove Select Round from Session Setup
select_round_html = """            <div>
              <label className="block text-xs text-white/60 mb-1">Select Round</label>
              <select
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                value={selectedRound}
                onChange={(e) => setSelectedRound(parseInt(e.target.value))}
              >
                <option value={1} className="bg-[#130d26]">Round 1</option>
                <option value={2} className="bg-[#130d26]">Round 2</option>
                {currentTrack === 'software' && <option value={3} className="bg-[#130d26]">Round 3</option>}
                {currentTrack === 'software' && <option value={4} className="bg-[#130d26]">Round 4</option>}
              </select>
            </div>"""
content = content.replace(select_round_html, "")

# 8. Track Tabs and Round Segment Picker
old_tabs = """        {/* Track Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => { 
              if (currentTrack !== 'hardware') {
                setCurrentTrack('hardware'); 
                setSelectedRound(1); 
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
                setSelectedRound(1); 
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
        </div>"""

new_tabs = """        {/* Track Tabs */}
        <div className="flex gap-2 mb-4">
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

        {/* Dynamic Round Segment Picker */}
        <div className="bg-black/20 border border-white/10 p-1 rounded-lg flex mb-6">
          {currentTrack === 'hardware' ? (
            <>
              <button
                onClick={() => { setSelectedRound(2); setScores({}); setSelectedTeam(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  selectedRound === 2 ? 'bg-[#8B5CF6] text-white shadow-md' : 'text-white/50 hover:text-white/80'
                }`}
              >
                Round 2
              </button>
              <button
                onClick={() => { setSelectedRound(3); setScores({}); setSelectedTeam(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  selectedRound === 3 ? 'bg-[#8B5CF6] text-white shadow-md' : 'text-white/50 hover:text-white/80'
                }`}
              >
                Round 3 (Finals)
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setSelectedRound(3); setScores({}); setSelectedTeam(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  selectedRound === 3 ? 'bg-[#8B5CF6] text-white shadow-md' : 'text-white/50 hover:text-white/80'
                }`}
              >
                Round 3
              </button>
              <button
                onClick={() => { setSelectedRound(4); setScores({}); setSelectedTeam(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  selectedRound === 4 ? 'bg-[#8B5CF6] text-white shadow-md' : 'text-white/50 hover:text-white/80'
                }`}
              >
                Round 4 (Grand Finale)
              </button>
            </>
          )}
        </div>"""

content = content.replace(old_tabs, new_tabs)

# 9. Admin Leaderboard Round Dropdown
old_admin_btn = """              <div className="flex gap-2">
                <button 
                  onClick={exportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 rounded-lg text-[12.5px] text-white transition-colors"
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>"""
new_admin_btn = """              <div className="flex gap-2 items-center">
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
              </div>"""
content = content.replace(old_admin_btn, new_admin_btn)

# 10. Table header and body badges
content = content.replace(
    """<th className="text-[11px] uppercase text-white/50 p-3 border-b border-white/10">Judges</th>""",
    """<th className="text-[11px] uppercase text-white/50 p-3 border-b border-white/10">Rounds</th>"""
)

old_table_td = """<td className="p-3 border-b border-white/10 text-white/70">{team.rounds.length} Rounds Scored</td>"""
new_table_td = """<td className="p-3 border-b border-white/10 text-white/70">
                            <div className="flex gap-1 flex-wrap">
                              {team.rounds.map(r => (
                                <span key={`badge-${r.score_id}`} className="bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30 text-[10px] px-1.5 py-0.5 rounded font-bold">
                                  R{r.round_number}
                                </span>
                              ))}
                              {team.rounds.length === 0 && <span className="text-[11px] opacity-50">No Rounds Scored</span>}
                            </div>
                          </td>"""
content = content.replace(old_table_td, new_table_td)

with open(filepath, 'w') as f:
    f.write(content)

print("JudgingConsole.jsx modified successfully")
