import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic } from 'lucide-react';
import { chatWithTechSupport } from '../services/geminiService';
import { ChatMessage, DeviceState } from '../types';

interface AIChatProps {
  addLog: (msg: string, type: 'ai' | 'info') => void;
  deviceState: DeviceState;
}

export const AIChat: React.FC<AIChatProps> = ({ addLog, deviceState }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: "我是 Neuromancer。我可以指导你如何配置网络唤醒（Wake-on-LAN）、BIOS 设置，或调试网络问题。有什么可以帮你？",
      timestamp: new Date()
    }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await chatWithTechSupport(userMsg.text, history, deviceState);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      
      // Also echo important advice to the main log
      if (responseText.length < 150) {
        addLog(`建议: ${responseText}`, 'ai');
      } else {
        addLog(`建议: 助手面板收到新的综合指南。`, 'ai');
      }

    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        text: "连接失败。请检查 API 配置。",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[500px] lg:h-[600px]">
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cyber-900/30">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`p-2 rounded-lg border flex-shrink-0 ${msg.role === 'model' ? 'bg-cyber-800 border-cyber-700' : 'bg-slate-800 border-slate-700'}`}>
              {msg.role === 'model' ? <Bot size={20} className="text-cyber-500" /> : <User size={20} className="text-blue-400" />}
            </div>
            <div className={`
              max-w-[85%] p-3 rounded-lg text-sm leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-blue-900/20 border border-blue-900/50 text-blue-100 rounded-tr-none' 
                : 'bg-cyber-900/50 border border-cyber-800 text-slate-300 rounded-tl-none'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex items-start gap-3">
             <div className="p-2 rounded-lg bg-cyber-800 border border-cyber-700">
               <Bot size={20} className="text-cyber-500" />
             </div>
             <div className="flex items-center gap-1 h-10 px-3">
               <span className="w-1.5 h-1.5 bg-cyber-500 rounded-full animate-bounce" style={{ animationDelay: '0s'}}></span>
               <span className="w-1.5 h-1.5 bg-cyber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></span>
               <span className="w-1.5 h-1.5 bg-cyber-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s'}}></span>
             </div>
           </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-cyber-800 border-t border-cyber-700">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="询问如何开启网络唤醒 (Wake-on-LAN)..."
            className="w-full bg-cyber-900 border border-cyber-700 rounded-full py-3 pl-4 pr-24 text-sm text-white focus:outline-none focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500 placeholder-slate-600 transition-all"
          />
          <div className="absolute right-2 flex items-center gap-1">
             <button className="p-2 text-slate-500 hover:text-white transition-colors">
                <Mic size={18} />
             </button>
             <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`p-2 rounded-full transition-all ${input.trim() ? 'bg-cyber-600 text-white hover:bg-cyber-500' : 'bg-slate-700 text-slate-500'}`}
             >
                <Send size={18} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};