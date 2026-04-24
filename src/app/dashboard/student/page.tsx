'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Coins, Trophy, Zap, Clock, ChevronRight, Star, Flame, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { motion } from 'framer-motion';
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

  useEffect(() => {
    // Busca lições e dados do aluno
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

  return (
    <div className="space-y-10">
      {/* Header Aluno - Vibe Gamer */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-blue-500/20"
        >
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-black">
                  🚀
               </div>
               <div>
                  <h1 className="text-3xl font-black">Olá, {studentName}!</h1>
                  <p className="font-bold opacity-80">Você tem {lessons.length} novas missões hoje.</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Nível de Energia</p>
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
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Seu Saldo</p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white">{stats.balance}</p>
                 </div>
              </div>
              <Link href="/dashboard/shop" className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                <ChevronRight size={20} />
              </Link>
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

      {/* Missões do Dia */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <Target className="text-blue-600" size={28} />
          Missões de Estudo
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             [1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] animate-pulse" />)
          ) : lessons.length === 0 ? (
            <div className="col-span-full premium-card p-20 text-center space-y-4">
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
                className="premium-card group"
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

                   <div className="flex items-center gap-4 text-slate-400 font-bold text-xs">
                      <div className="flex items-center gap-1.5">
                         <Clock size={14} /> 15 min
                      </div>
                      <div className="flex items-center gap-1.5">
                         <Star size={14} className="text-yellow-500 fill-yellow-500" /> Essencial
                      </div>
                   </div>

                   <Link 
                    href={`/study/${lesson.id}`}
                    className="btn-primary w-full py-4 group-hover:shadow-blue-500/40"
                   >
                     Iniciar Missão
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
