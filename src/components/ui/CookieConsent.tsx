'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ShieldCheck, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('genioplay_cookie_consent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('genioplay_cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed top-6 left-6 right-6 md:top-auto md:bottom-8 md:left-auto md:right-8 md:w-[400px] z-[10000]"
        >
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-2xl space-y-6">
             <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl text-blue-600">
                   <Cookie size={24} />
                </div>
                <div className="flex-1 space-y-1">
                   <h4 className="font-black text-slate-800 dark:text-white leading-tight">Sua privacidade é prioridade</h4>
                   <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                     Usamos cookies para melhorar sua experiência no GênioPlay e garantir a segurança do estudo dos seus filhos.
                   </p>
                </div>
                <button onClick={() => setIsVisible(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                   <X size={16} />
                </button>
             </div>

             <div className="flex gap-3">
                <button 
                  onClick={handleAccept}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl text-xs font-black transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={14} /> Aceitar Tudo
                </button>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 py-3 rounded-2xl text-xs font-black transition-all"
                >
                  Recusar
                </button>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
