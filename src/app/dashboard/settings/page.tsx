'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, Gift, User, Lock, Trash2, Plus, 
  CheckCircle2, Loader2, Save, CreditCard, 
  Bell, ShieldCheck, Mail, Smartphone,
  Zap, Crown, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'rewards' | 'billing' | 'notifications'>('profile');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profile, setProfile] = useState({
    username: '',
    email: '',
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
        setProfile(data.profile);
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
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao atualizar' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleAddReward = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/guardian/rewards/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReward)
      });
      const data = await res.json();
      if (data.success) {
        setRewards([...rewards, data.reward]);
        setNewReward({ title: '', cost: 100, description: '' });
        setMessage({ type: 'success', text: 'Recompensa adicionada!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDeleteReward = async (id: string) => {
    try {
      const res = await fetch(`/api/guardian/rewards/delete?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRewards(rewards.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Delete error');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Meu Perfil', icon: User },
    { id: 'rewards', label: 'Recompensas', icon: Gift },
    { id: 'billing', label: 'Assinatura', icon: Crown },
    { id: 'notifications', label: 'Notificações', icon: Bell },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-800 dark:text-white flex items-center gap-4">
          <Settings className="text-blue-600" size={40} /> Configurações
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">Personalize sua experiência e gerencie seus privilégios.</p>
      </div>

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
            className="grid md:grid-cols-3 gap-8"
          >
            <div className="md:col-span-2 space-y-8">
              <div className="premium-card p-10 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl">
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3">
                   <User className="text-blue-600" size={24} /> Informações Pessoais
                </h3>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nome de Responsável</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" 
                          className="input-field pl-12" 
                          value={profile.username}
                          onChange={e => setProfile({...profile, username: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Principal</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="email" 
                          className="input-field pl-12 opacity-60" 
                          value={profile.email}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                    <button type="submit" disabled={submitting} className="btn-primary px-10 flex items-center gap-2">
                      {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>

              <div className="premium-card p-10 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl">
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                  <Lock size={20} className="text-blue-600" /> Alterar Senha
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="password" placeholder="Nova Senha" className="input-field" />
                  <input type="password" placeholder="Confirmar Nova Senha" className="input-field" />
                </div>
                <button className="btn-primary mt-6 px-10 bg-slate-800 hover:bg-slate-900">Atualizar Senha</button>
              </div>
            </div>

            <div className="space-y-6">
               <div className="premium-card p-8 bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none shadow-xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <h4 className="text-lg font-black mb-2">Suporte Prioritário</h4>
                    <p className="text-sm font-bold text-blue-100 mb-6">Como assinante Pro, você tem acesso ao nosso chat 24h para suporte pedagógico e técnico.</p>
                    <button className="w-full py-4 bg-white text-blue-600 font-black rounded-2xl shadow-lg hover:scale-[1.02] transition-transform">Falar com Consultor</button>
                  </div>
                  <ShieldCheck className="absolute -right-8 -bottom-8 text-white/10" size={180} />
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'rewards' && (
          <motion.div 
            key="rewards"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid md:grid-cols-3 gap-12"
          >
            <div className="md:col-span-1 space-y-6">
              <div className="premium-card p-8 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl">
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Sugestões do Gênio 💡</h3>
                <div className="space-y-4">
                  {[
                    { title: '30min de Videogame', cost: 150, category: 'Gamer' },
                    { title: 'Escolher o Jantar', cost: 300, category: 'Lazer' },
                    { title: 'Passeio no Parque', cost: 500, category: 'Lazer' },
                    { title: 'Novo Skin/Item de Jogo', cost: 800, category: 'Gamer' },
                    { title: 'Vale Cinema', cost: 1200, category: 'Especial' }
                  ].map((sug, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group hover:border-blue-300 transition-all">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">{sug.category}</span>
                          <span className="text-xs font-black text-slate-800 dark:text-white">{sug.cost} 🪙</span>
                       </div>
                       <p className="text-sm font-black text-slate-700 dark:text-slate-200 mb-3">{sug.title}</p>
                       <button 
                        onClick={() => {
                          setNewReward({ title: sug.title, cost: sug.cost, description: `Recompensa sugerida da categoria ${sug.category}` });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full py-2 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                       >
                         Usar Sugestão
                       </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="premium-card p-8 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl">
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Nova Recompensa</h3>
                <form onSubmit={handleAddReward} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título do Prêmio</label>
                    <input 
                      type="text" 
                      placeholder="Ex: 30min de Videogame" 
                      className="input-field" 
                      value={newReward.title}
                      onChange={e => setNewReward({...newReward, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Custo (Moedas)</label>
                    <input 
                      type="number" 
                      placeholder="100" 
                      className="input-field" 
                      value={newReward.cost}
                      onChange={e => setNewReward({...newReward, cost: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição Curta</label>
                    <textarea 
                      placeholder="O que o filho precisa fazer para ganhar?" 
                      className="input-field min-h-[100px]"
                      value={newReward.description}
                      onChange={e => setNewReward({...newReward, description: e.target.value})}
                    />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                    Criar Recompensa
                  </button>
                </form>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                {rewards.length === 0 ? (
                  <div className="col-span-2 premium-card p-20 text-center border-dashed flex flex-col items-center gap-4">
                    <Gift className="text-slate-200" size={64} />
                    <p className="text-slate-400 font-bold">Nenhuma recompensa criada ainda.</p>
                  </div>
                ) : (
                  rewards.map(reward => (
                    <motion.div 
                      key={reward.id}
                      layout
                      className="premium-card p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-lg flex flex-col justify-between group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 font-black">
                          <Gift size={24} />
                        </div>
                        <button 
                          onClick={() => handleDeleteReward(reward.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">{reward.title}</h4>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{reward.description}</p>
                      </div>
                      <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                        <span className="text-xl font-black text-blue-600">{reward.cost} <span className="text-[10px] text-slate-400 uppercase tracking-widest">Moedas</span></span>
                        <div className={`badge ${reward.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {reward.isActive ? 'Ativa' : 'Inativa'}
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
                  <div className="absolute top-0 right-0 p-8">
                     <Crown size={80} className="text-amber-500/10" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Plano Atual: <span className="text-amber-500">GênioPlay Pro</span></h3>
                    <p className="text-slate-500 font-bold mb-8">Sua assinatura está ativa e renova em 12 de Maio, 2026.</p>
                    
                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                       {[
                         { label: 'Filhos Ilimitados', status: true },
                         { label: 'IA Personalizada', status: true },
                         { label: 'Anti-Cheat Ativado', status: true },
                         { label: 'Relatórios de Foco', status: true },
                       ].map((feat, i) => (
                         <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                            <CheckCircle2 size={18} className="text-emerald-500" />
                            <span className="text-sm font-black text-slate-700 dark:text-slate-200">{feat.label}</span>
                         </div>
                       ))}
                    </div>

                    <div className="flex gap-4">
                       <button className="btn-primary px-8 py-4 bg-slate-800 hover:bg-slate-900">Gerenciar Assinatura</button>
                       <button className="px-8 py-4 text-sm font-black text-slate-500 hover:text-slate-800 transition-colors">Ver Histórico</button>
                    </div>
                  </div>
               </div>

               <div className="premium-card p-10 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl">
                  <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                     <CreditCard size={24} className="text-blue-600" /> Método de Pagamento
                  </h3>
                  <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center font-black text-[10px] text-slate-500 uppercase">Visa</div>
                        <div>
                           <p className="text-sm font-black text-slate-800 dark:text-white">•••• •••• •••• 4242</p>
                           <p className="text-xs font-bold text-slate-500">Expira em 12/28</p>
                        </div>
                     </div>
                     <button className="text-xs font-black text-blue-600 hover:underline">Alterar</button>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="premium-card p-8 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30">
                  <h4 className="text-lg font-black text-blue-900 dark:text-blue-100 mb-2">Economize 20%</h4>
                  <p className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-6">Mude para o plano anual e garanta o futuro dos seus filhos com desconto exclusivo.</p>
                  <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20">Mudar para Anual</button>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div 
            key="notifications"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="max-w-2xl mx-auto space-y-6"
          >
             <div className="premium-card p-10 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3">
                   <Bell size={28} className="text-blue-600" /> Preferências de Alerta
                </h3>

                <div className="space-y-8">
                   {[
                     { title: 'Alertas de Perda de Foco', desc: 'Receba uma notificação imediata se seu filho sair da tela de estudo.', icon: Zap },
                     { title: 'Boletim Semanal por E-mail', desc: 'Resumo detalhado do desempenho de todos os filhos toda segunda-feira.', icon: Mail },
                     { title: 'Metas Alcançadas', desc: 'Seja avisado quando um filho completar todas as missões do dia.', icon: CheckCircle2 },
                     { title: 'Novidades e Atualizações', desc: 'Fique por dentro de novos recursos e matérias adicionadas.', icon: Smartphone },
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between gap-8 group">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                              <item.icon size={24} />
                           </div>
                           <div>
                              <p className="font-black text-slate-800 dark:text-white">{item.title}</p>
                              <p className="text-sm font-bold text-slate-500">{item.desc}</p>
                           </div>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" className="sr-only peer" defaultChecked />
                           <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-12 pt-8 border-t border-slate-50 dark:border-slate-800 flex justify-end">
                   <button className="btn-primary px-10">Salvar Preferências</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-12 right-12 px-8 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 font-black text-white ${message.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}
          >
            <CheckCircle2 size={24} />
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
