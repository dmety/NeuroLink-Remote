import React, { useState, useEffect } from 'react';
import { DeviceControl } from './components/DeviceControl';
import { ConsoleLog } from './components/ConsoleLog';
import { AIChat } from './components/AIChat';
import { Header } from './components/Header';
import { GuideModal } from './components/GuideModal';
import { DeviceState, LogEntry } from './types';
import { Power, Terminal, Cpu, MessageSquare } from 'lucide-react';

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
    setLogs(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  };

  useEffect(() => {
    addLog('NeuroLink 系统初始化完成。', 'info');
    addLog('正在连接神经接口...', 'info');
    setTimeout(() => addLog('连接已建立。准备接收指令。', 'success'), 800);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-mono text-sm md:text-base relative overflow-hidden">
      <Header onOpenGuide={() => setShowGuide(true)} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 z-10">
        
        {/* Left Column: Device Control & Status */}
        <div className={`lg:col-span-7 flex flex-col gap-6 ${activeTab === 'chat' ? 'hidden lg:flex' : 'flex'}`}>
          <DeviceControl 
            deviceState={deviceState} 
            setDeviceState={setDeviceState} 
            addLog={addLog}
          />
          <div className="flex-1 min-h-[300px] bg-cyber-800 border border-cyber-700 rounded-lg p-4 shadow-lg shadow-black/50">
             <div className="flex items-center gap-2 mb-4 text-cyber-500 border-b border-cyber-700 pb-2">
                <Terminal size={18} />
                <h2 className="font-bold tracking-wider">系统日志</h2>
             </div>
             <ConsoleLog logs={logs} />
          </div>
        </div>

        {/* Right Column: AI Assistant & Configuration */}
        <div className={`lg:col-span-5 flex flex-col gap-6 h-[calc(100vh-8rem)] lg:h-auto ${activeTab === 'control' ? 'hidden lg:flex' : 'flex'}`}>
           <div className="flex-1 bg-cyber-800 border border-cyber-700 rounded-lg shadow-lg shadow-black/50 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-cyber-700 flex items-center justify-between bg-cyber-900/50">
                <div className="flex items-center gap-2 text-blue-400">
                  <Cpu size={18} />
                  <h2 className="font-bold tracking-wider">AI 助手</h2>
                </div>
                <div className="text-xs text-slate-500">GEMINI-2.5-FLASH</div>
              </div>
              <AIChat addLog={addLog} deviceState={deviceState} />
           </div>
        </div>

      </main>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-cyber-900 border-t border-cyber-700 p-4 flex justify-around z-50">
        <button 
          onClick={() => setActiveTab('control')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'control' ? 'text-cyber-500' : 'text-slate-500'}`}
        >
          <Power size={24} />
          <span className="text-xs">控制</span>
        </button>
        <button 
          onClick={() => {
            setShowGuide(true);
          }}
          className="flex flex-col items-center gap-1 text-slate-500"
        >
           {/* Mobile only Guide Button integrated in Tab Bar for visibility if desired, or keep hidden. 
               Let's keep it clean and maybe add a small floating button or just rely on the user finding it in desktop header? 
               Wait, mobile header is sticky, so the Header button is visible? 
               The Header 'Deployment Guide' button is `hidden md:flex`. 
               I should make it visible on mobile too or add it here. 
               Let's add it to the mobile nav for better UX.
           */}
           <div className="bg-cyber-800 p-2 rounded-full -mt-8 border border-cyber-500 shadow-[0_0_10px_rgba(0,255,157,0.3)]">
             <Cpu size={24} className="text-white" />
           </div>
           <span className="text-xs text-cyber-400">指南</span>
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-blue-400' : 'text-slate-500'}`}
        >
          <MessageSquare size={24} />
          <span className="text-xs">助手</span>
        </button>
      </div>

      {/* Modals */}
      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}

    </div>
  );
};

export default App;
