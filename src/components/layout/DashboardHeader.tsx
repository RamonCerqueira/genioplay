'use client';

import React from 'react';
import { NotificationBell } from './NotificationBell';
import { Search, Brain } from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="h-20 flex items-center justify-between px-6 mb-4 relative z-40">
      <div className="relative flex-1 max-w-md hidden md:block group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Buscar lições, filhos ou matérias..." 
          className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="hidden lg:flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800">
          <Brain className="text-blue-600" size={18} />
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Mentor IA Ativo</span>
        </div>
        
        <NotificationBell />

        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
           <span className="text-xs font-black">G</span>
        </div>
      </div>
    </header>
  );
}
