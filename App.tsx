import React, { useState, useEffect } from 'react';
import { DeviceControl } from './components/DeviceControl';
import { ConsoleLog } from './components/ConsoleLog';
import { AIChat } from './components/AIChat';
import { Header } from './components/Header';
import { GuideModal } from './components/GuideModal';
import { DeviceState, LogEntry } from './types';
import { Power, Terminal, Cpu, MessageSquare, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'control' | 'chat'>('control');
  const [showGuide, setShowGuide] = useState(false);
  
  // App State
  const [deviceState, setDeviceState] = useState<DeviceState>({
    status: 'offline',
    ipAddress: '192.168.1.15',
    macAddress: 'AB:CD:EF:12:34:56',
    lastSeen: '从未',
    cpuLoad: 0,
    temp: 20
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' | 'ai' = 'info') => {
    setLogs(prev => {
      const newLog = {
        id: Date.now().toString() + Math.random(),
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
        message,
        type
      };
      // Keep log history manageable
      if (prev.length > 100) {
        return [...prev.slice(1), newLog];
      }
      return [...prev, newLog];
    });
  };

  useEffect(() => {
    addLog('NeuroLink 系统核心已加载。', 'info');
    addLog('正在初始化神经接口协议...', 'warning');
    const timer = setTimeout(() => {
        addLog('安全连接已建立。等待指令。', 'success');
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-mono text-sm md:text-base relative overflow-hidden bg-cyber-900 text-slate-200 selection:bg-cyber-500 selection:text-black">
      <Header onOpenGuide={() => setShowGuide(true)} />
      
      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 z-10 pb-24 lg:pb-6">
        
        {/* Left Column: Device Control & Status */}
        <div className={`lg:col-span-7 flex flex-col gap-6 transition-opacity duration-300 ${activeTab === 'chat' ? 'hidden lg:flex' : 'flex'}`}>
          <DeviceControl 
            deviceState={deviceState} 
            setDeviceState={setDeviceState} 
            addLog={addLog}
          />
          <div className="flex-1 min-h-[300px] bg-cyber-800 border border-cyber-700 rounded-lg p-4 shadow-lg shadow-black/50 relative overflow-hidden">
             <div className="flex items-center gap-2 mb-4 text-cyber-500 border-b border-cyber-700 pb-2">
                <Terminal size={18} />
                <h2 className="font-bold tracking-wider">系统日志 / SYSTEM LOG</h2>
             </div>
             <ConsoleLog logs={logs} />
          </div>
        </div>

        {/* Right Column: AI Assistant */}
        <div className={`lg:col-span-5 flex flex-col gap-6 h-[calc(100vh-140px)] lg:h-auto ${activeTab === 'control' ? 'hidden lg:flex' : 'flex'}`}>
           <div className="flex-1 bg-cyber-800 border border-cyber-700 rounded-lg shadow-lg shadow-black/50 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-cyber-700 flex items-center justify-between bg-cyber-900/50">
                <div className="flex items-center gap-2 text-blue-400">
                  <Cpu size={18} />
                  <h2 className="font-bold tracking-wider">AI 助手 / ASSISTANT</h2>
                </div>
                <div className="flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                   <div className="text-[10px] text-slate-500 font-bold">ONLINE</div>
                </div>
              </div>
              <AIChat addLog={addLog} deviceState={deviceState} />
           </div>
        </div>

      </main>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-cyber-900/95 backdrop-blur-md border-t border-cyber-700 p-2 pb-safe flex justify-around z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => setActiveTab('control')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all w-20 ${activeTab === 'control' ? 'text-cyber-500 bg-cyber-800/50' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Power size={20} />
          <span className="text-[10px] font-bold">控制台</span>
        </button>
        
        {/* Center Floating Action Button for Guide */}
        <button 
          onClick={() => setShowGuide(true)}
          className="flex flex-col items-center justify-center -mt-8"
        >
           <div className="bg-cyber-800 p-3 rounded-full border border-cyber-500 shadow-[0_0_15px_rgba(0,255,157,0.4)] active:scale-95 transition-transform">
             <BookOpen size={24} className="text-white" />
           </div>
           <span className="text-[10px] text-cyber-400 mt-1 font-bold">指南</span>
        </button>

        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all w-20 ${activeTab === 'chat' ? 'text-blue-400 bg-blue-900/20' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <MessageSquare size={20} />
          <span className="text-[10px] font-bold">AI 助手</span>
        </button>
      </div>

      {/* Modals */}
      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}

    </div>
  );
};

export default App;