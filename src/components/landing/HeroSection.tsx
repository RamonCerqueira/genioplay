'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Trophy, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import HeroAnimation from './HeroAnimation';

export default function HeroSection() {
  return (
    <section className="relative pt-40 pb-32 px-6 overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-10 relative z-10"
        >
          <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-5 py-2 rounded-full border border-blue-100 dark:border-slate-700 shadow-sm">
            <div className="flex -space-x-1">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            </div>
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">O Futuro da Educação Familiar</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.95] tracking-tight">
            Educação <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Gamificada</span> <br />
            de Elite.
          </h1>

          <p className="text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-xl">
            Transforme o vício em telas na maior vantagem competitiva do seu filho. O <span className="text-blue-600">GênioPlay</span> usa IA para ensinar enquanto eles se divertem.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link 
              href="/auth/register" 
              className="group relative bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-10 rounded-[2rem] transition-all duration-300 shadow-2xl shadow-blue-500/40 active:scale-95 flex items-center justify-center gap-3 w-full sm:w-auto text-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              Começar Agora
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-2">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <div className="flex text-orange-400">
                     {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
               </div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">+2.500 famílias ativas</p>
            </div>
          </div>

          {/* Key Points */}
          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                   <ShieldCheck size={20} />
                </div>
                <span className="text-sm font-black text-slate-700 dark:text-slate-300">100% Seguro</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                   <Zap size={20} />
                </div>
                <span className="text-sm font-black text-slate-700 dark:text-slate-300">IA Adaptativa</span>
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative lg:ml-auto"
        >
          <div className="relative z-10 p-4 bg-white/10 backdrop-blur-xl rounded-[3rem] border border-white/20 shadow-3xl">
             <HeroAnimation />
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full" />

          {/* Floating Achievement */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -top-6 -right-6 premium-card p-5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-blue-100 dark:border-slate-700 shadow-2xl hidden md:flex items-center gap-4 z-20"
          >
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-500">
               <Trophy size={28} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nova Conquista!</p>
               <p className="text-lg font-black text-slate-800 dark:text-white">Mestre da Lógica</p>
            </div>
          </motion.div>

          {/* Floating Coins */}
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-6 -left-10 premium-card p-5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-indigo-100 dark:border-slate-700 shadow-2xl hidden md:flex items-center gap-4 z-20"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
               <Sparkles size={28} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GênioCoins</p>
               <p className="text-lg font-black text-slate-800 dark:text-white">+250 ganhos</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
