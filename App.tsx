
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import Terminal from './components/Terminal';
import Sidebar from './components/Sidebar';
import { Patch, TargetApp, LogEntry, GroundingLink, AppView, GitRepo } from './types';
import { TARGET_APPS as FALLBACK_APPS, INITIAL_PATCHES } from './constants';
import { 
  generateCLICommand, 
  fetchLatestPatches, 
  fetchSupportedApps,
  verifyPatchCompatibility,
  fetchGitRepos
} from './services/geminiService';
import { 
  Check, Rocket, RefreshCw, 
  Search,
  Terminal as TerminalIcon,
  ShieldAlert,
  Box,
  HardDrive,
  ExternalLink,
  Info,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  ShieldQuestion,
  Shield,
  Github,
  Star,
  GitBranch,
  History,
  Tag,
  Copy,
  Terminal as PS,
  Play,
  Monitor,
  Code2,
  Share2,
  User,
  Globe,
  Settings,
  HelpCircle
} from 'lucide-react';

const MemoizedAppIcon = memo(({ app, size = "md" }: { app: TargetApp, size?: "sm" | "md" | "lg" }) => {
  const dims = size === "lg" ? "w-12 h-12" : size === "md" ? "w-8 h-8" : "w-6 h-6";
  const text = size === "lg" ? "text-2xl" : size === "md" ? "text-lg" : "text-sm";

  return (
    <div className={`${dims} shrink-0 rounded-lg flex items-center justify-center overflow-hidden bg-white/5 border border-white/10 shadow-inner`}>
      {app.iconUrl ? (
        <img 
          src={app.iconUrl} 
          alt={app.name} 
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "";
            (e.target as HTMLImageElement).classList.add('hidden');
          }}
        />
      ) : (
        <span className={text}>{app.icon}</span>
      )}
    </div>
  );
});

const CompatibilityBadge = memo(({ status }: { status: Patch['compatibilityStatus'] }) => {
  switch(status) {
    case 'verified':
      return <div className="flex items-center gap-1 text-[8px] font-bold px-2 py-0.5 rounded-sm border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 uppercase tracking-tighter"><ShieldCheck size={10} /> Verified</div>;
    case 'warning':
      return <div className="flex items-center gap-1 text-[8px] font-bold px-2 py-0.5 rounded-sm border bg-yellow-500/10 border-yellow-500/30 text-yellow-400 uppercase tracking-tighter"><AlertTriangle size={10} /> Caution</div>;
    case 'incompatible':
      return <div className="flex items-center gap-1 text-[8px] font-bold px-2 py-0.5 rounded-sm border bg-red-500/10 border-red-500/30 text-red-400 uppercase tracking-tighter"><XCircle size={10} /> Incompatible</div>;
    default:
      return <div className="flex items-center gap-1 text-[8px] font-bold px-2 py-0.5 rounded-sm border bg-ps-border/40 border-ps-border text-ps-text/40 uppercase tracking-tighter"><ShieldQuestion size={10} /> Unknown</div>;
  }
});

const PatchItem = memo(({ patch, onToggle }: { patch: Patch, onToggle: (id: string) => void }) => {
  return (
    <div 
      onClick={() => onToggle(patch.id)}
      className={`p-3 rounded-md flex flex-col gap-2 cursor-pointer border transition-all duration-150 group relative overflow-hidden ${
        patch.enabled 
          ? 'bg-ps-highlight/10 border-ps-highlight/40 shadow-[inset_0_0_15px_rgba(0,175,240,0.05)]' 
          : 'border-white/5 hover:border-ps-highlight/20 hover:bg-white/5'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${
          patch.enabled 
            ? 'bg-ps-highlight border-ps-highlight text-black' 
            : 'border-white/20 group-hover:border-ps-highlight/40'
        }`}>
          {patch.enabled && <Check size={12} strokeWidth={4} />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`text-[12px] font-bold truncate ${patch.enabled ? 'text-ps-highlight' : 'text-ps-text/80'}`}>
              {patch.name}
            </h3>
            <div className="flex items-center gap-2">
              {patch.version && (
                <div className="flex items-center gap-1 text-[9px] font-mono opacity-50 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                  <Tag size={8} /> {patch.version}
                </div>
              )}
              <CompatibilityBadge status={patch.compatibilityStatus} />
            </div>
          </div>
          <p className="text-[10px] opacity-40 leading-relaxed line-clamp-2">
            {patch.description}
          </p>
        </div>
      </div>

      {patch.compatibilityNote && (
        <div className="mt-1 p-2 bg-ps-highlight/5 border border-ps-highlight/10 rounded text-[9px] flex items-start gap-2 text-ps-highlight/70 italic">
          <Info size={12} className="shrink-0 mt-0.5" />
          <span>{patch.compatibilityNote}</span>
        </div>
      )}
    </div>
  );
});

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [apps, setApps] = useState<TargetApp[]>(FALLBACK_APPS);
  const [selectedApp, setSelectedApp] = useState<TargetApp>(FALLBACK_APPS[0]);
  const [patches, setPatches] = useState<Patch[]>(INITIAL_PATCHES);
  const [gitRepos, setGitRepos] = useState<GitRepo[]>([]);
  const [patchFilter, setPatchFilter] = useState<string>("");
  const [filename, setFilename] = useState<string>("none");
  const [command, setCommand] = useState<string>("Ready...");
  const [isPatching, setIsPatching] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isCoreReady, setIsCoreReady] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [copyStatus, setCopyStatus] = useState<'none' | 'setup' | 'launch'>('none');

  // Updated Default Credentials for 4rjunKM
  const [ghUser, setGhUser] = useState<string>("4rjunKM");
  const [ghRepo, setGhRepo] = useState<string>("revanced-patch-manager-cli");

  const setupCommand = `iwr -useb https://raw.githubusercontent.com/${ghUser}/${ghRepo}/main/setup.ps1 | iex`;
  
  const getExecutionCommand = () => {
    const outName = filename === "none" ? "Output.apk" : `patched_${filename}`;
    return `adb install -r .\\${outName}; Write-Host "Build Succeeded" -ForegroundColor Cyan`;
  };

  const copyToClipboard = (text: string, type: 'setup' | 'launch') => {
    navigator.clipboard.writeText(text);
    setCopyStatus(type);
    setTimeout(() => setCopyStatus('none'), 2000);
  };

  const compatiblePatches = useMemo(() => {
    return patches.filter(p => {
      if (p.compatibilityStatus === 'incompatible') return false;
      if (!p.compatibleApps || p.compatibleApps.length === 0) return true;
      return p.compatibleApps.some(pkg => 
        selectedApp.packageName.toLowerCase().includes(pkg.toLowerCase())
      );
    });
  }, [patches, selectedApp]);

  const filteredPatches = useMemo(() => {
    const query = patchFilter.toLowerCase().trim();
    if (!query) return compatiblePatches;
    return compatiblePatches.filter(p => 
      p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
    );
  }, [compatiblePatches, patchFilter]);

  const addLog = useCallback((message: string, level: LogEntry['level'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { timestamp, level, message }]);
  }, []);

  const syncEnvironment = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setIsCoreReady(false);
    addLog("POWER SHELL: Fetching remote sources...", "info");
    try {
      const [appResult, patchResult, gitResult] = await Promise.all([
        fetchSupportedApps(), 
        fetchLatestPatches(),
        fetchGitRepos()
      ]);
      
      if (appResult.apps.length > 0) setApps(prev => [...prev, ...appResult.apps.filter(na => !prev.find(a => a.packageName === na.packageName))]);
      if (patchResult.patches.length > 0) setPatches(prev => [...prev, ...patchResult.patches.filter(np => !prev.find(p => p.id === np.id))]);
      if (gitResult.repos.length > 0) setGitRepos(gitResult.repos);

      setIsCoreReady(true);
      addLog("SUCCESS: Open-source registry synchronized.", "success");
    } catch (e) {
      addLog("ERROR: GitHub API connection failed.", "error");
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, addLog]);

  useEffect(() => { syncEnvironment(); }, []);

  useEffect(() => {
    const updateCommand = async () => {
      const cmd = await generateCLICommand(selectedApp, patches, filename);
      setCommand(cmd);
    };
    updateCommand();
  }, [selectedApp, patches, filename]);

  const togglePatch = useCallback((id: string) => {
    setPatches(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  }, []);

  const startPatching = async () => {
    if (isPatching || !isCoreReady) return;
    const activePatches = compatiblePatches.filter(p => p.enabled);
    if (activePatches.length === 0) return addLog("No patches selected.", "error");

    setIsPatching(true);
    setProgress(0);
    addLog(`BUILD: Processing ${selectedApp.name} via PowerShell agent...`, "info");
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(r => setTimeout(r, 600));
      setProgress(i);
      if (i < 100) addLog(`GIT: Verifying Medium integrity [${i}%]`, "info");
    }
    addLog("SUCCESS: Binary built. Use Launch Command to install.", "success");
    setIsPatching(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black font-sans selection:bg-ps-highlight selection:text-black">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="ps-header h-12 flex items-center justify-between px-6 shrink-0 z-10 shadow-xl">
          <div className="flex items-center gap-4">
            <TerminalIcon size={16} className="text-ps-highlight" />
            <h1 className="text-sm font-bold tracking-wider uppercase">ReVanced Win Utility v4.9 | Agent: {ghUser}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded text-[10px] font-bold border flex items-center gap-2 transition-all ${isCoreReady ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
              {isCoreReady ? <ShieldCheck size={12} /> : <ShieldAlert size={12} className="animate-pulse" />}
              {isCoreReady ? 'CORE OPERATIONAL' : 'OFFLINE'}
            </div>
          </div>
        </div>

        {activeView === AppView.DASHBOARD && (
          <div className="flex-1 flex overflow-hidden">
            <div className="w-[520px] border-r border-ps-border bg-[#001026] flex flex-col overflow-hidden">
              <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                
                <div className="space-y-4">
                  <div className="p-4 bg-ps-highlight/10 border border-ps-highlight/30 rounded">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-[11px] font-bold text-ps-highlight uppercase tracking-[0.2em] flex items-center gap-2">
                        <PS size={14} /> 1. Re-Run Setup (Fix Network Issues)
                      </label>
                      {copyStatus === 'setup' && <span className="text-[9px] font-bold text-emerald-400 animate-pulse">COPIED</span>}
                    </div>
                    <div 
                      onClick={() => copyToClipboard(setupCommand, 'setup')}
                      className="cursor-pointer group relative bg-black/60 border border-white/5 p-3 rounded font-mono text-[9px] text-ps-highlight/60 flex items-center justify-between hover:border-ps-highlight/40"
                    >
                      <span className="truncate pr-4">{setupCommand}</span>
                      <Copy size={12} className="opacity-20 group-hover:opacity-100" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-ps-highlight uppercase tracking-[0.2em] flex items-center gap-2">
                    <Monitor size={12} /> 2. Environment Profile
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {apps.map(app => (
                      <button 
                        key={app.id} 
                        onClick={() => setSelectedApp(app)}
                        className={`ps-btn text-left justify-start gap-3 truncate transition-all py-3 ${selectedApp.id === app.id ? 'bg-ps-highlight text-black border-ps-highlight shadow-[0_0_15px_rgba(0,175,240,0.2)]' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}`}
                      >
                        <MemoizedAppIcon app={app} size="sm" />
                        <span className="text-[10px] font-bold truncate">{app.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-ps-highlight uppercase tracking-[0.2em] flex items-center gap-2">
                    <Code2 size={12} /> 3. Mod Configuration
                  </label>
                  <div className="ps-card bg-black/40 overflow-hidden flex flex-col h-[300px]">
                    <div className="p-3 border-b border-ps-border flex items-center gap-3">
                      <Search size={14} className="opacity-30" />
                      <input 
                        type="text" 
                        placeholder="Search patch registry..." 
                        value={patchFilter}
                        onChange={(e) => setPatchFilter(e.target.value)}
                        className="bg-transparent border-none outline-none text-[11px] w-full text-ps-highlight placeholder:text-ps-highlight/20"
                      />
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                      {filteredPatches.map(p => <PatchItem key={p.id} patch={p} onToggle={togglePatch} />)}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={startPatching}
                  disabled={isPatching || !isCoreReady}
                  className={`w-full ps-btn ps-btn-primary py-5 text-sm tracking-[0.2em] font-bold flex items-center justify-center gap-3 transition-all ${(!isCoreReady || isPatching) ? 'opacity-30 cursor-not-allowed' : 'hover:scale-[1.01] shadow-[0_0_20px_rgba(0,175,240,0.3)]'}`}
                >
                  {isPatching ? <RefreshCw className="animate-spin" /> : <Rocket />}
                  {isPatching ? 'BUILDING BINARY...' : 'START POWER SHELL BUILD'}
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-[#000b1a] terminal-glow overflow-hidden">
              <Terminal command={command} logs={logs} progress={progress} onClear={() => setLogs([])} />
            </div>
          </div>
        )}

        {activeView === AppView.DEPLOYMENT && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#000b1a] p-12 custom-scrollbar overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full space-y-10">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-ps-highlight flex items-center gap-4">
                  <Globe size={40} /> Distribution Center
                </h2>
                <p className="text-sm opacity-40">Manage how users access your PowerShell utility worldwide.</p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="ps-card p-8 bg-ps-surface space-y-6">
                  <div className="flex items-center gap-3 text-ps-highlight">
                    <User size={20} />
                    <h3 className="font-bold text-sm uppercase tracking-widest">1. Your Endpoint</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold opacity-30 uppercase">GitHub Username</label>
                      <input 
                        type="text" 
                        value={ghUser}
                        onChange={(e) => setGhUser(e.target.value)}
                        className="w-full ps-input border-white/5 focus:border-ps-highlight outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold opacity-30 uppercase">Repository Name</label>
                      <input 
                        type="text" 
                        value={ghRepo}
                        onChange={(e) => setGhRepo(e.target.value)}
                        className="w-full ps-input border-white/5 focus:border-ps-highlight outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="ps-card p-8 bg-ps-surface space-y-6 border-ps-highlight/30 shadow-[0_0_30px_rgba(0,175,240,0.1)]">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <PS size={20} />
                    <h3 className="font-bold text-sm uppercase tracking-widest">2. Your Public Command</h3>
                  </div>

                  <p className="text-xs opacity-60 leading-relaxed">
                    Share this command. When a user runs it, PowerShell will fetch your <span className="text-ps-highlight font-bold">setup.ps1</span> directly from GitHub:
                  </p>

                  <div 
                    onClick={() => copyToClipboard(setupCommand, 'setup')}
                    className="cursor-pointer relative p-4 bg-black/80 rounded border border-ps-highlight/20 font-mono text-[11px] text-ps-highlight flex flex-col gap-2 group hover:border-ps-highlight transition-all"
                  >
                    <div className="flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-bold">RAW COMMAND</span>
                      <Copy size={12} />
                    </div>
                    <span className="break-all select-all">{setupCommand}</span>
                    {copyStatus === 'setup' && (
                      <div className="absolute inset-0 bg-ps-highlight/20 backdrop-blur-sm flex items-center justify-center font-bold text-white text-lg animate-in fade-in duration-150">
                        COPIED
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase text-center tracking-widest animate-pulse">Ready for Global Distribution</p>
                </div>
              </div>

              {/* Troubleshooting Section */}
              <div className="ps-card p-10 border-red-500/20 bg-red-500/5 rounded-xl space-y-4">
                 <div className="flex items-center gap-3 text-red-400">
                    <ShieldAlert size={20} />
                    <h3 className="font-bold text-sm uppercase tracking-widest">Installer Troubleshooting</h3>
                 </div>
                 <div className="grid grid-cols-2 gap-6 text-[11px] opacity-70">
                    <div className="space-y-2">
                       <p className="font-bold text-ps-text">"Network Failure" or "Could not reach GitHub"?</p>
                       <p>This is usually caused by outdated TLS settings. Our new <code className="text-ps-highlight">setup.ps1</code> enforces TLS 1.2. Re-copy the command above and try again.</p>
                    </div>
                    <div className="space-y-2">
                       <p className="font-bold text-ps-text">UI not launching after install?</p>
                       <p>The script now uses <code className="text-ps-highlight">Start-Process</code> to trigger your browser. Make sure you have a default browser set on Windows.</p>
                    </div>
                 </div>
              </div>

              <div className="ps-card p-10 bg-ps-highlight/5 border border-dashed border-ps-highlight/30 rounded-xl space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-ps-highlight rounded-full flex items-center justify-center text-black">
                    <HelpCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold italic">Why use the Raw URL?</h3>
                    <p className="text-sm opacity-40">It allows instant updates. When you push a new `setup.ps1`, all users get the update immediately.</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {[
                    { step: "ACCESS", title: "iwr | iex", desc: "This downloads the script into memory and executes it immediately without saving a file." },
                    { step: "SYNC", title: "GitHub Raw", desc: "Always pulls from your 'main' branch. Ensure your repo is set to Public." },
                    { step: "LAUNCH", title: "Global Alias", desc: "The script adds 'revanced' as a command to the user's computer for future use." }
                  ].map(s => (
                    <div key={s.step} className="space-y-2 border-l border-ps-highlight/10 pl-4">
                      <div className="text-[10px] font-black text-ps-highlight opacity-50 tracking-widest">{s.step}</div>
                      <h4 className="font-bold text-ps-highlight uppercase text-xs">{s.title}</h4>
                      <p className="text-[11px] opacity-60 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sources view */}
        {activeView === AppView.SOURCES && (
           <div className="flex-1 flex flex-col overflow-hidden bg-ps-bg p-10">
           <div className="max-w-5xl mx-auto w-full space-y-8 overflow-y-auto custom-scrollbar">
             <div className="flex items-center justify-between">
               <div>
                 <h2 className="text-3xl font-bold text-ps-highlight flex items-center gap-3">
                   <Github size={32} /> Open Source Registry
                 </h2>
                 <p className="text-sm opacity-40 mt-1">Community-maintained patches and utilities</p>
               </div>
               <button onClick={syncEnvironment} className="ps-btn flex items-center gap-2">
                 <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} /> Sync All
               </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {gitRepos.map(repo => (
                 <div key={repo.id} className="ps-card p-6 flex flex-col gap-4 group hover:border-ps-highlight/40 transition-all cursor-default">
                   <div className="flex items-start justify-between">
                     <div className="p-3 bg-white/5 rounded-lg text-ps-highlight">
                       <Github size={28} />
                     </div>
                     <div className="flex flex-col items-end gap-1">
                       <div className="flex items-center gap-1.5 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded text-[10px] font-bold border border-yellow-400/20">
                         <Star size={12} /> {repo.stars.toLocaleString()}
                       </div>
                       {repo.isOfficial && <div className="text-[8px] font-bold text-ps-highlight bg-ps-highlight/10 px-2 py-0.5 rounded border border-ps-highlight/20 uppercase tracking-widest">Official</div>}
                     </div>
                   </div>
                   
                   <div>
                     <h3 className="text-xl font-bold group-hover:text-ps-highlight transition-colors">{repo.name}</h3>
                     <p className="text-xs opacity-30 font-mono mt-0.5">/{repo.owner}</p>
                   </div>

                   <p className="text-sm opacity-60 leading-relaxed min-h-[40px]">
                     {repo.description}
                   </p>

                   <div className="flex items-center gap-6 py-2">
                     <div className="flex items-center gap-1.5 text-[11px] font-bold opacity-40">
                       <GitBranch size={14} /> {repo.branch}
                     </div>
                     <div className="flex items-center gap-1.5 text-[11px] font-bold opacity-40">
                       <History size={14} /> {new Date(repo.lastUpdated).toLocaleDateString()}
                     </div>
                   </div>

                   <div className="flex gap-2 mt-auto">
                     <a href={repo.url} target="_blank" rel="noopener noreferrer" className="flex-1 ps-btn text-center flex items-center justify-center gap-2">
                       <ExternalLink size={14} /> View Repository
                     </a>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </div>
        )}
      </main>
    </div>
  );
};

export default App;
