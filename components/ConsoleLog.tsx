import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface ConsoleLogProps {
  logs: LogEntry[];
}

export const ConsoleLog: React.FC<ConsoleLogProps> = React.memo(({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-500 font-bold';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-cyber-500 font-semibold';
      case 'ai': return 'text-blue-400 italic';
      default: return 'text-slate-300';
    }
  };

  const getLogIcon = (type: string) => {
    switch(type) {
        case 'ai': return 'NEUROLINK>';
        case 'error': return 'ERR>';
        case 'success': return 'OK>';
        default: return 'SYS>';
    }
  }

  return (
    <div className="h-[300px] lg:h-full overflow-y-auto font-mono text-xs md:text-sm p-2 scrollbar-thin scrollbar-thumb-cyber-800 scrollbar-track-transparent">
      {logs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 opacity-50">
             <div className="animate-pulse">_等待系统输入</div>
          </div>
      )}
      
      {logs.map((log) => (
        <div key={log.id} className="mb-2 leading-relaxed break-words hover:bg-white/5 p-0.5 rounded transition-colors">
          <span className="text-slate-600 mr-2 select-none text-[10px]">[{log.timestamp}]</span>
          <span className={`mr-2 font-bold ${log.type === 'ai' ? 'text-blue-500' : 'text-cyber-600'}`}>
            {getLogIcon(log.type)}
          </span>
          <span className={getLogColor(log.type)}>
            {log.message}
          </span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
});

ConsoleLog.displayName = 'ConsoleLog';