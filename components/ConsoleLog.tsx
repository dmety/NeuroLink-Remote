import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface ConsoleLogProps {
  logs: LogEntry[];
}

export const ConsoleLog: React.FC<ConsoleLogProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-cyber-500';
      case 'ai': return 'text-blue-400 italic';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="h-[300px] lg:h-full overflow-y-auto font-mono text-xs md:text-sm p-2">
      {logs.length === 0 && <div className="text-slate-600 text-center mt-10">等待系统输入...</div>}
      
      {logs.map((log) => (
        <div key={log.id} className="mb-1.5 break-words">
          <span className="text-slate-500 mr-2">[{log.timestamp}]</span>
          <span className="text-cyber-400 mr-2">{log.type === 'ai' ? 'NEUROLINK>' : '系统>'}</span>
          <span className={getLogColor(log.type)}>
            {log.message}
          </span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};