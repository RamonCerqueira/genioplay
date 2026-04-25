'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, Gift, User, Lock, Trash2, Plus, 
  CheckCircle2, Loader2, Save, CreditCard, 
  Bell, ShieldCheck, Mail, Smartphone,
  Zap, Crown, ChevronRight, X, Filter,
  Calendar, MapPin, Phone, Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotify } from '@/components/ui/NotificationSystem';

export default function SettingsPage() {
  const notify = useNotify();
  const [activeTab, setActiveTab] = useState<'profile' | 'rewards' | 'billing' | 'notifications'>('profile');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rewardCategory, setRewardCategory] = useState('Todos');
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  const [profile, setProfile] = useState({
    username: '',
    email: '',
    cpf: '',
    phone: '',
    birthDate: '',
    cep: '',
    address: '',
    city: '',
    state: ''
  });

  const [rewards, setRewards] = useState<any[]>([]);
  const [newReward, setNewReward] = useState({ title: '', cost: 100, description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/guardian/settings');
      const data = await res.json();
      if (data.success) {
        setProfile({
          ...data.profile,
          birthDate: data.profile.birthDate ? new Date(data.profile.birthDate).toISOString().split('T')[0] : ''
        });
        setRewards(data.rewards);
      }
    } catch (err) {
      console.error('Fetch error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/guardian/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.success) {
        notify({ title: 'Perfil Atualizado', message: 'Suas informações foram salvas com sucesso.', type: 'SUCCESS' });
      }
    } catch (err) {
      notify({ title: 'Erro', message: 'Falha na conexão', type: 'WARNING' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddReward = async (rewardToSave?: any) => {
    const rewardData = rewardToSave || newReward;
    setSubmitting(true);
    try {
      const res = await fetch('/api/guardian/rewards/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rewardData)
      });
      const data = await res.json();
      if (data.success) {
        setRewards([data.reward, ...rewards]);
        setNewReward({ title: '', cost: 100, description: '' });
        setIsRewardModalOpen(false);
        notify({ title: 'Sucesso!', message: 'Recompensa adicionada com sucesso.', type: 'SUCCESS' });
      }
    } catch (err) {
      notify({ title: 'Erro', message: 'Falha ao salvar recompensa', type: 'WARNING' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReward = async (id: string) => {
    try {
      const res = await fetch(`/api/guardian/rewards/delete?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRewards(rewards.filter(r => r.id !== id));
        notify({ title: 'Removida', message: 'Recompensa excluída.', type: 'INFO' });
      }
    } catch (err) {
      console.error('Delete error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      notify({ title: 'Erro', message: 'As senhas não coincidem', type: 'WARNING' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/guardian/profile/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.new
        })
      });
      const data = await res.json();
      if (data.success) {
        notify({ title: 'Senha Alterada', message: 'Sua senha foi atualizada com sucesso.', type: 'SUCCESS' });
        setIsPasswordModalOpen(false);
        setPasswordData({ current: '', new: '', confirm: '' });
      } else {
        notify({ title: 'Erro', message: data.error || 'Falha ao alterar senha', type: 'WARNING' });
      }
    } catch (err) {
      notify({ title: 'Erro', message: 'Erro de conexão', type: 'WARNING' });
    } finally {
      setSubmitting(false);
    }
  };

  const genioSuggestions = [
    { title: '30min de Videogame', cost: 150, category: 'Gamer' },
    { title: 'Escolher o Jantar', cost: 300, category: 'Lazer' },
    { title: 'Passeio no Parque', cost: 500, category: 'Lazer' },
    { title: 'Novo Skin/Item de Jogo', cost: 800, category: 'Gamer' },
    { title: 'Vale Cinema', cost: 1200, category: 'Especial' },
    { title: '1 Hora de YouTube', cost: 200, category: 'Gamer' },
    { title: 'Dormir na Casa de Amigo', cost: 1000, category: 'Especial' },
    { title: 'Escolher Próximo Livro', cost: 100, category: 'Estudos' }
  ];

  const filteredSuggestions = rewardCategory === 'Todos' 
    ? genioSuggestions 
    : genioSuggestions.filter(s => s.category === rewardCategory);

  const tabs = [
    { id: 'profile', label: 'Meu Perfil', icon: User },
    { id: 'rewards', label: 'Recompensas', icon: Gift },
    { id: 'billing', label: 'Assinatura', icon: Crown },
    { id: 'notifications', label: 'Notificações', icon: Bell },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-800 dark:text-white flex items-center gap-4">
          <Settings className="text-blue-600" size={40} /> Configurações
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">Gerencie sua conta e o sistema de incentivos.</p>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xl shadow-blue-500/5' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-8 space-y-8">
              <div className="premium-card p-10 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl">
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3">
                   <User className="text-blue-600" size={24} /> Informações do Cadastro
                </h3>
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" className="input-field pl-12" value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CPF</label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" className="input-field pl-12" placeholder="000.000.000-00" value={profile.cpf} onChange={e => setProfile({...profile, cpf: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp / Telefone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" className="input-field pl-12" placeholder="(00) 00000-0000" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data de Nascimento</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="date" className="input-field pl-12" value={profile.birthDate} onChange={e => setProfile({...profile, birthDate: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={14} /> Endereço de Cobrança</h4>
                    <div className="grid md:grid-cols-3 gap-6">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase">CEP</label>
                          <input type="text" className="input-field" placeholder="00000-000" value={profile.cep} onChange={e => setProfile({...profile, cep: e.target.value})} />
                       </div>
                       <div className="md:col-span-2 space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase">Logradouro</label>
                          <input type="text" className="input-field" placeholder="Rua, Número, Complemento" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase">Cidade</label>
                          <input type="text" className="input-field" value={profile.city} onChange={e => setProfile({...profile, city: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase">Estado</label>
                          <input type="text" className="input-field" value={profile.state} onChange={e => setProfile({...profile, state: e.target.value})} />
                       </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-50 dark:border-slate-800 flex justify-end">
                    <button type="submit" disabled={submitting} className="btn-primary px-12 py-4 shadow-xl shadow-blue-500/20 flex items-center gap-2">
                      {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                      Salvar Cadastro
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
               <div className="premium-card p-10 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 space-y-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                       <ShieldCheck size={32} />
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-xl font-black">Segurança Pro</h4>
                       <p className="text-slate-400 text-sm font-bold">Seus dados estão protegidos com criptografia de nível bancário.</p>
                    </div>
                    <button 
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-sm transition-all border border-white/10"
                    >
                      Alterar Senha
                    </button>
                  </div>
                  <Lock className="absolute -right-8 -bottom-8 text-white/5" size={200} />
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'rewards' && (
          <motion.div 
            key="rewards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            {/* Sugestões do Gênio Horizontal */}
            <div className="space-y-6">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                     <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                        Sugestões do Gênio <Zap className="text-amber-500" size={24} />
                     </h3>
                     <p className="text-slate-500 font-bold">Ideias testadas por especialistas para motivar seu filho.</p>
                  </div>
                  <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto w-full md:w-fit">
                     {['Todos', 'Gamer', 'Lazer', 'Estudos', 'Especial'].map(cat => (
                        <button 
                           key={cat}
                           onClick={() => setRewardCategory(cat)}
                           className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${rewardCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                           {cat}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <AnimatePresence mode="popLayout">
                     {filteredSuggestions.slice(0, 4).map((sug, i) => (
                        <motion.div 
                           key={sug.title}
                           layout
                           initial={{ opacity: 0, scale: 0.9 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.9 }}
                           className="premium-card p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl group hover:border-blue-300 transition-all flex flex-col justify-between h-48"
                        >
                           <div>
                              <div className="flex justify-between items-center mb-3">
                                 <span className="text-[9px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded-md uppercase tracking-tighter">{sug.category}</span>
                                 <span className="text-sm font-black text-slate-800 dark:text-white">{sug.cost} 🪙</span>
                              </div>
                              <h4 className="font-black text-slate-700 dark:text-slate-200 line-clamp-2 leading-snug">{sug.title}</h4>
                           </div>
                           <button 
                              onClick={() => handleAddReward({ title: sug.title, cost: sug.cost, description: `Recompensa sugerida da categoria ${sug.category}` })}
                              className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm"
                           >
                              Usar Sugestão
                           </button>
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </div>
            </div>

            {/* Suas Recompensas */}
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white">Suas Recompensas</h3>
                  <button 
                     onClick={() => setIsRewardModalOpen(true)}
                     className="btn-primary py-3 px-6 flex items-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                     <Plus size={18} /> Nova Recompensa
                  </button>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rewards.length === 0 ? (
                    <div className="col-span-full p-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center gap-4">
                      <Gift className="text-slate-200 dark:text-slate-800" size={64} />
                      <p className="text-slate-400 font-bold">Nenhuma recompensa ativa.</p>
                    </div>
                  ) : (
                    rewards.map(reward => (
                      <motion.div 
                        key={reward.id}
                        layout
                        className="premium-card p-8 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl flex flex-col justify-between group hover:border-blue-200 transition-all"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:rotate-12 transition-transform">
                            <Gift size={28} />
                          </div>
                          <button 
                            onClick={() => handleDeleteReward(reward.id)}
                            className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xl font-black text-slate-800 dark:text-white">{reward.title}</h4>
                          <p className="text-sm font-bold text-slate-400 line-clamp-2">{reward.description}</p>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                           <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-blue-600">{reward.cost}</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">🪙 GCoins</span>
                           </div>
                           <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
                              Ativa
                           </div>
                        </div>
                      </motion.div>
                    ))
                  )}
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'billing' && (
          <motion.div 
            key="billing"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid md:grid-cols-3 gap-8"
          >
             <div className="md:col-span-2 space-y-8">
                <div className="premium-card p-10 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Crown size={120} className="text-amber-500" />
                   </div>
                   <div className="relative z-10">
                     <div className="inline-flex items-center gap-2 bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Plano Atual</div>
                     <h3 className="text-3xl font-black text-slate-800 dark:text-white">GênioPlay <span className="text-amber-500 italic underline">Premium Pro</span></h3>
                     <p className="text-slate-500 font-bold mt-2">Próxima renovação: <span className="text-slate-800 dark:text-white">12 de Maio, 2026</span></p>
                     
                     <div className="grid sm:grid-cols-2 gap-4 my-10">
                        {[
                          'Filhos Ilimitados',
                          'IA Adaptativa Ativada',
                          'Anti-Cheat Avançado',
                          'Relatórios Semanais'
                        ].map((feat, i) => (
                          <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                             <CheckCircle2 size={18} className="text-emerald-500" />
                             <span className="text-sm font-black text-slate-700 dark:text-slate-200">{feat}</span>
                          </div>
                        ))}
                     </div>

                     <div className="flex gap-4">
                        <button className="btn-primary px-10 py-4 bg-slate-800 hover:bg-slate-900 shadow-lg shadow-slate-900/10">Gerenciar Assinatura</button>
                        <button className="px-8 py-4 text-sm font-black text-slate-500 hover:text-blue-600 transition-colors">Histórico de Cobrança</button>
                     </div>
                   </div>
                </div>

                <div className="premium-card p-10 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl">
                   <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3">
                      <CreditCard size={24} className="text-blue-600" /> Cartão Registrado
                   </h3>
                   <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-inner">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center font-black text-xs text-slate-400 border border-slate-200 dark:border-slate-600 uppercase">Visa</div>
                         <div>
                            <p className="text-lg font-black text-slate-800 dark:text-white">•••• •••• •••• 4242</p>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Exp: 12/28</p>
                         </div>
                      </div>
                      <button className="text-sm font-black text-blue-600 hover:underline">Alterar Cartão</button>
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <div className="premium-card p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-2xl relative overflow-hidden group">
                   <div className="relative z-10">
                     <h4 className="text-xl font-black mb-4">Economize 20%</h4>
                     <p className="text-sm font-bold text-blue-100 mb-8 leading-relaxed">Mude para o faturamento anual e garanta as ferramentas de elite para seus filhos com desconto exclusivo.</p>
                     <button className="w-full py-4 bg-white text-blue-600 font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-transform">Quero o Plano Anual</button>
                   </div>
                   <Zap className="absolute -right-8 -bottom-8 text-white/10 group-hover:scale-110 transition-transform" size={180} />
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Recompensa */}
      <AnimatePresence>
        {isRewardModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRewardModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-3xl relative z-[101]">
               <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">Criar Prêmio</h2>
                  <button onClick={() => setIsRewardModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                     <X size={24} className="text-slate-400" />
                  </button>
               </div>
               <form onSubmit={(e) => { e.preventDefault(); handleAddReward(); }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título da Recompensa</label>
                    <input type="text" placeholder="Ex: Cinema com Pipoca" className="input-field" value={newReward.title} onChange={e => setNewReward({...newReward, title: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Custo (GênioCoins)</label>
                    <input type="number" placeholder="500" className="input-field" value={newReward.cost} onChange={e => setNewReward({...newReward, cost: parseInt(e.target.value)})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
                    <textarea placeholder="O que o filho ganha?" className="input-field min-h-[120px] resize-none" value={newReward.description} onChange={e => setNewReward({...newReward, description: e.target.value})} />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary w-full py-5 text-lg font-black shadow-xl shadow-blue-500/20">
                     {submitting ? <Loader2 className="animate-spin mx-auto" /> : 'Confirmar Recompensa'}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Modal de Alterar Senha */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPasswordModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-3xl relative z-[101]">
               <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">Alterar Senha</h2>
                  <button onClick={() => setIsPasswordModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                     <X size={24} className="text-slate-400" />
                  </button>
               </div>
               <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha Atual</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="password" placeholder="••••••••" className="input-field pl-12" value={passwordData.current} onChange={e => setPasswordData({...passwordData, current: e.target.value})} required />
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-slate-50 dark:border-slate-800">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nova Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="password" placeholder="Mínimo 6 caracteres" className="input-field pl-12" value={passwordData.new} onChange={e => setPasswordData({...passwordData, new: e.target.value})} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar Nova Senha</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="password" placeholder="Repita a nova senha" className="input-field pl-12" value={passwordData.confirm} onChange={e => setPasswordData({...passwordData, confirm: e.target.value})} required />
                    </div>
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary w-full py-5 text-lg font-black shadow-xl shadow-blue-500/20">
                     {submitting ? <Loader2 className="animate-spin mx-auto" /> : 'Atualizar Senha'}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
