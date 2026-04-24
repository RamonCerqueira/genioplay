'use client';

import React, { useState } from 'react';
import { Plus, Gift, Edit2, Trash2, Coins, ChevronLeft, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Reward {
  id: string;
  title: string;
  cost: number;
  description: string;
}

export default function ManageRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([
    { id: '1', title: '1h de Videogame', cost: 300, description: 'Vale para jogar qualquer console.' },
    { id: '2', title: 'Escolher o Jantar', cost: 500, description: 'Pode pedir pizza ou hambúrguer.' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newReward, setNewReward] = useState({ title: '', cost: 0, description: '' });

  const addReward = () => {
    if (newReward.title && newReward.cost > 0) {
      setRewards([...rewards, { ...newReward, id: Math.random().toString() }]);
      setNewReward({ title: '', cost: 0, description: '' });
      setIsAdding(false);
    }
  };

  const deleteReward = (id: string) => {
    setRewards(rewards.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="p-2 rounded-xl hover:bg-slate-100 transition-all text-slate-400">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <Gift className="text-orange-500" size={32} />
              Gerenciar Recompensas
            </h1>
            <p className="text-slate-500 font-bold">Cadastre prêmios reais para motivar o estudo.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-secondary !py-3 !px-6"
        >
          <Plus size={20} />
          Novo Prêmio
        </button>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="premium-card p-8 border-orange-200 bg-orange-50/20 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nome do Prêmio</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Passeio no Parque" 
                    className="input-field"
                    value={newReward.title}
                    onChange={e => setNewReward({...newReward, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Custo (Moedas)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="500" 
                      className="input-field pl-12"
                      value={newReward.cost || ''}
                      onChange={e => setNewReward({...newReward, cost: parseInt(e.target.value)})}
                    />
                    <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Descrição (Opcional)</label>
                <textarea 
                  placeholder="Descreva os detalhes da recompensa..." 
                  className="input-field min-h-[100px] resize-none"
                  value={newReward.description}
                  onChange={e => setNewReward({...newReward, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-3 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-white transition-all flex items-center gap-2"
                >
                  <X size={18} /> Cancelar
                </button>
                <button 
                  onClick={addReward}
                  className="btn-secondary !py-3 !px-8"
                >
                  <Save size={18} /> Salvar Prêmio
                </button>
              </div>
            </motion.div>
          )}

          {rewards.map(reward => (
            <motion.div 
              key={reward.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="premium-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
                  <Gift size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">{reward.title}</h3>
                  <p className="text-sm text-slate-500 font-bold">{reward.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Custo</p>
                  <div className="flex items-center gap-1.5 text-orange-500 font-black text-xl">
                    <Coins size={20} />
                    {reward.cost}
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-3 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-all">
                    <Edit2 size={20} />
                  </button>
                  <button 
                    onClick={() => deleteReward(reward.id)}
                    className="p-3 rounded-xl border border-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {rewards.length === 0 && !isAdding && (
          <div className="premium-card p-16 text-center border-dashed border-slate-200 bg-slate-50/50">
             <Gift size={48} className="mx-auto text-slate-300 mb-4" />
             <p className="text-slate-500 font-black">Nenhuma recompensa cadastrada.</p>
             <button onClick={() => setIsAdding(true)} className="text-orange-500 font-black text-sm mt-2 hover:underline">Adicionar primeiro prêmio</button>
          </div>
        )}
      </div>
    </div>
  );
}
