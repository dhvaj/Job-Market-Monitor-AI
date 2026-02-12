import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, XCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

interface LogsPanelProps {
  logs: LogEntry[];
  onClear: () => void;
}

const LogsPanel: React.FC<LogsPanelProps> = ({ logs, onClear }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="bg-gray-900 text-gray-300 rounded-xl overflow-hidden shadow-lg border border-gray-800 flex flex-col h-full">
      <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-100">
          <Terminal className="w-4 h-4" />
          System Logs
        </div>
        <button 
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-white hover:bg-gray-700 px-2 py-1 rounded transition-colors"
        >
          Clear
        </button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-gray-600 italic text-center py-4">No logs yet. Start the scraper.</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
              <span className="text-gray-500 flex-shrink-0 select-none">
                {log.timestamp.toLocaleTimeString()}
              </span>
              <span className="flex-shrink-0 mt-0.5">{getIcon(log.level)}</span>
              <span className={`${log.level === 'error' ? 'text-red-300' : 'text-gray-300'} break-all`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogsPanel;
