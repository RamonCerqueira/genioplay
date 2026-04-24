'use client';

import React from 'react';
import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export default function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <BrainCircuit size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-800 dark:text-white">Gênio<span className="text-blue-600">Play</span></span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#beneficios" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Benefícios</a>
          <a href="#como-funciona" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Como Funciona</a>
          <a href="#precos" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Preços</a>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
          
          <ThemeToggle />
          
          <Link href="/auth/login" className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            Entrar
          </Link>
          <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 active:scale-95 flex items-center justify-center gap-2 text-sm">
            Começar Agora
          </Link>
        </div>
      </div>
    </nav>
  );
}
