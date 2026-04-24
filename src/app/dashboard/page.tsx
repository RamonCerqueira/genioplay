'use client';

import React, { useState, useEffect } from 'react';
import { Users, Brain, ShieldAlert, TrendingUp, PlusCircle, LayoutDashboard, ChevronRight, GraduationCap, Star, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function GuardianDashboard() {
  const [children, setChildren] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalLessons: 0,
    averageScore: 0,
    subscriptionStatus: 'FREE'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/guardian/dashboard-data')
      .then(res => {
        if (res.status === 401) {
          window.location.href = '/auth/login';
          return;
        }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        
        // Se o usuário for um estudante, redireciona para a visão dele
        if (data.role === 'STUDENT') {
          window.location.href = '/dashboard/student';
          return;
        }

        setChildren(data.children || []);
        setAlerts(data.alerts || []);
        setStats(data.stats);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* Welcome & Quick Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-800 dark:text-white">Seu Painel <span className="text-gradient-blue">GênioPlay</span></h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 text-lg">Acompanhe e direcione o futuro dos seus filhos.</p>
            </div>

            <Link 
              href="/dashboard/generator"
              className="btn-primary py-4 px-8 shadow-xl shadow-blue-500/20 flex items-center gap-2"
            >
              <PlusCircle size={20} /> Atribuir Novo Assunto
            </Link>
          </div>

          {/* KPI Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="premium-card p-8 bg-gradient-to-br from-blue-700 to-indigo-900 text-white border-none shadow-2xl shadow-blue-500/30 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Brain size={120} />
               </div>
               <div className="relative z-10">
                 <div className="flex justify-between items-center mb-8">
                    <span className="text-[11px] font-black uppercase tracking-widest bg-white text-blue-900 px-4 py-1.5 rounded-full shadow-lg">Plano {stats.subscriptionStatus === 'PREMIUM' ? 'Pro' : 'Free'}</span>
                    <TrendingUp size={24} className="text-white/60" />
                 </div>
                 <h3 className="text-6xl font-black mb-1 drop-shadow-md">{stats.totalLessons}</h3>
                 <p className="text-sm font-black text-white/90 tracking-wide uppercase">Lições Realizadas</p>
               </div>
            </div>

            <div className="premium-card p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl relative">
               <div className="flex justify-between items-center mb-8">
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-xl">
                    <Star className="text-amber-500" size={24} fill="currentColor" />
                  </div>
                  <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Média Geral</span>
               </div>
               <h3 className="text-6xl font-black text-slate-900 dark:text-white mb-1">{stats.averageScore}%</h3>
               <p className="text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-wide">Desempenho Global</p>
            </div>

            <div className="premium-card p-8 bg-white dark:bg-slate-900 border-dashed border-2 border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-6 group hover:border-blue-400 transition-colors">
               <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LayoutDashboard className="text-blue-600" size={32} />
               </div>
               <div>
                  <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">Upgrade para Pro</p>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">Libere filhos ilimitados e o Anti-Cheat do GênioPlay.</p>
               </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Children Grid */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                  <Users className="text-blue-600" size={28} /> Seus Filhos
                </h2>
                <button 
                  onClick={() => window.location.href = '/dashboard/family'}
                  className="text-sm font-black text-blue-600 hover:underline flex items-center gap-2"
                >
                  <PlusCircle size={16} /> Adicionar Filho
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {loading ? (
                  [1, 2].map(i => <div key={i} className="h-44 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] animate-pulse border border-slate-100 dark:border-slate-800" />)
                ) : children.length === 0 ? (
                  <div className="col-span-2 premium-card p-12 bg-white dark:bg-slate-900 border-dashed border-2 flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600">
                       <GraduationCap size={40} />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-black text-slate-800 dark:text-white">Nenhum filho cadastrado</h3>
                       <p className="text-sm font-bold text-slate-500 max-w-sm mx-auto">
                         Comece agora cadastrando seus filhos para que eles possam entrar no GênioPlay e aprender brincando.
                       </p>
                    </div>
                    <button 
                      onClick={() => window.location.href = '/dashboard/family'}
                      className="btn-primary px-8 py-3.5"
                    >
                      Cadastrar Primeiro Filho
                    </button>
                  </div>
                ) : (
                  children.map(child => (
                    <Link key={child.id} href={`/dashboard/reports?studentId=${child.id}`}>
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="premium-card p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-3xl shadow-inner border border-blue-100 dark:border-blue-800">
                            {child.avatar || '🎓'}
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{child.username}</h3>
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Ver progresso detalhado</p>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <ChevronRight size={20} />
                        </div>
                      </motion.div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Alerts Sidebar */}
            <div className="space-y-8">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                <ShieldAlert className="text-rose-600" size={28} /> Alertas de Foco
              </h2>

              <div className="premium-card p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
                {alerts.length === 0 ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
                       <CheckCircle2 size={32} />
                    </div>
                    <p className="text-sm font-black text-slate-600 dark:text-slate-400 max-w-[200px] mx-auto">Foco total! Nenhum alerta recente nos estudos.</p>
                  </div>
                ) : (
                  alerts.map((alert, i) => (
                    <div key={i} className="flex items-center gap-4 group bg-rose-50 dark:bg-rose-900/10 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/20">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-rose-600 shadow-sm">
                        <ShieldAlert size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{alert.student.username} perdeu o foco</p>
                        <p className="text-[10px] font-black text-rose-700 dark:text-rose-400 uppercase tracking-widest">{alert.type} • {new Date(alert.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))
                )}
                <Link 
                  href="/dashboard/reports" 
                  className="block text-center text-xs font-black text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors pt-4 border-t border-slate-100 dark:border-slate-800 uppercase tracking-widest"
                >
                  Ver histórico completo
                </Link>
              </div>
            </div>
          </div>
    </div>
  );
}
