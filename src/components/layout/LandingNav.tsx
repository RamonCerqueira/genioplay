'use client';

import React from 'react';
import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export default function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-xl shadow-blue-500/20">
            <BrainCircuit size={28} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">Gênio<span className="text-blue-600">Play</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-8 pr-8 border-r border-slate-100 dark:border-slate-800">
            <a href="#beneficios" className="text-sm font-black text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Benefícios</a>
            <a href="#como-funciona" className="text-sm font-black text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Como Funciona</a>
            <a href="#precos" className="text-sm font-black text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Preços</a>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/auth/login" className="px-6 py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-sm font-black text-slate-700 dark:text-slate-300 hover:border-blue-600/20 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all">
              Entrar
            </Link>
            <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-8 rounded-2xl transition-all duration-300 shadow-xl shadow-blue-500/25 active:scale-95 text-sm uppercase tracking-widest">
              Começar Agora
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
