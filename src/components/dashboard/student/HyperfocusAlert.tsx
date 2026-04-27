'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Timer, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function HyperfocusAlert() {
  const [status, setStatus] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    const res = await fetch('/api/student/hyperfocus');
    const data = await res.json();
    if (data.success) {
      setStatus(data);
      if (data.hyperfocusActiveUntil) {
        const remaining = Math.floor((new Date(data.hyperfocusActiveUntil).getTime() - Date.now()) / 1000);
        if (remaining > 0) setTimeLeft(remaining);
      }
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => {
      if (timeLeft && timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else if (timeLeft === 0) {
        setTimeLeft(null);
        fetchStatus();
      } else {
        fetchStatus();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleStart = async () => {
    setLoading(true);
    const res = await fetch('/api/student/hyperfocus', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      await fetchStatus();
    }
    setLoading(false);
  };

  const isAvailable = status?.hyperfocusAvailableUntil && new Date(status.hyperfocusAvailableUntil) > new Date();
  const isActive = timeLeft && timeLeft > 0;

  if (!isAvailable && !isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-6"
      >
        {isActive ? (
          <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600 p-[2px] rounded-3xl shadow-[0_0_40px_rgba(245,158,11,0.4)]">
             <div className="bg-slate-900 px-8 py-4 rounded-[22px] flex items-center justify-between border border-white/10">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center text-slate-900 animate-bounce">
                      <Zap size={24} fill="currentColor" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Hyperfocus Ativo!</p>
                      <p className="text-xl font-black text-white tracking-tighter uppercase">XP EM DOBRO ⚡</p>
                   </div>
                </div>
                
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-2 text-yellow-500">
                      <Timer size={16} />
                      <span className="font-mono text-2xl font-black tabular-nums">
                         {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                      </span>
                   </div>
                   <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Aceleração Máxima</span>
                </div>
             </div>
          </div>
        ) : (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1 rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.3)]"
          >
             <div className="bg-white dark:bg-slate-900 px-8 py-6 rounded-[2.3rem] flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                      <Zap size={28} className="animate-pulse" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Desafio Disponível</p>
                      <h4 className="text-lg font-black text-slate-800 dark:text-white leading-tight">Ganhe XP em Dobro por 15 min!</h4>
                   </div>
                </div>
                <button 
                  onClick={handleStart}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                   {loading ? "..." : "Começar Agora"}
                </button>
             </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
