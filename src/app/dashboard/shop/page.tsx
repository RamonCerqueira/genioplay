'use client';

import React, { useState, useEffect } from 'react';
import { Coins, Gift, ShoppingBag, Check, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentShopPage() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/wallet')
      .then(res => res.json())
      .then(data => setBalance(data.balance || 0));

    fetch('/api/student/rewards')
      .then(res => res.json())
      .then(data => {
        setRewards(data.rewards || []);
        setLoading(false);
      });
  }, []);

  const handleRedeem = async (rewardId: string, cost: number) => {
    if (balance < cost) return;

    const res = await fetch('/api/student/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rewardId })
    });

    if (res.ok) {
      setBalance(balance - cost);
      alert('Resgate solicitado com sucesso! Fale com seu responsável.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <ShoppingBag className="text-orange-500" size={36} />
            Loja de Prêmios
          </h1>
          <p className="text-slate-500 font-bold">Troque suas LarCoins por conquistas reais!</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-6 rounded-[2.5rem] text-white shadow-xl shadow-orange-500/30 flex items-center gap-6">
           <div className="bg-white/20 p-3 rounded-2xl">
              <Coins size={32} />
           </div>
           <div>
              <p className="text-xs font-black uppercase opacity-80 tracking-widest">Seu Saldo</p>
              <p className="text-3xl font-black">{balance} <span className="text-xl">🪙</span></p>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div></div>
        ) : rewards.length === 0 ? (
          <div className="col-span-full premium-card p-20 text-center text-slate-400 font-bold">
            Seu responsável ainda não cadastrou nenhum prêmio. Peça para ele adicionar algo legal!
          </div>
        ) : (
          rewards.map((reward) => (
            <motion.div 
              key={reward.id}
              whileHover={{ y: -5 }}
              className="premium-card group"
            >
              <div className="p-8 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                   <Gift size={32} />
                </div>
                
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white">{reward.title}</h3>
                  <p className="text-slate-500 font-bold mt-2 text-sm">{reward.description}</p>
                </div>

                <div className="flex items-center justify-between pt-4">
                   <div className="flex items-center gap-2 text-orange-600 font-black text-xl">
                      <Coins size={20} />
                      {reward.cost}
                   </div>
                   
                   {balance >= reward.cost ? (
                     <button 
                      onClick={() => handleRedeem(reward.id, reward.cost)}
                      className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 px-6 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
                     >
                       Resgatar
                     </button>
                   ) : (
                     <div className="flex items-center gap-2 text-slate-400 font-bold text-xs bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl">
                        <Lock size={14} />
                        Faltam {reward.cost - balance}
                     </div>
                   )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
