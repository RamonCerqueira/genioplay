'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Users, 
  DollarSign, 
  ShieldAlert, 
  MessageSquare, 
  TrendingUp, 
  Search, 
  UserMinus, 
  UserCheck, 
  Settings, 
  Loader2, 
  Ghost,
  CheckCircle2,
  Inbox,
  Clock,
  Send,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotify } from '@/components/ui/NotificationSystem';

function AdminMasterContent() {
  const notify = useNotify();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as 'users' | 'support' | 'finance' | 'settings';
  
  const [activeTab, setActiveTab] = useState<'users' | 'support' | 'finance' | 'settings'>(tabParam || 'users');
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState({
    mrr: 0,
    activeSubs: 0,
    churnRate: '0%',
    pendingRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

  useEffect(() => {
    fetchMasterData();
    fetchTickets();
  }, []);

  const fetchMasterData = async () => {
    try {
      const res = await fetch('/api/admin/master-data');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setStats(data.stats || { mrr: 0, activeSubs: 0, churnRate: '0%', pendingRequests: 0 });
      }
    } catch (err) {
      console.error('Fetch master error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/admin/support');
      const data = await res.json();
      if (data.success) setTickets(data.tickets || []);
    } catch (err) {
      console.error('Fetch tickets error');
    }
  };

  const handleToggleUserStatus = async (userId: string, isBlocked: boolean) => {
     try {
        const res = await fetch(`/api/admin/users/${userId}/toggle-status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isBlocked: !isBlocked })
        });
        if (res.ok) {
           notify({
             title: isBlocked ? 'Acesso Liberado' : 'Usuário Bloqueado',
             message: `O status do usuário foi atualizado com sucesso.`,
             type: 'SUCCESS',
             duration: 4000
           });
           fetchMasterData();
        }
     } catch (err) {
        notify({ title: 'Erro', message: 'Falha ao atualizar status', type: 'WARNING' });
     }
  };

  const handleReplyTicket = async () => {
     if (!replyText || !selectedTicket) return;
     setSubmittingReply(true);
     try {
        const res = await fetch(`/api/admin/support/${selectedTicket.id}`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ text: replyText, status: 'IN_PROGRESS' })
        });
        if (res.ok) {
           notify({ title: 'Resposta Enviada', message: 'O pai receberá sua mensagem no e-mail.', type: 'SUCCESS' });
           setReplyText('');
           setSelectedTicket(null);
           fetchTickets();
        }
     } catch (err) {
        notify({ title: 'Erro', message: 'Falha ao enviar resposta', type: 'WARNING' });
     } finally {
        setSubmittingReply(false);
     }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header Master */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
            AdmMaster <span className="text-blue-500">GênioPlay</span>
          </h1>
          <p className="text-slate-400 font-bold mt-2">Gestão de Operações e Suporte</p>
        </div>

        <div className="flex gap-4">
           <div className="bg-slate-800 p-1 rounded-2xl border border-slate-700 flex">
              <button 
                onClick={() => setActiveTab('users')}
                className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
              >
                 Comunidade
              </button>
              <button 
                onClick={() => setActiveTab('support')}
                className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${activeTab === 'support' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
              >
                 Suporte
                 {tickets.filter(t => t.status === 'OPEN').length > 0 && (
                   <span className="w-4 h-4 bg-rose-500 text-[10px] flex items-center justify-center rounded-full text-white animate-pulse">
                      {tickets.filter(t => t.status === 'OPEN').length}
                   </span>
                 )}
              </button>
           </div>
        </div>
      </div>

      {/* Financeiro / KPIs */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'MRR (Recorrência)', value: `R$ ${stats.mrr.toLocaleString()}`, icon: <DollarSign />, color: 'text-emerald-500' },
          { label: 'Assinantes Ativos', value: stats.activeSubs, icon: <Users />, color: 'text-blue-500' },
          { label: 'Taxa de Churn', value: stats.churnRate, icon: <TrendingUp />, color: 'text-orange-500' },
          { label: 'Tickets Pendentes', value: tickets.filter(t => t.status === 'OPEN').length, icon: <MessageSquare />, color: 'text-purple-500' },
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

      <AnimatePresence mode="wait">
        {activeTab === 'users' ? (
          <motion.div 
            key="users-tab"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid lg:grid-cols-3 gap-10"
          >
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
                      placeholder="Buscar por e-mail ou nome..." 
                      className="bg-slate-800 border-none rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
               </div>

               <div className="bg-slate-800/30 rounded-[2.5rem] border border-slate-700/50 overflow-hidden min-h-[400px] flex flex-col">
                  {loading ? (
                     <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="animate-spin text-blue-500" size={40} />
                        <p className="text-slate-500 font-bold">Carregando...</p>
                     </div>
                  ) : filteredUsers.length === 0 ? (
                     <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                        <Ghost size={40} className="text-slate-700" />
                        <h3 className="text-xl font-black">Nenhum usuário</h3>
                     </div>
                  ) : (
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
                          {filteredUsers.map(u => (
                            <tr key={u.id} className="hover:bg-slate-700/10 transition-colors group">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-black uppercase">{u.username[0]}</div>
                                    <div>
                                       <p className="font-black">{u.username}</p>
                                       <p className="text-xs text-slate-500">{u.email}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <span className="bg-blue-500/10 text-blue-500 text-[10px] font-black px-3 py-1 rounded-full uppercase">{u.role}</span>
                              </td>
                              <td className="px-8 py-6">
                                 <div className={`flex items-center gap-2 text-sm font-bold ${u.isBlocked ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    <div className={`w-2 h-2 rounded-full ${u.isBlocked ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
                                    {u.isBlocked ? 'Bloqueado' : 'Ativo'}
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <button onClick={() => handleToggleUserStatus(u.id, u.isBlocked)} className="text-slate-500 hover:text-rose-500 transition-colors">
                                   {u.isBlocked ? <UserCheck size={20} /> : <UserMinus size={20} />}
                                 </button>
                              </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  )}
               </div>
            </div>

            <div className="space-y-6">
               <h2 className="text-xl font-black flex items-center gap-2 text-emerald-500 pt-4">
                 <DollarSign /> Configuração PIX
               </h2>
               <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-700/50 space-y-4">
                  <input type="text" placeholder="Chave PIX" className="w-full bg-slate-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500" />
                  <button className="bg-emerald-600 hover:bg-emerald-700 w-full py-4 rounded-2xl font-black text-sm">Salvar</button>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="support-tab"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid lg:grid-cols-12 gap-10"
          >
            <div className="lg:col-span-4 space-y-6">
               <h2 className="text-xl font-black flex items-center gap-2"><Inbox className="text-blue-500" /> Inbox</h2>
               <div className="bg-slate-800/30 rounded-[2.5rem] border border-slate-700/50 overflow-hidden min-h-[500px]">
                  {tickets.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-4">
                        <Ghost size={40} className="text-slate-700" />
                        <p className="text-slate-500 font-bold">Vazio.</p>
                     </div>
                  ) : (
                    <div className="divide-y divide-slate-700/30">
                       {tickets.map(ticket => (
                         <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className={`p-6 cursor-pointer ${selectedTicket?.id === ticket.id ? 'bg-blue-600/10 border-l-4 border-blue-600' : 'hover:bg-slate-800/50 border-l-4 border-transparent'}`}>
                            <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase">{ticket.ticketNumber}</span>
                            <h4 className="font-black text-sm truncate mt-2">{ticket.subject}</h4>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </div>

            <div className="lg:col-span-8">
               {selectedTicket ? (
                  <div className="bg-slate-800/30 rounded-[2.5rem] border border-slate-700/50 overflow-hidden flex flex-col h-[600px]">
                     <div className="bg-slate-800/50 p-6 border-b border-slate-700 flex justify-between items-center">
                        <h3 className="font-black text-xl">{selectedTicket.ticketNumber}: {selectedTicket.subject}</h3>
                        <button onClick={() => setSelectedTicket(null)} className="text-slate-500">Fechar</button>
                     </div>
                     <div className="flex-1 p-8 overflow-y-auto space-y-4">
                        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 max-w-[80%]">
                           <p className="text-sm">{selectedTicket.messages[0].text}</p>
                        </div>
                     </div>
                     <div className="p-6 bg-slate-800/50 border-t border-slate-700">
                        <textarea 
                          className="w-full bg-slate-900 border-none rounded-2xl p-6 text-sm min-h-[100px]" 
                          placeholder="Resposta..." 
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                        />
                        <button onClick={handleReplyTicket} disabled={submittingReply} className="mt-4 bg-blue-600 px-6 py-3 rounded-xl font-black text-sm w-full">Enviar</button>
                     </div>
                  </div>
               ) : (
                  <div className="h-full bg-slate-800/20 rounded-[2.5rem] border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-center p-12">
                     <MessageSquare size={40} className="text-slate-700" />
                     <p className="text-slate-500 font-bold mt-4">Selecione um chamado.</p>
                  </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdmMasterDashboard() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-black">Carregando Painel Master...</div>}>
      <AdminMasterContent />
    </Suspense>
  );
}
