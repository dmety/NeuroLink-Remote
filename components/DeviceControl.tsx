import React, { useEffect, useState } from 'react';
import { Power, RefreshCw, Zap, Wifi, Activity, Lock, Unlock } from 'lucide-react';
import { DeviceState } from '../types';
import { generateTechnicalExplanation } from '../services/geminiService';

interface DeviceControlProps {
  deviceState: DeviceState;
  setDeviceState: React.Dispatch<React.SetStateAction<DeviceState>>;
  addLog: (message: string, type?: 'info' | 'success' | 'warning' | 'error' | 'ai') => void;
}

export const DeviceControl: React.FC<DeviceControlProps> = ({ deviceState, setDeviceState, addLog }) => {
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(true);

  // Simulate telemetry updates
  useEffect(() => {
    if (deviceState.status === 'online') {
      const interval = setInterval(() => {
        setDeviceState(prev => ({
          ...prev,
          cpuLoad: Math.floor(Math.random() * 30) + 10,
          temp: Math.floor(Math.random() * 10) + 45
        }));
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setDeviceState(prev => ({ ...prev, cpuLoad: 0, temp: 20 }));
    }
  }, [deviceState.status, setDeviceState]);

  const handlePowerOn = async () => {
    if (deviceState.status !== 'offline') return;
    setLoading(true);
    addLog('正在启动唤醒序列...', 'warning');
    
    // Simulate Gemini explaining the magic packet
    const explanation = await generateTechnicalExplanation('wake', deviceState);
    addLog(`协议: ${explanation}`, 'ai');

    setTimeout(() => {
      setDeviceState(prev => ({ ...prev, status: 'booting' }));
      addLog('魔术封包(Magic Packet)已广播。', 'success');
      
      setTimeout(() => {
        setDeviceState(prev => ({ ...prev, status: 'online', lastSeen: '刚刚' }));
        addLog('目标设备已确认。系统在线。', 'success');
        setLoading(false);
      }, 3000);
    }, 1500);
  };

  const handlePowerOff = async () => {
    if (deviceState.status !== 'online' || locked) return;
    setLoading(true);
    addLog('正在启动远程关机协议...', 'warning');

    const explanation = await generateTechnicalExplanation('shutdown', deviceState);
    addLog(`协议: ${explanation}`, 'ai');

    setTimeout(() => {
        setDeviceState(prev => ({ ...prev, status: 'shutting_down' }));
        
        setTimeout(() => {
          setDeviceState(prev => ({ ...prev, status: 'offline', lastSeen: new Date().toLocaleTimeString() }));
          addLog('系统已停止。确认电源切断。', 'info');
          setLoading(false);
          setLocked(true); // Auto lock after shutdown
        }, 3000);
    }, 1000);
  };

  const getStatusDisplay = () => {
    switch(deviceState.status) {
      case 'online': return '在线';
      case 'offline': return '离线';
      case 'booting': return '启动中';
      case 'shutting_down': return '关机中';
      default: return deviceState.status;
    }
  }

  const getStatusColor = () => {
    switch(deviceState.status) {
      case 'online': return 'text-cyber-500 drop-shadow-[0_0_8px_rgba(0,255,157,0.5)]';
      case 'offline': return 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]';
      default: return 'text-yellow-400 animate-pulse';
    }
  };

  return (
    <div className="bg-cyber-800 border border-cyber-700 rounded-lg p-6 shadow-lg shadow-black/50 relative overflow-hidden group">
      {/* Decorative BG */}
      <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
        <Wifi size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">主工作站</h2>
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${deviceState.status === 'online' ? 'bg-cyber-500' : deviceState.status === 'offline' ? 'bg-red-500' : 'bg-yellow-400'}`}></div>
                    <span className={`text-sm uppercase font-bold tracking-wider ${getStatusColor()}`}>
                        {getStatusDisplay()}
                    </span>
                </div>
            </div>
            <div className="text-right font-mono text-xs text-slate-400">
                <p>MAC: {deviceState.macAddress}</p>
                <p>IP: {deviceState.ipAddress}</p>
            </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-cyber-900/50 p-3 rounded border border-cyber-700">
                <p className="text-xs text-slate-500 mb-1">CPU 负载</p>
                <div className="flex items-end gap-1">
                    <span className="text-xl font-bold text-white">{deviceState.cpuLoad}%</span>
                    <Activity size={16} className="mb-1 text-cyber-500" />
                </div>
                <div className="w-full h-1 bg-cyber-900 mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-cyber-500 transition-all duration-500" style={{ width: `${deviceState.cpuLoad}%` }}></div>
                </div>
            </div>
            <div className="bg-cyber-900/50 p-3 rounded border border-cyber-700">
                <p className="text-xs text-slate-500 mb-1">温度</p>
                <div className="flex items-end gap-1">
                    <span className="text-xl font-bold text-white">{deviceState.temp}°C</span>
                </div>
                <div className="w-full h-1 bg-cyber-900 mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 transition-all duration-500" style={{ width: `${(deviceState.temp / 90) * 100}%` }}></div>
                </div>
            </div>
            <div className="bg-cyber-900/50 p-3 rounded border border-cyber-700">
                <p className="text-xs text-slate-500 mb-1">最后在线</p>
                <div className="flex items-end gap-1">
                    <span className="text-sm font-bold text-white truncate">{deviceState.lastSeen}</span>
                </div>
            </div>
        </div>

        {/* Main Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center py-6 border-t border-cyber-700 border-dashed">
            
            {/* Power On Button */}
            <button
                onClick={handlePowerOn}
                disabled={deviceState.status !== 'offline' || loading}
                className={`
                    relative group/btn flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 transition-all duration-300
                    ${deviceState.status === 'offline' 
                        ? 'border-cyber-500 hover:bg-cyber-500/10 hover:shadow-[0_0_30px_rgba(0,255,157,0.3)] cursor-pointer' 
                        : 'border-slate-700 opacity-50 cursor-not-allowed'}
                `}
            >
                <Power size={48} className={deviceState.status === 'offline' ? 'text-cyber-500' : 'text-slate-600'} />
                <span className="mt-2 text-xs font-bold tracking-widest text-cyber-500">唤醒</span>
            </button>

            {/* Shutdown Controls */}
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setLocked(!locked)}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                        title="切换安全锁"
                    >
                        {locked ? <Lock size={20} /> : <Unlock size={20} className="text-red-400" />}
                    </button>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">安全锁: {locked ? '开启' : '关闭'}</span>
                </div>

                <button
                    onClick={handlePowerOff}
                    disabled={deviceState.status !== 'online' || locked || loading}
                    className={`
                        flex items-center gap-2 px-6 py-3 rounded border transition-all duration-300
                        ${deviceState.status === 'online' && !locked
                            ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500 hover:text-white' 
                            : 'bg-transparent border-slate-700 text-slate-600 cursor-not-allowed'}
                    `}
                >
                    <Zap size={18} />
                    <span className="font-bold tracking-wider">关机</span>
                </button>
            </div>

            <button
                onClick={() => window.location.reload()}
                className="absolute top-6 right-6 p-2 text-slate-600 hover:text-white transition-colors"
            >
                <RefreshCw size={16} />
            </button>

        </div>
      </div>
    </div>
  );
};