import React from 'react';
import { X, Server, Settings, Shield, Smartphone, Globe, Cpu } from 'lucide-react';

interface GuideModalProps {
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-cyber-900 border border-cyber-500 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,255,157,0.1)] relative">
        
        {/* Header */}
        <div className="p-4 border-b border-cyber-700 flex justify-between items-center bg-cyber-800">
          <div className="flex items-center gap-2 text-cyber-500">
            <Shield size={24} />
            <h2 className="text-xl font-bold tracking-widest">实战部署架构指南</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-slate-300 font-mono">
          
          {/* Introduction */}
          <section className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
            <h3 className="text-blue-400 font-bold text-lg mb-2 flex items-center gap-2">
              <Cpu size={20} />
              当前状态：模拟模式
            </h3>
            <p className="text-sm leading-relaxed">
              你目前看到的是一个<strong>前端控制面板</strong>。要让它真正控制你的电脑，你需要将此应用部署到公网（如 Vercel），并连接到你家中的一个<strong>后端服务</strong>（如树莓派、NAS 或 Always-on Server）。
            </p>
          </section>

          {/* Step 1: Hardware & BIOS */}
          <section>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 border-b border-cyber-700 pb-2">
              <Settings size={20} className="text-cyber-500" />
              第一步：硬件与 BIOS 设置
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                <strong className="text-cyber-400">主板支持：</strong> 确保主板支持 <strong>Wake-on-LAN (WoL)</strong>。绝大多数现代主板都支持。
              </li>
              <li>
                <strong className="text-cyber-400">BIOS 设置：</strong> 进入 BIOS (通常按 Del 或 F2)，在电源管理 (Power Management) 中开启 "PCIe Device Power On" 或 "Wake on LAN"。
              </li>
              <li>
                <strong className="text-cyber-400">网线连接：</strong> 强烈建议目标电脑使用<strong>有线网线 (Ethernet)</strong> 连接路由器。虽然部分无线网卡支持 WoWLAN，但不稳定。
              </li>
              <li>
                <strong className="text-cyber-400">Windows 设置：</strong> 设备管理器 -> 网络适配器 -> 属性 -> 电源管理 -> 勾选 "允许此设备唤醒计算机"。
              </li>
            </ul>
          </section>

          {/* Step 2: Architecture */}
          <section>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 border-b border-cyber-700 pb-2">
              <Server size={20} className="text-cyber-500" />
              第二步：搭建中间件（后端桥梁）
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-cyber-800/50 p-4 rounded border border-cyber-700">
                <h4 className="font-bold text-white mb-2">方案 A：树莓派/微型服务器 (推荐)</h4>
                <p className="text-xs mb-3">在局域网内运行一个 24 小时在线的低功耗设备。</p>
                <ol className="list-decimal pl-4 text-xs space-y-1 text-slate-400">
                  <li>运行一个简单的 Node.js/Python 服务。</li>
                  <li>该服务接收来自本网页的 HTTP 请求。</li>
                  <li>服务在局域网内广播 UDP 魔术封包 (Magic Packet) 唤醒电脑。</li>
                  <li>使用 SSH 或 RPC 执行关机命令。</li>
                </ol>
              </div>
              <div className="bg-cyber-800/50 p-4 rounded border border-cyber-700">
                <h4 className="font-bold text-white mb-2">方案 B：智能硬件辅助</h4>
                <p className="text-xs mb-3">适合不想写代码的用户。</p>
                <ol className="list-decimal pl-4 text-xs space-y-1 text-slate-400">
                  <li>使用<strong>智能插座</strong> + BIOS "通电自动开机 (AC Back Always On)"。</li>
                  <li>或使用 <strong>SwitchBot (手指机器人)</strong> 物理按压开机键。</li>
                  <li>本 App 可以对接智能家居 API (HomeAssistant) 来控制这些硬件。</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Step 3: Public Access */}
          <section>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 border-b border-cyber-700 pb-2">
              <Globe size={20} className="text-cyber-500" />
              第三步：外网访问 (手机控制)
            </h3>
            <div className="space-y-4 text-sm">
              <p>
                当你在家门外用手机 4G/5G 时，你需要访问家里的后端服务：
              </p>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="bg-green-900 text-green-300 text-xs px-2 py-0.5 rounded">方法 1</span>
                  <span><strong>内网穿透 (Frp/Ngrok/Cloudflare Tunnel)：</strong> 最安全。将树莓派的接口映射到公网域名。</span>
                </li>
                <li className="flex gap-2">
                  <span className="bg-yellow-900 text-yellow-300 text-xs px-2 py-0.5 rounded">方法 2</span>
                  <span><strong>公网 IP + DDNS + 端口转发：</strong> 在路由器设置端口转发 (Port Forwarding)，将外部请求转发给树莓派。注意安全性。</span>
                </li>
                <li className="flex gap-2">
                  <span className="bg-purple-900 text-purple-300 text-xs px-2 py-0.5 rounded">方法 3</span>
                  <span><strong>VPN / ZeroTier / Tailscale：</strong> 手机和家里设备组成虚拟局域网。这是最简单的“不折腾”方案。</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Step 4: Code Implementation */}
          <section>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 border-b border-cyber-700 pb-2">
              <Smartphone size={20} className="text-cyber-500" />
              第四步：修改本应用代码
            </h3>
            <div className="bg-black p-4 rounded border border-slate-800 font-mono text-xs text-green-400">
              <p className="text-slate-500 mb-2">// 示例：修改 handlePowerOn 函数调用真实后端</p>
              <p>const handlePowerOn = async () =&gt; &#123;</p>
              <p className="pl-4">await fetch('https://your-home-server.com/api/wake', &#123;</p>
              <p className="pl-8">method: 'POST',</p>
              <p className="pl-8">headers: &#123; 'Authorization': 'Bearer YOUR_SECRET_KEY' &#125;,</p>
              <p className="pl-8">body: JSON.stringify(&#123; mac: 'AB:CD:EF:12:34:56' &#125;)</p>
              <p className="pl-4">&#125;);</p>
              <p>&#125;</p>
            </div>
          </section>

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-cyber-700 bg-cyber-800 text-center">
          <p className="text-xs text-slate-500">
            NeuroLink 系统架构 v3.0 // 安全警告：请勿将未加密的管理接口直接暴露在公网
          </p>
        </div>

      </div>
    </div>
  );
};
