
import React from 'react';
import { AppView } from '../types';
import { Terminal, AppWindow, Zap, ScrollText, Shield, Github } from 'lucide-react';

interface SidebarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { view: AppView.DASHBOARD, icon: Zap, label: "Patch Utility" },
    { view: AppView.APPLICATIONS, icon: AppWindow, label: "Registry" },
    { view: AppView.SOURCES, icon: Github, label: "Git Sources" },
    { view: AppView.LOGS, icon: ScrollText, label: "Task History" },
  ];

  return (
    <div className="w-56 flex flex-col border-r border-ps-border bg-ps-surface shrink-0">
      <div className="p-6 ps-header border-b border-ps-highlight">
        <div className="flex items-center gap-3">
          <Shield size={24} className="text-ps-highlight" />
          <div className="flex flex-col">
            <span className="text-xs font-bold leading-none tracking-tighter">WIN.REVANCED</span>
            <span className="text-[10px] font-bold text-ps-highlight uppercase tracking-widest mt-1">Utility v4.9</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map(({ view, icon: Icon, label }) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`ps-sidebar-item w-full flex items-center gap-4 px-6 py-4 text-[11px] font-bold uppercase tracking-wider ${
              activeView === view ? 'active' : 'opacity-40 hover:opacity-100 hover:bg-white/5'
            }`}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 bg-ps-blue/10 border-t border-ps-border">
        <div className="text-[9px] font-bold text-ps-highlight mb-2 uppercase tracking-widest text-center">System Status</div>
        <div className="flex items-center justify-center gap-3 bg-black/40 py-2 rounded">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span className="text-[9px] font-bold opacity-60 uppercase tracking-widest">Agent Ready</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
