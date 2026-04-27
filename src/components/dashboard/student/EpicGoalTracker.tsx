'use client';

import React, { useState, useEffect } from 'react';
import { Target, Trophy, XCircle, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function EpicGoalTracker() {
  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/epic-goal')
      .then(res => res.json())
      .then(data => {
        if (data.success) setGoal(data.goal);
        setLoading(false);
      });
  }, []);

  if (loading || !goal) return null;

  const percentage = Math.min(Math.round((goal.currentLessons / goal.targetLessons) * 100), 100);
  
  // Criar array de "peças" (tijolos)
  const totalBricks = 20; // Visual fixo de 20 blocos
  const filledBricks = Math.round((percentage / 100) * totalBricks);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-8 bg-gradient-to-br from-slate-900 to-blue-900 text-white border-none shadow-2xl shadow-blue-500/20 overflow-hidden relative group"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
         <Target size={120} />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-start">
           <div>
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-1">Minha Meta Épica</p>
              <h3 className="text-2xl font-black uppercase tracking-tight">{goal.title}</h3>
           </div>
           <div className="bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest">{percentage}% Concluído</p>
           </div>
        </div>

        <div className="space-y-4">
           <div className="flex flex-wrap gap-2">
              {Array.from({ length: totalBricks }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`h-4 w-8 rounded-sm ${i < filledBricks ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`}
                />
              ))}
           </div>
           <p className="text-xs font-bold text-slate-400 italic">
             Faltam {goal.targetLessons - goal.currentLessons} lições para o seu prêmio!
           </p>
        </div>

        <div className="bg-white/10 p-6 rounded-3xl border border-white/10 flex items-center gap-4">
           <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-amber-400/20 shrink-0">
              <Trophy size={24} fill="currentColor" />
           </div>
           <div>
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Prêmio Combinado</p>
              <p className="text-lg font-black">{goal.prize}</p>
           </div>
           <div className="ml-auto">
              <Sparkles className="text-white/40 animate-pulse" size={20} />
           </div>
        </div>
      </div>
    </motion.div>
  );
}
