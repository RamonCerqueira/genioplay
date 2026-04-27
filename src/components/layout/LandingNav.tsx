'use client';

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingNav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 md:h-24 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <img 
              src="/icons/icon-512x512.png" 
              alt="GênioPlay Logo" 
              className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-2xl shadow-2xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full -z-10 group-hover:bg-blue-500/20 transition-colors" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">Gênio<span className="text-blue-600">Play</span></span>
        </div>
        
        {/* Desktop Menu */}
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

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6 flex flex-col gap-6 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              <a href="#beneficios" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-slate-700 dark:text-slate-200">Benefícios</a>
              <a href="#como-funciona" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-slate-700 dark:text-slate-200">Como Funciona</a>
              <a href="#precos" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-slate-700 dark:text-slate-200">Preços</a>
            </div>
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
              <Link href="/auth/login" className="btn-secondary w-full text-center py-4">Entrar</Link>
              <Link href="/auth/register" className="btn-primary w-full text-center py-4">Começar Agora</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
