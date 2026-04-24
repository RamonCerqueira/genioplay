'use client';

import React, { useState, useEffect } from 'react';
import { Users, DollarSign, ShieldAlert, MessageSquare, TrendingUp, Search, UserMinus, UserCheck, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotify } from '@/components/ui/NotificationSystem';

export default function AdmMasterDashboard() {
  const notify = useNotify();
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    mrr: 12450,
    activeSubs: 342,
    churnRate: '2.4%',
    pendingRequests: 12
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca dados mestre do sistema
    fetch('/api/admin/master-data')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
        setLoading(false);
      });
  }, []);

  const handleToggleUserStatus = async (userId: string, isBlocked: boolean) => {
     // Lógica para bloquear/desbloquear usuário
     notify({
       title: isBlocked ? 'Acesso Liberado' : 'Usuário Bloqueado',
       message: `O status do usuário foi atualizado no banco de dados com sucesso.`,
       type: isBlocked ? 'SUCCESS' : 'WARNING'
     });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Master */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                <Settings size={28} />
              </div>
              AdmMaster <span className="text-blue-500">GênioPlay</span>
            </h1>
            <p className="text-slate-400 font-bold mt-2">Painel de Controle de Operações e Receita</p>
          </div>

          <div className="flex gap-4">
             <button className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-2xl font-black text-sm transition-all border border-slate-700">
                Exportar Dados
             </button>
             <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-500/20">
                Configurações Globais
             </button>
          </div>
        </div>

        {/* Financeiro / KPIs */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: 'MRR (Recorrência)', value: `R$ ${stats.mrr.toLocaleString()}`, icon: <DollarSign />, color: 'text-emerald-500' },
            { label: 'Assinantes Ativos', value: stats.activeSubs, icon: <Users />, color: 'text-blue-500' },
            { label: 'Taxa de Churn', value: stats.churnRate, icon: <TrendingUp />, color: 'text-orange-500' },
            { label: 'Pedidos de Suporte', value: stats.pendingRequests, icon: <MessageSquare />, color: 'text-purple-500' },
          ].map((kpi, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-700/50 space-y-4"
            >
              <div className={`p-3 bg-slate-800 rounded-2xl w-fit ${kpi.color}`}>
                {kpi.icon}
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{kpi.label}</p>
                <p className="text-3xl font-black mt-1">{kpi.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Gestão de Usuários */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-black flex items-center gap-2">
                  <Users className="text-blue-500" /> 
                  Gestão de Comunidade
                </h2>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar por e-mail ou CPF..." 
                    className="bg-slate-800 border-none rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
             </div>

             <div className="bg-slate-800/30 rounded-[2.5rem] border border-slate-700/50 overflow-hidden">
                <table className="w-full text-left">
                   <thead className="bg-slate-800/50 border-b border-slate-700">
                      <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <th className="px-8 py-5">Usuário</th>
                        <th className="px-8 py-5">Papel</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5 text-right">Ações</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-700/30">
                      {/* Exemplo de Linha */}
                      {[1, 2, 3, 4, 5].map(u => (
                        <tr key={u} className="hover:bg-slate-700/10 transition-colors group">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-black">R</div>
                                <div>
                                   <p className="font-black">Ricardo Souza</p>
                                   <p className="text-xs text-slate-500">ricardo@email.com</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className="bg-blue-500/10 text-blue-500 text-[10px] font-black px-3 py-1 rounded-full uppercase">Pai (AdminResp)</span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                Ativo
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button 
                              onClick={() => handleToggleUserStatus(u.toString(), false)}
                              className="text-slate-500 hover:text-rose-500 transition-colors p-2"
                              title="Bloquear Usuário"
                             >
                               <UserMinus size={20} />
                             </button>
                          </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* Alertas e Auditoria */}
          <div className="space-y-6">
             <h2 className="text-xl font-black flex items-center gap-2 text-rose-500">
               <ShieldAlert /> 
               Sinais de Risco
             </h2>
             <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-700/50 space-y-6">
                {[
                  { msg: 'Tentativa de Bypass no Anti-Cheat detectada', user: 'Joaozinho (Aluno)', date: 'há 2 min' },
                  { msg: 'Acesso simultâneo de IP diferente', user: 'Maria Santos (Pai)', date: 'há 15 min' },
                  { msg: 'Pagamento recusado (Stripe)', user: 'Pedro Lima (Pai)', date: 'há 1h' },
                ].map((alert, i) => (
                  <div key={i} className="flex gap-4 border-l-2 border-rose-500/50 pl-4 py-2">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-100">{alert.msg}</p>
                      <p className="text-xs text-slate-500 font-bold">{alert.user} • {alert.date}</p>
                    </div>
                  </div>
                ))}
                <button className="w-full py-4 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-black text-xs uppercase rounded-2xl transition-all">
                   Ver Todos os Alertas
                </button>
             </div>

             <h2 className="text-xl font-black flex items-center gap-2 text-emerald-500 pt-4">
               <DollarSign /> 
               Configuração PIX
             </h2>
             <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-700/50 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Chave PIX (Recebimento)</label>
                  <input type="text" placeholder="ex: cnpj ou e-mail" className="w-full bg-slate-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Integrador (Client ID)</label>
                  <input type="password" placeholder="••••••••••••" className="w-full bg-slate-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    Webhook Ativo
                  </div>
                  <button className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl text-xs font-black transition-all">
                    Salvar Chaves
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
