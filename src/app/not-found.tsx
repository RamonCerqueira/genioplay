'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Home, Search, Rocket } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
      
      <div className="max-w-xl w-full text-center space-y-10 relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-32 h-32 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-blue-500/20 flex items-center justify-center mx-auto relative"
        >
          <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] animate-pulse opacity-20 scale-110" />
          <Brain className="text-blue-600" size={64} />
          <div className="absolute -top-2 -right-2 bg-rose-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg">
            ?
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl font-black text-slate-800 dark:text-white"
          >
            404
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-black text-slate-700 dark:text-slate-200"
          >
            Ops! Você saiu da órbita do conhecimento. 🚀
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 font-bold max-w-md mx-auto"
          >
            A página que você está procurando não existe ou foi movida para uma nova dimensão. Vamos voltar para a base?
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/dashboard" className="btn-primary px-10 py-5 w-full sm:w-auto shadow-xl shadow-blue-500/30">
            <Home size={20} /> Voltar ao Painel
          </Link>
          <Link href="/" className="px-10 py-5 rounded-2xl font-black text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2">
            <Rocket size={20} /> Ir para Home
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-12"
        >
          <div className="flex items-center justify-center gap-6 text-slate-300 dark:text-slate-700">
             <Search size={24} />
             <div className="h-px w-24 bg-slate-200 dark:bg-slate-800" />
             <span className="text-[10px] font-black uppercase tracking-widest">GênioPlay Intelligence</span>
             <div className="h-px w-24 bg-slate-200 dark:bg-slate-800" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
