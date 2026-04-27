'use client';

import React, { useState, useEffect } from 'react';
import { Users, Brain, ShieldAlert, TrendingUp, PlusCircle, LayoutDashboard, ChevronRight, GraduationCap, Star, CheckCircle2, X, Coins, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { GuardianAIInsights } from '@/components/dashboard/GuardianAIInsights';

export default function GuardianDashboard() {
  const [children, setChildren] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);
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
        fetchRedemptions();
        setLoading(false);
      });
  }, []);

  const fetchRedemptions = async () => {
    const res = await fetch('/api/guardian/redemptions');
    const data = await res.json();
    if (data.success) setRedemptions(data.redemptions);
  };

  const handleApprove = async (id: string, action: string) => {
    const res = await fetch('/api/guardian/redemptions', {
      method: 'POST',
      body: JSON.stringify({ redemptionId: id, action })
    });
    if (res.ok) fetchRedemptions();
  };

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

      {/* Referral Banner Premium */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-0 overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white border-none shadow-2xl shadow-blue-500/20 relative group mb-12"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform pointer-events-none">
           <Users size={160} />
        </div>
        <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
           <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-xl shrink-0">
                 <Star size={32} fill="currentColor" />
              </div>
              <div className="space-y-1">
                 <h2 className="text-3xl font-black uppercase tracking-tight leading-none mb-2">Indique e Ganhe Premium! 🚀</h2>
                 <p className="text-indigo-100 font-bold text-lg">Convide um amigo e ganhe <span className="text-white underline underline-offset-4 decoration-amber-400 decoration-4">15 dias de Plano Pro</span> por cada novo assinante!</p>
              </div>
           </div>
           
           <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
              <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Seu Código de Indicação</p>
              <div 
                onClick={() => {
                  navigator.clipboard.writeText(children[0]?.referralCode || 'GENIOPLAY-2024');
                  alert('Código copiado com sucesso! 🚀');
                }}
                className="bg-white/10 hover:bg-white/20 transition-all p-4 rounded-2xl border border-white/20 flex items-center gap-4 cursor-pointer group/code"
              >
                 <span className="text-2xl font-black tracking-[0.2em] font-mono">{children[0]?.referralCode?.slice(0, 8).toUpperCase() || 'GENIO24'}</span>
                 <div className="w-10 h-10 bg-white text-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover/code:scale-110 transition-transform">
                    <PlusCircle size={20} />
                 </div>
              </div>
           </div>
        </div>
      </motion.div>

      <GuardianAIInsights />

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
                <div key={child.id} className="premium-card bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col group">
                  <div className="p-6 flex items-center justify-between border-b border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-3xl shadow-inner border border-blue-100 dark:border-blue-800">
                        {child.avatar || '🎓'}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{child.username}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{child.gradeLevel}</p>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/reports?studentId=${child.id}`}
                      className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-all"
                    >
                      <TrendingUp size={20} />
                    </Link>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white shadow-md">
                          <Coins size={16} fill="currentColor" />
                        </div>
                        <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-tight">Moedas Gênio</span>
                      </div>
                      <span className="text-xl font-black text-slate-800 dark:text-white">{child.walletBalance}</span>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Missões Atribuídas</p>
                      <div className="space-y-2">
                        {child.recentLessons?.length > 0 ? child.recentLessons.map((lesson: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 overflow-hidden">
                              {lesson.completed ? (
                                <CheckCircle2 className="text-emerald-500 shrink-0" size={14} />
                              ) : (
                                <Clock className="text-amber-500 shrink-0" size={14} />
                              )}
                              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">{lesson.topic.name}</span>
                            </div>
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${lesson.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                              {lesson.completed ? 'Concluída' : 'Pendente'}
                            </span>
                          </div>
                        )) : (
                          <p className="text-[9px] font-bold text-slate-400 italic">Nenhuma lição atribuída ainda.</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Destaques por Matéria</p>
                      <div className="flex flex-wrap gap-1.5">
                        {child.topSkills?.length > 0 ? child.topSkills.map((skill: any, i: number) => (
                          <span key={i} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-[9px] font-bold text-slate-600 dark:text-slate-300">
                            {skill.subjectName} • {skill.elo}
                          </span>
                        )) : (
                          <span className="text-[9px] font-bold text-slate-400 italic">Nenhum progresso ainda</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/reports?studentId=${child.id}`}
                    className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-50 dark:border-slate-800 text-center text-[10px] font-black text-blue-600 hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest"
                  >
                    Ver Relatório Completo
                  </Link>
                </div>
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

          {/* Seção de Recompensas Pendentes */}
          <AnimatePresence>
            {redemptions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                  <Star className="text-amber-500" size={28} fill="currentColor" /> Prêmios para Entregar
                </h2>
                <div className="space-y-4">
                  {redemptions.map((r) => (
                    <div key={r.id} className="premium-card p-6 bg-amber-50/50 dark:bg-amber-900/10 border-amber-100/50 dark:border-amber-900/20">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-xl shadow-sm">
                            {r.student.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800 dark:text-white">{r.student.username} resgatou:</p>
                            <p className="text-xs font-bold text-blue-600 uppercase">{r.reward.title}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(r.id, 'APPROVED')}
                          className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          Marcar como Entregue
                        </button>
                        <button
                          onClick={() => handleApprove(r.id, 'REJECTED')}
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
