
import React, { useEffect, useRef, memo } from 'react';
import { LogEntry } from '../types';
import { Check, Terminal as TerminalIcon, Info, Trash2 } from 'lucide-react';

interface TerminalProps {
  command: string;
  logs: LogEntry[];
  progress: number;
  onClear?: () => void;
}

const LogLine = memo(({ log }: { log: LogEntry }) => (
  <div className={`flex gap-4 group animate-in fade-in duration-200 ${
    log.level === 'error' ? 'text-red-400' : 
    log.level === 'warn' ? 'text-yellow-400' :
    log.level === 'success' ? 'text-emerald-400 font-bold' :
    'text-slate-400'
  }`}>
    <span className="text-ps-highlight/20 text-[10px] pt-1 select-none whitespace-nowrap font-bold font-mono">
      {log.timestamp}
    </span>
    <div className="flex gap-2 min-w-0">
       <span className="opacity-20 select-none font-bold">»</span>
       <span className="break-all leading-tight">{log.message}</span>
    </div>
  </div>
));

const Terminal: React.FC<TerminalProps> = ({ command, logs, progress, onClear }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full font-mono bg-[#000b1a]">
      <div className="px-6 py-3 border-b border-ps-border flex items-center justify-between bg-[#0a192f]">
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-ps-highlight">
          <TerminalIcon size={14} /> PowerShell Output
        </div>
        {onClear && (
          <button onClick={onClear} className="text-[9px] font-bold opacity-40 hover:opacity-100 flex items-center gap-1.5 uppercase transition-opacity">
            <Trash2 size={12} /> Clear
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 p-6 text-[13px] overflow-y-auto space-y-2 custom-scrollbar bg-black/30 backdrop-blur-sm">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-5 grayscale">
            <TerminalIcon size={48} strokeWidth={1} />
            <div className="text-[10px] font-bold tracking-[1em] uppercase mt-4">Idle</div>
          </div>
        ) : (
          logs.map((log, i) => <LogLine key={i} log={log} />)
        )}
        
        {progress === 100 && (
          <div className="mt-8 p-5 border border-emerald-500/20 bg-emerald-500/5 rounded-sm flex items-center gap-4 text-emerald-400 text-sm font-bold shadow-lg shadow-emerald-500/5">
            <Check size={16} /> <span>PROCESS COMPLETE</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-ps-border bg-[#0a192f] shadow-[0_-10px_30px_rgba(0,0,0,0.4)]">
        <div className="ps-input flex gap-3 text-[12px] bg-black/70 border-ps-highlight/20 py-3 px-4 rounded-sm">
          <span className="text-emerald-500 font-bold border-r border-emerald-500/20 pr-3">PS</span>
          <span className="flex-1 text-ps-highlight break-all font-mono leading-relaxed">{command}</span>
        </div>
        {progress > 0 && progress < 100 && (
          <div className="mt-2 h-1 bg-ps-border rounded-full overflow-hidden">
            <div className="h-full bg-ps-highlight transition-all duration-300" style={{width: `${progress}%`}} />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Terminal);
