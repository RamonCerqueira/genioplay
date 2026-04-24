'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Coins, Trophy, Zap, Clock, ChevronRight, 
  Star, Flame, Target, MessageSquare, Send, Bot, 
  User, Sparkles, Loader2, BookOpen
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
      if (data.error) throw new Error(data.error);
      setMessages(prev => [...prev, data]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ops! Parece que minha conexão com a nuvem de conhecimento falhou. Tente novamente em instantes! 😅☁️' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Top Banner - Design Mais Compacto e Moderno */}
      <div className="grid lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-4xl shadow-2xl border border-white/30">
                  🚀
               </div>
               <div>
                  <h1 className="text-4xl font-black tracking-tight">Olá, {studentName}!</h1>
                  <p className="font-bold text-blue-100 flex items-center gap-2 mt-1">
                    <Sparkles size={16} /> Você já conquistou 15% da meta semanal
                  </p>
               </div>
            </div>

            <div className="flex gap-4">
               <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
                  <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1">XP Atual</p>
                  <p className="text-2xl font-black">{stats.xp}</p>
               </div>
               <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
                  <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1">Missões</p>
                  <p className="text-2xl font-black">{lessons.length}</p>
               </div>
            </div>
          </div>
          <Brain className="absolute -right-20 -bottom-20 text-white/5" size={320} />
        </motion.div>

        <div className="space-y-6">
           <div className="premium-card p-6 bg-white dark:bg-slate-900 border-none shadow-xl shadow-orange-500/5 flex items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-8 -mt-8" />
              <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-2xl text-orange-500 relative z-10">
                 <Coins size={28} />
              </div>
              <div className="relative z-10">
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest">GênioCoins</p>
                 <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.balance}</p>
              </div>
           </div>

           <div className="premium-card p-6 bg-white dark:bg-slate-900 border-none shadow-xl shadow-rose-500/5 flex items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full -mr-8 -mt-8" />
              <div className="bg-rose-100 dark:bg-rose-900/30 p-4 rounded-2xl text-rose-500 relative z-10">
                 <Flame size={28} />
              </div>
              <div className="relative z-10">
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Ofensiva</p>
                 <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.streak} Dias</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content Grid - Refatorado para Melhor Alinhamento */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Tutor de IA - Lateral Esquerda (Mais Estreito) */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
               <Bot size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Tutor Gênio</h2>
          </div>

          <div className="premium-card flex-1 min-h-[500px] max-h-[600px] flex flex-col bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">IA Online - Pronto para ajudar</span>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] p-4 rounded-2xl text-sm font-bold leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none animate-pulse flex gap-1.5 items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
               <div className="relative group">
                 <input 
                  type="text" 
                  placeholder="Qual sua dúvida hoje?"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl py-4 pl-6 pr-14 text-sm font-bold focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isTyping}
                 />
                 <button 
                  type="submit"
                  disabled={isTyping || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50"
                 >
                   <Send size={18} />
                 </button>
               </div>
            </form>
          </div>
        </div>

        {/* Missões e Atividades - Lateral Direita (Mais Largo) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600">
                  <Target size={24} />
               </div>
               <h2 className="text-2xl font-black text-slate-800 dark:text-white">Missões do Dia</h2>
            </div>
            <Link href="/dashboard/lessons" className="text-xs font-black text-blue-600 hover:underline uppercase tracking-widest">Ver Todas</Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {loading ? (
               [1, 2, 3, 4].map(i => <div key={i} className="h-44 bg-slate-100 dark:bg-slate-800 rounded-[2rem] animate-pulse" />)
            ) : lessons.length === 0 ? (
              <div className="col-span-full premium-card p-20 text-center space-y-6 bg-white dark:bg-slate-900 border-dashed border-2">
                 <div className="bg-slate-50 dark:bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-slate-200">
                    <BookOpen size={48} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white">Tudo em dia!</h3>
                    <p className="text-slate-500 font-bold max-w-sm mx-auto mt-2">Você completou todas as suas missões. Que tal bater um papo com o Tutor Gênio sobre sua matéria favorita?</p>
                 </div>
              </div>
            ) : (
              lessons.map((lesson) => (
                <motion.div 
                  key={lesson.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="premium-card bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-none border-slate-100 dark:border-slate-800 overflow-hidden group"
                >
                  <div className="p-8 space-y-6 relative">
                     <div className="flex justify-between items-start">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                           <Brain size={32} />
                        </div>
                        <div className="badge bg-orange-100 dark:bg-orange-900/30 text-orange-600 border-none font-black flex items-center gap-1.5">
                           <Coins size={14} /> +150
                        </div>
                     </div>

                     <div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight mb-2">
                          {lesson.topic?.name || 'Assunto'}
                        </h3>
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
                             {lesson.topic?.subject?.name || 'Matéria'}
                           </span>
                           <span className="flex items-center gap-1 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                             <Clock size={12} /> 15 MIN
                           </span>
                        </div>
                     </div>

                     <Link 
                      href={`/study/${lesson.id}`}
                      className="btn-primary w-full py-4 text-center flex items-center justify-center gap-2 group-hover:bg-indigo-600 transition-colors"
                     >
                       Iniciar Jornada <ChevronRight size={18} />
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
