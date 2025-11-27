import React, { useEffect } from 'react';
import { X, Server, Settings, Shield, Smartphone, Globe, Cpu, ArrowRight } from 'lucide-react';

interface GuideModalProps {
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={(e) => {
            // Close if clicking the backdrop
            if (e.target === e.currentTarget) onClose();
        }}
    >
      <div className="bg-cyber-900 border border-cyber-500/50 rounded-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,255,157,0.15)] relative">
        
        {/* Header */}
        <div className="p-4 border-b border-cyber-700 flex justify-between items-center bg-cyber-800 shrink-0">
          <div className="flex items-center gap-2 text-cyber-500">
            <div className="p-1 border border-cyber-500 rounded bg-cyber-500/10">
                <Shield size={20} />
            </div>
            <h2 className="text-lg font-bold tracking-widest text-white">实战部署架构指南</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors text-slate-400"
            aria-label="关闭"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-slate-300 font-mono scrollbar-thin scrollbar-thumb-cyber-700 scrollbar-track-transparent">
          
          {/* Introduction Alert */}
          <section className="bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h3 className="text-blue-400 font-bold text-lg mb-2 flex items-center gap-2">
              <Cpu size={20} />
              当前状态：模拟模式
            </h3>
            <p className="text-sm leading-relaxed text-blue-100">
              此应用目前运行在演示模式。要控制真实硬件，你需要搭建一个后端服务（如 Node.js/Python）并将其部署在你的局域网中。
            </p>
          </section>

          {/* Step 1: Hardware & BIOS */}
          <section>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-cyber-900 border border-cyber-500 flex items-center justify-center text-cyber-500 font-bold">1</div>
                <h3 className="text-white font-bold text-lg">硬件准备与 BIOS 设置</h3>
            </div>
            <div className="ml-11 bg-slate-900/50 p-4 rounded border border-slate-700/50 space-y-3 text-sm">
                <div className="flex gap-2 items-start">
                    <ArrowRight size={16} className="text-cyber-500 mt-1 shrink-0" />
                    <p><strong className="text-white">主板支持：</strong> 确保主板支持 <strong>Wake-on-LAN (WoL)</strong>。进入 BIOS (通常按 Del/F2) - 电源管理 - 开启 "PCIe Device Power On"。</p>
                </div>
                <div className="flex gap-2 items-start">
                    <ArrowRight size={16} className="text-cyber-500 mt-1 shrink-0" />
                    <p><strong className="text-white">有线连接：</strong> 强烈建议使用网线 (Ethernet) 连接路由器。Wi-Fi 唤醒 (WoWLAN) 极不稳定。</p>
                </div>
                <div className="flex gap-2 items-start">
                    <ArrowRight size={16} className="text-cyber-500 mt-1 shrink-0" />
                    <p><strong className="text-white">系统设置：</strong> Windows 设备管理器 - 网卡属性 - 电源管理 - 勾选“允许此设备唤醒计算机”。</p>
                </div>
            </div>
          </section>

          {/* Step 2: Architecture */}
          <section>
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-cyber-900 border border-cyber-500 flex items-center justify-center text-cyber-500 font-bold">2</div>
                <h3 className="text-white font-bold text-lg">中间件搭建 (The Bridge)</h3>
            </div>
            <div className="ml-11 grid md:grid-cols-2 gap-4">
              <div className="bg-cyber-800/30 p-4 rounded border border-cyber-700 hover:border-cyber-500 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-cyber-400">
                    <Server size={18} />
                    <h4 className="font-bold">方案 A：树莓派/微服务器 (推荐)</h4>
                </div>
                <p className="text-xs text-slate-400 mb-3">最稳定的方案，适合开发者。</p>
                <ol className="list-decimal pl-4 text-xs space-y-1 text-slate-300">
                  <li>在局域网运行 Node.js Express 服务。</li>
                  <li>使用 `wol` npm 包发送广播包。</li>
                  <li>使用 `shutdown-command` 或 SSH 执行关机。</li>
                </ol>
              </div>
              <div className="bg-cyber-800/30 p-4 rounded border border-cyber-700 hover:border-cyber-500 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-purple-400">
                    <Settings size={18} />
                    <h4 className="font-bold">方案 B：智能硬件接入</h4>
                </div>
                <p className="text-xs text-slate-400 mb-3">无代码方案。</p>
                <ol className="list-decimal pl-4 text-xs space-y-1 text-slate-300">
                  <li>智能插座 + BIOS "来电自启"。</li>
                  <li>SwitchBot 物理按键机器人。</li>
                  <li>通过 HomeAssistant API 对接本应用。</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Step 3: Public Access */}
          <section>
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-cyber-900 border border-cyber-500 flex items-center justify-center text-cyber-500 font-bold">3</div>
                <h3 className="text-white font-bold text-lg">外网访问 (Tunneling)</h3>
            </div>
            <div className="ml-11 space-y-3 text-sm">
                <div className="p-3 bg-green-900/20 border border-green-800/50 rounded flex gap-3">
                    <span className="font-bold text-green-400 shrink-0">推荐方案</span>
                    <span>使用 <strong>Tailscale / ZeroTier</strong> 组建虚拟局域网。这是最安全且无需公网 IP 的方案。</span>
                </div>
                <div className="p-3 bg-yellow-900/20 border border-yellow-800/50 rounded flex gap-3">
                    <span className="font-bold text-yellow-400 shrink-0">进阶方案</span>
                    <span>使用 <strong>Frp / Cloudflare Tunnel</strong> 将内网服务映射到公网域名，方便在任意浏览器访问。</span>
                </div>
            </div>
          </section>

          {/* Step 4: Code Implementation */}
          <section>
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-cyber-900 border border-cyber-500 flex items-center justify-center text-cyber-500 font-bold">4</div>
                <h3 className="text-white font-bold text-lg">代码修改示例</h3>
            </div>
            <div className="ml-11 bg-black p-4 rounded-lg border border-slate-800 font-mono text-xs text-green-400 shadow-inner overflow-x-auto">
              <pre>
{`// 修改 DeviceControl.tsx 中的 handlePowerOn
const handlePowerOn = async () => {
  try {
    // 调用你的真实后端 API
    await fetch('https://api.my-home-lab.com/wake', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer MY_SECRET_KEY' },
      body: JSON.stringify({ mac: 'AB:CD:EF:12:34:56' })
    });
    addLog('真实唤醒指令已发送', 'success');
  } catch (err) {
    addLog('连接家庭服务器失败', 'error');
  }
}`}
              </pre>
            </div>
          </section>

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-cyber-700 bg-cyber-800 text-center shrink-0">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">
            NeuroLink Protocol v3.1 // Authorized Personnel Only
          </p>
        </div>

      </div>
    </div>
  );
};