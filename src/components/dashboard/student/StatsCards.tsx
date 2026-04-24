'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Coins } from 'lucide-react';

interface StatsCardsProps {
  streak: number;
  walletBalance: number;
}

export const StatsCards = ({ streak, walletBalance }: StatsCardsProps) => {
  return (
    <div className="space-y-6">
      {/* Wallet Card */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="premium-card p-8 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center justify-between group overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 dark:bg-orange-900/10 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />
        
        <div className="relative z-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Meu Saldo</p>
          <p className="text-4xl font-black text-slate-800 dark:text-white">{walletBalance}</p>
        </div>
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 relative z-10">
          <Coins size={36} />
        </div>
      </motion.div>

      {/* Streak Card */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="premium-card p-8 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center justify-between group overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 dark:bg-rose-900/10 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />

        <div className="relative z-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ofensiva</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-slate-800 dark:text-white">{streak}</p>
            <p className="text-lg font-black text-slate-400">Dias</p>
          </div>
        </div>
        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-500 shadow-inner group-hover:bg-rose-500 group-hover:text-white transition-all duration-500 relative z-10">
          <Flame size={36} />
        </div>
      </motion.div>

      {/* Tip Card */}
      <div className="premium-card p-8 bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none shadow-xl shadow-blue-500/20">
         <h4 className="font-black text-lg mb-2">Dica do Gênio! 💡</h4>
         <p className="text-blue-100 text-sm font-bold leading-relaxed">
           Estudar por 15 minutos todos os dias é melhor do que 2 horas em um único dia. Mantenha sua ofensiva!
         </p>
      </div>
    </div>
  );
};
