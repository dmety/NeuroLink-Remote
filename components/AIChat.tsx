import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, Sparkles } from 'lucide-react';
import { chatWithTechSupport } from '../services/geminiService';
import { ChatMessage, DeviceState } from '../types';

interface AIChatProps {
  addLog: (msg: string, type: 'ai' | 'info') => void;
  deviceState: DeviceState;
}

// Hook for typewriter effect
const useTypewriter = (text: string, speed: number = 20, isComplete: boolean) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    if (!text) {
        setDisplayText('');
        return;
    }
    // If text is already fully displayed or effect shouldn't run
    if (isComplete) {
        setDisplayText(text);
        return;
    }

    let i = 0;
    setDisplayText('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, isComplete]);

  return displayText;
};

const ChatMessageBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
    // Only apply typewriter effect to the LAST message if it's from the model and new
    const isModel = msg.role === 'model';
    // Simple logic: if message is old (not the very latest one logic handled by parent theoretically, 
    // but here we just render. We'll simulate typewriter for all AI messages on mount to keep it simple 
    // or just render full text. For better UX, only animate the new one. 
    // Here we will just animate all model messages fast or render directly.
    // Let's keep it simple: Just render text directly for history, animate new ones.
    // Actually, handling "new" status is complex without extra state. 
    // We will just render text directly for simplicity and robustness in this version 
    // OR we can make a component that animates once.
    
    // Improved Approach: Animate on mount if it's a model message
    const [displayedText, setDisplayedText] = useState(isModel ? '' : msg.text);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!isModel || hasAnimated.current) {
            setDisplayedText(msg.text);
            return;
        }

        let i = 0;
        const speed = 15; // ms per char
        const timer = setInterval(() => {
            if (i < msg.text.length) {
                setDisplayedText(prev => prev + msg.text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
                hasAnimated.current = true;
            }
        }, speed);

        return () => clearInterval(timer);
    }, [msg.text, isModel]);

    return (
        <div className={`
            max-w-[85%] p-3 rounded-lg text-sm leading-relaxed shadow-md
            ${msg.role === 'user' 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-cyber-800 border border-cyber-700 text-slate-300 rounded-tl-none'}
        `}>
            {displayedText}
            {isModel && displayedText.length < msg.text.length && (
                <span className="inline-block w-2 h-4 align-middle bg-cyber-500 animate-pulse ml-1"></span>
            )}
        </div>
    );
};


export const AIChat: React.FC<AIChatProps> = ({ addLog, deviceState }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: "我是 Neuromancer (神经漫游者)。\n我可以指导你配置 Wake-on-LAN (BIOS/网卡设置)，或提供内网穿透方案 (Frp/Ngrok) 的建议。\n请告诉我你的需求。",
      timestamp: new Date()
    }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, loading]); 

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
      
      // Echo important advice to log
      if (responseText.length < 100) {
        addLog(`AI建议: ${responseText}`, 'ai');
      } else {
        addLog(`AI: 已生成详细技术方案。`, 'ai');
      }

    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        text: "错误：与神经网络的连接已断开 (API Key Error or Network Issue)。",
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
    <div className="flex flex-col h-full bg-cyber-900/30">
      {/* Chat History */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-cyber-800 scrollbar-track-transparent"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`
                p-2 rounded-lg flex-shrink-0 border shadow-[0_0_10px_rgba(0,0,0,0.3)]
                ${msg.role === 'model' ? 'bg-cyber-900 border-cyber-700' : 'bg-blue-900 border-blue-700'}
            `}>
              {msg.role === 'model' ? <Bot size={20} className="text-cyber-500" /> : <User size={20} className="text-blue-200" />}
            </div>
            
            <ChatMessageBubble msg={msg} />
          </div>
        ))}
        
        {loading && (
           <div className="flex items-start gap-3 animate-pulse">
             <div className="p-2 rounded-lg bg-cyber-900 border border-cyber-700">
               <Bot size={20} className="text-cyber-500" />
             </div>
             <div className="flex items-center gap-1 h-10 px-3 bg-cyber-800/50 rounded-lg rounded-tl-none border border-cyber-700/50">
               <span className="w-1.5 h-1.5 bg-cyber-500 rounded-full animate-bounce" style={{ animationDelay: '0s'}}></span>
               <span className="w-1.5 h-1.5 bg-cyber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></span>
               <span className="w-1.5 h-1.5 bg-cyber-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s'}}></span>
             </div>
           </div>
        )}
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-cyber-900 border-t border-cyber-700">
        <div className="relative flex items-center group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder={loading ? "神经网络正在计算..." : "输入指令或询问技术问题..."}
            className="w-full bg-black/50 border border-cyber-800 rounded-xl py-3 pl-4 pr-24 text-sm text-white focus:outline-none focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500 placeholder-slate-600 transition-all disabled:opacity-50"
          />
          <div className="absolute right-2 flex items-center gap-1">
             <button 
                className="p-2 text-slate-500 hover:text-cyber-500 transition-colors hidden sm:block" 
                title="语音输入 (模拟)"
             >
                <Mic size={18} />
             </button>
             <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`
                    p-2 rounded-lg transition-all transform active:scale-95 flex items-center justify-center
                    ${input.trim() && !loading ? 'bg-cyber-600 text-white hover:bg-cyber-500 shadow-[0_0_10px_rgba(0,255,157,0.3)]' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
                `}
             >
                {loading ? <Sparkles size={18} className="animate-spin" /> : <Send size={18} />}
             </button>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-slate-600 text-center">
            * AI 可能会产生不准确的信息，请核实关键系统命令。
        </div>
      </div>
    </div>
  );
};