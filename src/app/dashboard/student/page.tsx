'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Coins, Trophy, Zap, Clock, ChevronRight, 
  Star, Flame, Target, MessageSquare, Send, Bot, 
  User, Sparkles, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function StudentDashboard() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [studentName, setStudentName] = useState('Estudante');
  const [stats, setStats] = useState({
    balance: 0,
    streak: 3,
    xp: 1250,
    dailyGoal: 75
  });
  const [loading, setLoading] = useState(true);
  
  // Chat State
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Olá! Eu sou o Tutor Gênio. No que posso te ajudar a aprender hoje? 🧠🚀' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/student/dashboard-data')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setLessons(data.lessons || []);
          setStudentName(data.username || 'Estudante');
          setStats(prev => ({ ...prev, balance: data.balance || 0 }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, data]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ops! Tive um probleminha aqui. Tenta de novo? 😅' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Aluno - Vibe Gamer */}
      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-blue-500/20"
        >
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-black">
                  🚀
               </div>
               <div>
                  <h1 className="text-3xl font-black">Olá, {studentName}!</h1>
                  <p className="font-bold opacity-80">Pronto para subir de nível hoje?</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Energia de Estudo</p>
                  <div className="flex items-center gap-2 mt-1">
                     <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 w-3/4" />
                     </div>
                     <span className="font-black text-sm">75%</span>
                  </div>
               </div>
               <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">XP Acumulado</p>
                  <p className="text-xl font-black mt-1">{stats.xp} pts</p>
               </div>
            </div>
          </div>
          <Brain className="absolute -right-10 -bottom-10 text-white/5" size={240} />
        </motion.div>

        <div className="space-y-6">
           <div className="premium-card p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-2xl text-orange-500">
                    <Coins size={24} />
                 </div>
                 <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">GênioCoins</p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white">{stats.balance}</p>
                 </div>
              </div>
           </div>

           <div className="premium-card p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="bg-rose-100 dark:bg-rose-900/30 p-3 rounded-2xl text-rose-500">
                    <Flame size={24} />
                 </div>
                 <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Ofensiva</p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white">{stats.streak} Dias</p>
                 </div>
              </div>
              <div className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse" />
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Tutor de IA - Chat UI */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <Bot className="text-blue-600" size={28} />
            Tutor Gênio
          </h2>

          <div className="premium-card h-[500px] flex flex-col bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-bold shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none animate-pulse flex gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
               <div className="relative">
                 <input 
                  type="text" 
                  placeholder="Pergunte qualquer coisa..."
                  className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl py-4 pl-6 pr-14 text-sm font-bold shadow-inner focus:ring-2 focus:ring-blue-500 transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isTyping}
                 />
                 <button 
                  type="submit"
                  disabled={isTyping || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
                 >
                   <Send size={18} />
                 </button>
               </div>
            </form>
          </div>
        </div>

        {/* Missões de Estudo */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <Target className="text-rose-600" size={28} />
            Suas Missões
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {loading ? (
               [1, 2].map(i => <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] animate-pulse" />)
            ) : lessons.length === 0 ? (
              <div className="col-span-full premium-card p-20 text-center space-y-4 bg-white dark:bg-slate-900">
                 <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-slate-300">
                    <Zap size={40} />
                 </div>
                 <h3 className="text-xl font-black text-slate-600">Nenhuma missão hoje!</h3>
                 <p className="text-slate-400 font-bold">Relaxe e aproveite seu tempo livre.</p>
              </div>
            ) : (
              lessons.map((lesson) => (
                <motion.div 
                  key={lesson.id}
                  whileHover={{ y: -5 }}
                  className="premium-card group bg-white dark:bg-slate-900"
                >
                  <div className="p-8 space-y-6">
                     <div className="flex justify-between items-start">
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                           <Brain size={28} />
                        </div>
                        <div className="badge bg-orange-100 dark:bg-orange-900/30 text-orange-600">
                           <Coins size={12} /> +150
                        </div>
                     </div>

                     <div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">
                          {lesson.topic?.name || 'Assunto sem nome'}
                        </h3>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">
                          {lesson.topic?.subject?.name || 'Matéria'}
                        </p>
                     </div>

                     <Link 
                      href={`/study/${lesson.id}`}
                      className="btn-primary w-full py-4 group-hover:shadow-blue-500/40 text-center flex items-center justify-center gap-2"
                     >
                       Começar Agora <ChevronRight size={18} />
                     </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
