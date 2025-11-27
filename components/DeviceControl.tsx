import React, { useEffect, useState, useCallback } from 'react';
import { Power, RefreshCw, Zap, Wifi, Activity, Lock, Unlock, AlertTriangle, X } from 'lucide-react';
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
  const [showConfirmOff, setShowConfirmOff] = useState(false);

  // Simulate telemetry updates smoothly
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (deviceState.status === 'online') {
      interval = setInterval(() => {
        setDeviceState(prev => {
           // Create small random fluctuations rather than big jumps
           const loadChange = Math.floor(Math.random() * 5) - 2; 
           const newLoad = Math.max(1, Math.min(100, prev.cpuLoad + loadChange));
           
           const tempChange = Math.floor(Math.random() * 3) - 1;
           const newTemp = Math.max(30, Math.min(95, prev.temp + tempChange));

           return {
             ...prev,
             cpuLoad: newLoad,
             temp: newTemp
           };
        });
      }, 2000);
    } else {
      setDeviceState(prev => ({ ...prev, cpuLoad: 0, temp: 20 }));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [deviceState.status, setDeviceState]);

  const handlePowerOn = async () => {
    if (deviceState.status !== 'offline' || loading) return;
    setLoading(true);
    addLog('正在初始化 Wake-on-LAN 序列...', 'warning');
    
    try {
      const explanation = await generateTechnicalExplanation('wake', deviceState);
      addLog(`协议分析: ${explanation}`, 'ai');

      await new Promise(resolve => setTimeout(resolve, 1500));
      setDeviceState(prev => ({ ...prev, status: 'booting' }));
      addLog('魔术封包(Magic Packet) 已发送至广播地址。', 'success');
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      setDeviceState(prev => ({ ...prev, status: 'online', lastSeen: '刚刚', cpuLoad: 15, temp: 45 }));
      addLog('握手成功。目标设备已上线。', 'success');
    } catch (e) {
      addLog('唤醒序列异常中断。', 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmPowerOff = async () => {
    setShowConfirmOff(false);
    if (deviceState.status !== 'online' || locked) return;
    setLoading(true);
    addLog('正在请求 RPC 远程关机...', 'warning');

    try {
      const explanation = await generateTechnicalExplanation('shutdown', deviceState);
      addLog(`协议分析: ${explanation}`, 'ai');

      await new Promise(resolve => setTimeout(resolve, 1500));
      setDeviceState(prev => ({ ...prev, status: 'shutting_down' }));
        
      await new Promise(resolve => setTimeout(resolve, 3000));
      setDeviceState(prev => ({ ...prev, status: 'offline', lastSeen: new Date().toLocaleTimeString('zh-CN', { hour12: false }) }));
      addLog('连接丢失。确认设备已断电。', 'info');
      setLocked(true); // Auto lock after shutdown
    } catch (e) {
      addLog('关机指令执行失败。', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = () => {
    switch(deviceState.status) {
      case 'online': return '系统在线';
      case 'offline': return '系统离线';
      case 'booting': return '系统启动中...';
      case 'shutting_down': return '正在关机...';
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
    <div className="bg-cyber-800 border border-cyber-700 rounded-lg p-6 shadow-lg shadow-black/50 relative overflow-hidden group min-h-[400px]">
      {/* Decorative BG */}
      <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Wifi size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">主工作站</h2>
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full transition-colors duration-500 ${deviceState.status === 'online' ? 'bg-cyber-500 shadow-[0_0_10px_#00ff9d]' : deviceState.status === 'offline' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-yellow-400'}`}></div>
                    <span className={`text-sm uppercase font-bold tracking-wider transition-colors duration-500 ${getStatusColor()}`}>
                        {getStatusDisplay()}
                    </span>
                </div>
            </div>
            <div className="text-right font-mono text-xs text-slate-400 bg-cyber-900/50 p-2 rounded border border-cyber-700/50">
                <p>MAC: <span className="text-slate-300">{deviceState.macAddress}</span></p>
                <p>IP: <span className="text-slate-300">{deviceState.ipAddress}</span></p>
            </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-cyber-900/50 p-3 rounded border border-cyber-700 hover:border-cyber-500/50 transition-colors">
                <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">CPU 负载</p>
                <div className="flex items-end gap-1">
                    <span className="text-xl font-bold text-white font-mono">{deviceState.cpuLoad.toString().padStart(2, '0')}%</span>
                    <Activity size={16} className={`mb-1 ${deviceState.cpuLoad > 80 ? 'text-red-500' : 'text-cyber-500'}`} />
                </div>
                <div className="w-full h-1.5 bg-cyber-900 mt-2 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${deviceState.cpuLoad > 80 ? 'bg-red-500' : 'bg-cyber-500'}`} style={{ width: `${deviceState.cpuLoad}%` }}></div>
                </div>
            </div>
            <div className="bg-cyber-900/50 p-3 rounded border border-cyber-700 hover:border-cyber-500/50 transition-colors">
                <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">核心温度</p>
                <div className="flex items-end gap-1">
                    <span className="text-xl font-bold text-white font-mono">{deviceState.temp}°C</span>
                </div>
                <div className="w-full h-1.5 bg-cyber-900 mt-2 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${deviceState.temp > 80 ? 'bg-red-500' : 'bg-orange-400'}`} style={{ width: `${(deviceState.temp / 100) * 100}%` }}></div>
                </div>
            </div>
            <div className="bg-cyber-900/50 p-3 rounded border border-cyber-700 hover:border-cyber-500/50 transition-colors">
                <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">最后通讯</p>
                <div className="flex items-end gap-1">
                    <span className="text-sm font-bold text-white truncate font-mono mt-1">{deviceState.lastSeen}</span>
                </div>
            </div>
        </div>

        {/* Main Actions */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center py-6 border-t border-cyber-700/50 border-dashed">
            
            {/* Power On Button */}
            <div className="relative">
                 {/* Glowing Ring Effect */}
                {deviceState.status === 'offline' && !loading && (
                    <div className="absolute inset-0 rounded-full bg-cyber-500 blur-xl opacity-20 animate-pulse"></div>
                )}
                <button
                    onClick={handlePowerOn}
                    disabled={deviceState.status !== 'offline' || loading}
                    className={`
                        relative group/btn flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 transition-all duration-300 transform active:scale-95
                        ${deviceState.status === 'offline' 
                            ? 'border-cyber-500 bg-cyber-900/80 hover:bg-cyber-500/10 hover:shadow-[0_0_30px_rgba(0,255,157,0.3)] cursor-pointer text-cyber-500' 
                            : 'border-slate-800 bg-slate-900/50 text-slate-700 cursor-not-allowed opacity-50'}
                    `}
                >
                    <Power size={48} className={`transition-transform duration-500 ${loading ? 'animate-spin opacity-50' : ''}`} />
                    <span className="mt-2 text-xs font-bold tracking-widest">{loading ? '发送中' : '唤醒'}</span>
                </button>
            </div>

            {/* Shutdown Controls */}
            <div className="flex flex-col items-center gap-4 bg-cyber-900/30 p-4 rounded-xl border border-cyber-800">
                <div className="flex items-center justify-between w-full gap-4">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">安全协议锁</span>
                    <button 
                        onClick={() => setLocked(!locked)}
                        className={`p-2 rounded transition-colors ${locked ? 'text-cyber-500 hover:text-white' : 'text-red-500 hover:text-red-400'}`}
                        title={locked ? "点击解锁" : "点击锁定"}
                    >
                        {locked ? <Lock size={20} /> : <Unlock size={20} />}
                    </button>
                </div>

                <button
                    onClick={() => setShowConfirmOff(true)}
                    disabled={deviceState.status !== 'online' || locked || loading}
                    className={`
                        w-full flex items-center justify-center gap-2 px-6 py-3 rounded border transition-all duration-300 font-bold tracking-wider
                        ${deviceState.status === 'online' && !locked
                            ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500 hover:text-white shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                            : 'bg-transparent border-slate-800 text-slate-700 cursor-not-allowed'}
                    `}
                >
                    <Zap size={18} />
                    <span>系统关机</span>
                </button>
            </div>

            <button
                onClick={() => window.location.reload()}
                className="absolute top-6 right-6 p-2 text-slate-600 hover:text-white transition-colors bg-cyber-900/80 rounded hover:bg-cyber-800"
                title="重置模拟器"
            >
                <RefreshCw size={16} />
            </button>

        </div>
      </div>

      {/* Shutdown Confirmation Modal */}
      {showConfirmOff && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-red-950/30 border border-red-500 p-6 rounded-lg max-w-sm w-full shadow-[0_0_30px_rgba(239,68,68,0.2)] text-center">
            <AlertTriangle size={48} className="mx-auto text-red-500 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">确认强制关机?</h3>
            <p className="text-slate-300 text-sm mb-6">此操作将向目标发送 RPC 关机指令。未保存的数据可能会丢失。</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setShowConfirmOff(false)}
                className="px-4 py-2 rounded bg-slate-800 text-white hover:bg-slate-700 transition-colors text-sm"
              >
                取消
              </button>
              <button 
                onClick={confirmPowerOff}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-900/50 text-sm font-bold"
              >
                确认执行
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};