'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Gift, User, Lock, Trash2, Plus, CheckCircle2, Loader2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'rewards'>('profile');
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

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-800 dark:text-white flex items-center gap-4">
          <Settings className="text-blue-600" size={40} /> Configurações
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">Gerencie sua conta e as recompensas dos seus filhos.</p>
      </div>

      <div className="flex gap-4 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-lg shadow-blue-500/5' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <User size={18} /> Meu Perfil
        </button>
        <button 
          onClick={() => setActiveTab('rewards')}
          className={`px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'rewards' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-lg shadow-blue-500/5' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Gift size={18} /> Recompensas
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'profile' ? (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid md:grid-cols-3 gap-8"
          >
            <div className="md:col-span-2 space-y-8">
              <div className="premium-card p-10 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nome de Usuário</label>
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
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                      <div className="relative">
                        <input 
                          type="email" 
                          className="input-field opacity-60" 
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
               <div className="premium-card p-8 bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none shadow-xl">
                  <h4 className="text-lg font-black mb-2">Suporte GênioPlay</h4>
                  <p className="text-sm font-bold text-blue-100 mb-6">Precisa de ajuda com sua conta ou assinatura? Nossa equipe está pronta para ajudar.</p>
                  <button className="w-full py-4 bg-white text-blue-600 font-black rounded-2xl shadow-lg">Falar com Suporte</button>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="rewards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid md:grid-cols-3 gap-12"
          >
            <div className="md:col-span-1">
              <div className="premium-card p-8 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl sticky top-8">
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
                    <p className="text-slate-400 font-bold">Nenhuma recompensa criada ainda.<br/>Que tal criar a primeira para motivar os estudos?</p>
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
