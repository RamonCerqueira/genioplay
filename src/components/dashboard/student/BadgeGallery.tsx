'use client';

import React from 'react';
import { Star, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export function BadgeGallery({ badges }: { badges: any[] }) {
  return (
    <div className="premium-card p-8 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
          <Trophy size={20} />
        </div>
        <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Suas Conquistas</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {badges.length > 0 ? badges.map((sb: any, i: number) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center space-y-3 group transition-all"
          >
            <div className="relative w-16 h-16 mb-2">
               <img 
                 src={sb.badge.icon} 
                 alt={sb.badge.name} 
                 className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(37,99,235,0.2)] group-hover:drop-shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
               />
            </div>
            <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-tight leading-tight">{sb.badge.name}</span>
          </motion.div>
        )) : (
          <div className="col-span-2 py-8 text-center">
            <p className="text-xs font-bold text-slate-400 italic">Complete lições para ganhar selos!</p>
          </div>
        )}
      </div>
    </div>
  );
}
