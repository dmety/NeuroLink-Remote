import React from 'react';
import { Network, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGuide }) => {
  return (
    <header className="bg-cyber-900 border-b border-cyber-700 p-4 sticky top-0 z-40 bg-opacity-90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyber-800 rounded-lg border border-cyber-700 shadow-[0_0_10px_rgba(0,255,157,0.2)]">
            <Network className="text-cyber-500" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest text-white">NEUROLINK<span className="text-cyber-500">_远程</span></h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-500 animate-pulse"></span>
              <p className="text-[10px] text-cyber-400 uppercase tracking-wider">安全连接已激活</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenGuide}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyber-700 bg-cyber-900/50 hover:bg-cyber-800 hover:border-cyber-500 transition-all group"
          >
            <BookOpen size={14} className="text-cyber-500 group-hover:text-white" />
            <span className="text-xs text-slate-300 group-hover:text-white font-mono">部署指南</span>
          </button>
          
          <div className="hidden md:block text-right">
            <p className="text-xs text-slate-400">V.3.1.0-ALPHA</p>
            <p className="text-xs text-slate-600">禁止未经授权的访问</p>
          </div>
        </div>
      </div>
    </header>
  );
};
