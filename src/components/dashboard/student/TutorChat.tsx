'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, Loader2, X, ChevronDown, MessageCircle } from 'lucide-react';

export const TutorChat = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Eu sou o Tutor Gênio. No que posso te ajudar a aprender hoje? 🧠🚀' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ops, tive um problema de conexão. Vamos tentar de novo?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-28 md:bottom-10 right-6 md:right-10 z-[100]">
      <AnimatePresence>
        {!isExpanded ? (
          /* Floating Action Button (FAB) */
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(true)}
            className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center relative group"
          >
            <Bot size={30} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
            
            {/* Tooltip Hover */}
            <div className="absolute right-20 bg-slate-800 text-white text-[10px] font-black px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest">
               Dúvida? Chame o Tutor! 🧠
            </div>
          </motion.button>
        ) : (
          /* Chat Window */
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="w-[90vw] md:w-[380px] h-[70vh] md:h-[520px] bg-white dark:bg-slate-900 rounded-[2.5rem] border border-blue-100 dark:border-slate-800 shadow-3xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-blue-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-black leading-none">Tutor Gênio</h3>
                  <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mt-1">Sempre Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronDown size={24} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-slate-50/30 dark:bg-slate-900/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-bold shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 rounded-tl-none">
                     <Loader2 className="animate-spin text-blue-600" size={20} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Diga algo ou peça ajuda..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-5 pr-14 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
