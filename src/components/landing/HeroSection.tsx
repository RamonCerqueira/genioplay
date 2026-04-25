'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Trophy, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import HeroAnimation from './HeroAnimation';

export default function HeroSection() {
  return (
    <section className="relative pt-48 pb-32 px-8 overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Mesh Gradient Background - Mais Suave e Profissional */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute top-[-5%] left-[-10%] w-[60%] h-[60%] bg-blue-400 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 blur-[150px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* Text Content - 7 Colunas para mais destaque */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-12 relative z-10 text-left"
          >
            <div className="inline-flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Educação Familiar 4.0</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.92] tracking-tighter">
              Educação <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Gamificada</span> <br />
              de Elite.
            </h1>

            <p className="text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-xl">
              A maior vantagem competitiva que você pode dar ao seu filho. O <span className="text-blue-600">GênioPlay</span> usa IA para transformar diversão em conhecimento profundo.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-8">
              <Link
                href="/auth/register"
                className="group relative bg-blue-600 hover:bg-blue-700 text-white font-black py-6 px-12 rounded-[2rem] transition-all duration-300 shadow-2xl shadow-blue-500/40 active:scale-95 flex items-center justify-center gap-3 w-full sm:w-auto text-xl overflow-hidden uppercase tracking-widest"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                Começar Agora
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center gap-4 group cursor-default">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 overflow-hidden shadow-md group-hover:translate-x-1 transition-transform">
                      <img src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="flex text-orange-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">+2.500 famílias</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-emerald-500" size={20} />
                <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Garantia 7 Dias</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="text-indigo-500" size={20} />
                <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">IA Gemini 1.5</span>
              </div>
            </div>
          </motion.div>

          {/* Animation Content - 5 Colunas para equilíbrio */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative z-10 w-full max-w-[480px]">
               <HeroAnimation />
            </div>
            {/* Badges Flutuantes - Reposicionados para Simetria */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-8 premium-card p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-blue-100 dark:border-slate-700 shadow-2xl flex items-center gap-4 z-20"
            >
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-500">
                <Trophy size={32} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nova Conquista!</p>
                <p className="text-lg font-black text-slate-800 dark:text-white">Mestre da Lógica</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -left-12 premium-card p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-indigo-100 dark:border-slate-700 shadow-2xl flex items-center gap-4 z-20"
            >
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                <Sparkles size={32} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GênioCoins</p>
                <p className="text-lg font-black text-slate-800 dark:text-white">+250 ganhos</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
