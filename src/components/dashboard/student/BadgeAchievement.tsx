'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Star, Trophy, Sparkles } from 'lucide-react';

export function BadgeAchievement({ newBadge, onComplete }: { newBadge: any, onComplete: () => void }) {
  useEffect(() => {
    if (newBadge) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#f59e0b', '#10b981']
      });
    }
  }, [newBadge]);

  if (!newBadge) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
          onClick={onComplete}
        />

        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
          className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3rem] p-10 text-center shadow-[0_0_50px_rgba(37,99,235,0.3)] border-4 border-blue-500"
        >
          {/* Animated Shine Effect */}
          <div className="absolute inset-0 overflow-hidden rounded-[3rem] pointer-events-none">
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
          </div>

          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-40 h-40 bg-white/50 dark:bg-amber-900/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl relative"
          >
            <div className="absolute -top-4 -right-4 text-amber-500 z-10">
               <Sparkles size={48} fill="currentColor" className="animate-pulse" />
            </div>
            <img 
              src={newBadge.badge.icon} 
              alt={newBadge.badge.name} 
              className="w-32 h-32 object-contain drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]"
            />
          </motion.div>

          <div className="space-y-4">
             <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Nova Conquista!</h2>
             <p className="text-blue-600 font-black text-xl tracking-widest uppercase">{newBadge.badge.name}</p>
             <p className="text-sm font-bold text-slate-500 dark:text-slate-400 italic">
               "{newBadge.badge.description}"
             </p>
          </div>

          <button
            onClick={onComplete}
            className="btn-primary w-full py-5 mt-10 text-lg font-black shadow-xl shadow-blue-500/20"
          >
            Incrível! 🚀
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
