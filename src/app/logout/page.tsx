'use client';

import React, { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Home, Loader2, Sparkles } from 'lucide-react';

export default function LogoutPage() {
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    // Encerra a sessão imediatamente ao carregar a página
    signOut({ redirect: false });

    // Inicia o contador
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full premium-card p-12 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-3xl text-center relative z-10"
      >
        <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-[2.5rem] flex items-center justify-center text-rose-500 mx-auto mb-8 shadow-inner relative">
          <LogOut size={40} className="animate-pulse" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-rose-500/20 rounded-[2.5rem]"
          />
        </div>

        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-4">Sessão Encerrada</h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold mb-8">
          Até logo! Sua jornada pedagógica continua em breve. <br />
          Estamos guardando seu progresso.
        </p>

        {/* Progress Bar Container */}
        <div className="space-y-4">
           <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400">
              <span className="flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> Redirecionando</span>
              <span>{countdown}s</span>
           </div>
           <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 10, ease: "linear" }}
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
              />
           </div>
        </div>

        <div className="mt-12 flex flex-col gap-4">
           <button 
            onClick={() => router.push('/')}
            className="btn-primary py-4 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20"
           >
             <Home size={20} /> Voltar Agora
           </button>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
             <Sparkles size={12} /> GênioPlay v1.0
           </p>
        </div>
      </motion.div>

      {/* Quote at the bottom */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12 text-slate-400 dark:text-slate-600 font-bold italic text-sm text-center max-w-xs"
      >
        "A educação é a arma mais poderosa que você pode usar para mudar o mundo."
      </motion.p>
    </div>
  );
}
