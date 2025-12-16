import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, MessageSquare } from 'lucide-react';
import { createSecurityChat } from '../services/gemini';
import { Chat } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SecurityChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your AI Security Analyst. Ask me anything about passwords, 2FA, or how to stay safe online.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSession.current = createSecurityChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession.current) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const result = await chatSession.current.sendMessage({ message: userMsg });
      const responseText = result.text;
      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the security database. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex items-center gap-3">
          <div className="bg-blue-500/10 p-2 rounded-lg">
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Ask the Analyst</h3>
            <p className="text-xs text-slate-400">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-700 text-slate-200 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                 <Bot size={16} className="text-white" />
               </div>
               <div className="bg-slate-700 rounded-2xl rounded-tl-none p-4 flex gap-1 items-center">
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-900/50 border-t border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question about cybersecurity..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white p-2 rounded-lg transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
     </div>
  );
};

export default SecurityChat;
