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
  ArrowRight,
  ShieldOff,
  ZapOff,
  CreditCard,
  Key,
  Database,
  Globe,
  BrainCircuit
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
  const [config, setConfig] = useState({
    paymentGateway: 'MERCADO_PAGO',
    mpAccessToken: '',
    mpPublicKey: '',
    stripeSecretKey: '',
    stripePublicKey: '',
    geminiApiKey: ''
  });
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
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
    fetchConfig();
  }, []);

  const fetchMasterData = async () => {
    try {
      const res = await fetch('/api/admin/master-data');
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
        setStats(data.stats);
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

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/config');
      const data = await res.json();
      if (data.success) setConfig(data.config);
    } catch (err) {
      console.error('Fetch config error');
    }
  };

  const handleSaveConfig = async () => {
     setSavingConfig(true);
     try {
        const res = await fetch('/api/admin/config', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(config)
        });
        if (res.ok) {
           notify({ title: 'Configuração Salva', message: 'As chaves de integração foram atualizadas.', type: 'SUCCESS' });
        }
     } catch (err) {
        notify({ title: 'Erro', message: 'Falha ao salvar configuração', type: 'WARNING' });
     } finally {
        setSavingConfig(false);
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
             type: 'SUCCESS'
           });
           fetchMasterData();
        }
     } catch (err) {
        notify({ title: 'Erro', message: 'Falha ao atualizar status', type: 'WARNING' });
     }
  };

  const handleDowngradeUser = async (userId: string) => {
     if (!confirm('Deseja realmente reduzir este usuário para o plano FREE?')) return;
     try {
        const res = await fetch(`/api/admin/users/${userId}/change-plan`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ status: 'FREE' })
        });
        if (res.ok) {
           notify({ title: 'Plano Alterado', message: 'Usuário agora está no plano FREE.', type: 'SUCCESS' });
           fetchMasterData();
        }
     } catch (err) {
        notify({ title: 'Erro', message: 'Falha ao alterar plano', type: 'WARNING' });
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
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 text-slate-800 dark:text-white">
            AdmMaster <span className="text-blue-500">GênioPlay</span>
          </h1>
          <p className="text-slate-400 font-bold mt-2">Gestão de Operações e Suporte</p>
        </div>

        <div className="flex gap-4">
           <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700 flex shadow-sm">
              {[
                { id: 'users', label: 'Usuários', icon: <Users size={16} /> },
                { id: 'support', label: 'Suporte', icon: <MessageSquare size={16} /> },
                { id: 'finance', label: 'Financeiro', icon: <DollarSign size={16} /> },
                { id: 'settings', label: 'Integração', icon: <Settings size={16} /> },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
                >
                   {tab.icon}
                   <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Financeiro / KPIs - Sempre visível para contexto */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'MRR (Faturamento)', value: `R$ ${stats.mrr.toLocaleString()}`, icon: <DollarSign />, color: 'text-emerald-500' },
          { label: 'Assinantes Ativos', value: stats.activeSubs, icon: <Users />, color: 'text-blue-500' },
          { label: 'Gateway Ativo', value: config.paymentGateway, icon: <Globe />, color: 'text-orange-500' },
          { label: 'Pendências', value: tickets.filter(t => t.status === 'OPEN').length, icon: <MessageSquare />, color: 'text-purple-500' },
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className={`p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl w-fit ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-3xl font-black mt-1 text-slate-800 dark:text-white">{kpi.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'users' && (
          <motion.div 
            key="users-tab"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-black flex items-center gap-2 text-slate-800 dark:text-white">
                  <Users className="text-blue-500" /> 
                  Base de Clientes
                </h2>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar por e-mail ou nome..." 
                    className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 w-64 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
             </div>

             <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[400px] flex flex-col shadow-sm">
                {loading ? (
                   <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                      <Loader2 className="animate-spin text-blue-500" size={40} />
                      <p className="text-slate-500 font-bold">Sincronizando banco de dados...</p>
                   </div>
                ) : filteredUsers.length === 0 ? (
                   <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                      <Ghost size={40} className="text-slate-300 dark:text-slate-700" />
                      <h3 className="text-xl font-black text-slate-400">Vazio por aqui.</h3>
                   </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="px-8 py-5">Usuário</th>
                            <th className="px-8 py-5">Assinatura</th>
                            <th className="px-8 py-5">Acesso</th>
                            <th className="px-8 py-5 text-right">Ações</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {filteredUsers.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black uppercase text-sm">{u.username[0]}</div>
                                    <div>
                                       <p className="font-black text-slate-800 dark:text-white">{u.username}</p>
                                       <p className="text-xs text-slate-400 font-bold">{u.email}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.subscription?.status === 'PREMIUM' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {u.subscription?.status === 'PREMIUM' ? 'Pro' : 'Free'}
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className={`flex items-center gap-2 text-xs font-bold ${u.isBlocked ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${u.isBlocked ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
                                    {u.isBlocked ? 'Suspenso' : 'Liberado'}
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <div className="flex justify-end gap-2">
                                    {u.subscription?.status === 'PREMIUM' && (
                                       <button onClick={() => handleDowngradeUser(u.id)} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-orange-500 transition-colors" title="Downgrade para FREE">
                                          <ZapOff size={16} />
                                       </button>
                                    )}
                                    <button onClick={() => handleToggleUserStatus(u.id, u.isBlocked)} className={`p-2.5 rounded-xl transition-colors ${u.isBlocked ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white' : 'bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white'}`} title={u.isBlocked ? 'Ativar' : 'Bloquear'}>
                                       {u.isBlocked ? <UserCheck size={16} /> : <ShieldOff size={16} />}
                                    </button>
                                 </div>
                              </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
                )}
             </div>
          </motion.div>
        )}

        {activeTab === 'support' && (
          <motion.div 
            key="support-tab"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid lg:grid-cols-12 gap-10"
          >
            <div className="lg:col-span-4 space-y-6">
               <h2 className="text-xl font-black flex items-center gap-2 text-slate-800 dark:text-white"><Inbox className="text-blue-500" /> Chamados</h2>
               <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden h-[500px] shadow-sm">
                  {tickets.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-4 text-slate-300">
                        <MessageSquare size={40} />
                        <p className="font-bold">Nenhum ticket aberto.</p>
                     </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto h-full">
                       {tickets.map(ticket => (
                         <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className={`p-6 cursor-pointer transition-all ${selectedTicket?.id === ticket.id ? 'bg-blue-600/5 border-l-4 border-blue-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-transparent'}`}>
                            <div className="flex items-center justify-between mb-2">
                               <span className="text-[9px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase">{ticket.ticketNumber}</span>
                               <span className="text-[10px] text-slate-400 font-bold">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h4 className="font-black text-sm text-slate-800 dark:text-white truncate">{ticket.subject}</h4>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </div>

            <div className="lg:col-span-8">
               {selectedTicket ? (
                  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col h-[500px] shadow-sm">
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-black text-lg text-slate-800 dark:text-white">{selectedTicket.ticketNumber}: {selectedTicket.subject}</h3>
                        <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600">Fechar</button>
                     </div>
                     <div className="flex-1 p-8 overflow-y-auto">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 max-w-[85%]">
                           <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{selectedTicket.messages[0].text}</p>
                        </div>
                     </div>
                     <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                        <input 
                          className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-600" 
                          placeholder="Digite sua resposta aqui..." 
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                        />
                        <button onClick={handleReplyTicket} disabled={submittingReply} className="bg-blue-600 text-white px-8 rounded-xl font-black text-sm hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50">
                           {submittingReply ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                        </button>
                     </div>
                  </div>
               ) : (
                  <div className="h-full bg-slate-50/50 dark:bg-slate-900/10 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-12 text-slate-300">
                     <MessageSquare size={60} strokeWidth={1} />
                     <p className="text-slate-400 font-bold mt-4">Selecione uma conversa para começar.</p>
                  </div>
               )}
            </div>
          </motion.div>
        )}

        {activeTab === 'finance' && (
           <motion.div 
             key="finance-tab"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="grid lg:grid-cols-12 gap-8"
           >
              <div className="lg:col-span-8 space-y-6">
                 <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2"><TrendingUp className="text-emerald-500" /> Fluxo de Caixa</h2>
                 <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 min-h-[400px] shadow-sm flex flex-col items-center justify-center text-center">
                    <TrendingUp size={60} className="text-slate-200 mb-6" />
                    <h3 className="text-2xl font-black text-slate-400">Gráficos de Faturamento</h3>
                    <p className="text-slate-500 font-medium max-w-sm mt-2">Esta seção exibirá seu MRR e Churn de forma visual assim que as primeiras assinaturas forem processadas.</p>
                 </div>
              </div>
              <div className="lg:col-span-4 space-y-6">
                 <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2"><CreditCard className="text-blue-500" /> Atividade</h2>
                 <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo no Gateway</p>
                       <p className="text-4xl font-black text-slate-800 dark:text-white">R$ {stats.mrr.toLocaleString()}</p>
                       <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[65%]" />
                       </div>
                    </div>
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                       <p className="text-xs font-bold text-slate-500 italic">"O crescimento do GênioPlay depende da retenção dos pais. Mantenha o suporte ativo!"</p>
                    </div>
                 </div>
              </div>
           </motion.div>
        )}

        {activeTab === 'settings' && (
           <motion.div 
             key="settings-tab"
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl p-10 lg:p-16 space-y-12"
           >
              <div className="text-center space-y-4">
                 <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20">
                    <Key size={32} />
                 </div>
                 <h2 className="text-3xl font-black text-slate-800 dark:text-white">Integração Financeira</h2>
                 <p className="text-slate-500 font-bold">Configure onde o dinheiro do GênioPlay deve cair.</p>
              </div>

              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Gateway de Pagamento Ativo</label>
                    <select 
                      value={config.paymentGateway}
                      onChange={(e) => setConfig({...config, paymentGateway: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 font-black text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                       <option value="MERCADO_PAGO">Mercado Pago (Brasil - PIX/Cartão)</option>
                       <option value="STRIPE">Stripe (Global - Cartão de Crédito)</option>
                    </select>
                 </div>

                 <AnimatePresence mode="wait">
                    {config.paymentGateway === 'MERCADO_PAGO' ? (
                       <motion.div 
                         key="mp"
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         className="space-y-6"
                       >
                          <div className="space-y-3">
                             <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Access Token (Mercado Pago)</label>
                             <input 
                               type="password" 
                               value={config.mpAccessToken}
                               onChange={(e) => setConfig({...config, mpAccessToken: e.target.value})}
                               className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                               placeholder="APP_USR-..."
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Public Key</label>
                             <input 
                               type="text" 
                               value={config.mpPublicKey}
                               onChange={(e) => setConfig({...config, mpPublicKey: e.target.value})}
                               className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                               placeholder="APP_USR-..."
                             />
                          </div>
                       </motion.div>
                    ) : (
                       <motion.div 
                         key="stripe"
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         className="space-y-6"
                       >
                          <div className="space-y-3">
                             <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Secret Key (Stripe)</label>
                             <input 
                               type="password" 
                               value={config.stripeSecretKey}
                               onChange={(e) => setConfig({...config, stripeSecretKey: e.target.value})}
                               className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                               placeholder="sk_live_..."
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Public Key</label>
                             <input 
                               type="text" 
                               value={config.stripePublicKey}
                               onChange={(e) => setConfig({...config, stripePublicKey: e.target.value})}
                               className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                               placeholder="pk_live_..."
                             />
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>

                 {/* IA Configuration */}
                 <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
                    <div className="flex items-center gap-3 text-blue-600">
                       <BrainCircuit size={20} />
                       <h3 className="font-black uppercase text-xs tracking-widest">Inteligência Artificial (Gemini)</h3>
                    </div>
                    <div className="space-y-3">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Google Gemini API Key</label>
                       <div className="relative">
                          <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="password" 
                            value={config.geminiApiKey}
                            onChange={(e) => setConfig({...config, geminiApiKey: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                            placeholder="Digite sua chave do Google Gemini..."
                          />
                       </div>
                       <p className="text-[10px] text-slate-400 font-bold italic">Esta chave é usada para gerar as lições BNCC e o Chat do Tutor.</p>
                    </div>
                 </div>

                 <button 
                   onClick={handleSaveConfig}
                   disabled={savingConfig}
                   className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                    {savingConfig ? <Loader2 className="animate-spin" /> : <Database size={20} />}
                    Salvar Integração
                 </button>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdmMasterDashboard() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-black text-slate-500">Sincronizando com o Servidor Master...</div>}>
      <AdminMasterContent />
    </Suspense>
  );
}
