'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BadgeData {
  id: string; // Notification ID
  badgeName: string;
  badgeMessage: string;
}

export function BadgeUnlockModal() {
  const [unlockedBadge, setUnlockedBadge] = useState<BadgeData | null>(null);

  useEffect(() => {
    // Polling simple para buscar badges recém conquistadas a cada 10 segundos
    const checkNewBadges = async () => {
      try {
        const res = await fetch('/api/student/badges/new');
        if (res.ok) {
          const data = await res.json();
          if (data.badge) {
            setUnlockedBadge(data.badge);
            fireConfetti();
          }
        }
      } catch (error) {
        console.error('Error fetching new badges', error);
      }
    };

    checkNewBadges();
    const interval = setInterval(checkNewBadges, 10000);
    return () => clearInterval(interval);
  }, []);

  const fireConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#2563eb', '#f59e0b', '#10b981']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#2563eb', '#f59e0b', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleClose = async () => {
    if (!unlockedBadge) return;
    
    // Marcar como lido
    try {
      await fetch('/api/student/badges/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: unlockedBadge.id })
      });
    } catch (e) { }

    setUnlockedBadge(null);
  };

  return (
    <AnimatePresence>
      {unlockedBadge && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            className="relative w-full max-w-md bg-[#020617] rounded-[3rem] border border-blue-500/30 p-10 overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.4)] text-center"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15)_0%,transparent_70%)] pointer-events-none" />
            
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <motion.div 
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-amber-500/50 mb-8 border-4 border-amber-300"
            >
              <Trophy size={64} className="text-white drop-shadow-md" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 font-black text-sm uppercase tracking-widest">
                Nova Conquista Desbloqueada!
              </span>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
                {unlockedBadge.badgeName}
              </h2>
              <p className="text-slate-400 font-medium text-lg leading-relaxed">
                {unlockedBadge.badgeMessage}
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={handleClose}
              className="mt-10 w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-5 rounded-[2rem] shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={20} /> Incrível!
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
