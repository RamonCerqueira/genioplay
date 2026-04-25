'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ChevronDown, MessageCircle, Send, Loader2 } from 'lucide-react';

interface TutorFABProps {
  isChatOpen: boolean;
  onToggleChat: () => void;
  chatInput: string;
  setChatInput: (val: string) => void;
  chatHistory: any[];
  isTyping: boolean;
  onSendMessage: () => void;
}

export const TutorFAB = ({ 
  isChatOpen, onToggleChat, chatInput, setChatInput, chatHistory, isTyping, onSendMessage 
}: TutorFABProps) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  return (
    <>
      <div className="fixed bottom-28 md:bottom-10 right-6 md:right-10 z-[60]">
        <button 
          onClick={onToggleChat}
          className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
        >
          {isChatOpen ? <ChevronDown size={30} /> : <Bot size={30} />}
          {!isChatOpen && (
            <div className="absolute right-20 bg-slate-800 text-white text-[10px] font-black px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest">
               Dúvida sobre a lição? 🧠
            </div>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-48 md:bottom-32 right-6 md:right-10 w-[90vw] md:w-96 h-[500px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl z-[60] border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            {/* Header do Chat */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                <Bot size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">GênioPlay Tutor</h4>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online agora</p>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${
                    msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none">
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
                  placeholder="Pergunte qualquer coisa..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-6 pr-14 text-sm font-bold focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                />
                <button 
                  onClick={onSendMessage}
                  disabled={!chatInput.trim() || isTyping}
                  className="absolute right-2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
