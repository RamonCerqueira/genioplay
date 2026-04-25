'use client';

import React from 'react';
import { Timer, Coins, Map as MapIcon, LayoutGrid, Square } from 'lucide-react';

interface StudyHeaderProps {
  timeLeft: number;
  isActive: boolean;
  balance: number;
  boardView: boolean;
  hasTrilha: boolean;
  topic: string;
  subject: string;
  onToggleView: () => void;
  onExit: () => void;
}

export const StudyHeader = ({ 
  timeLeft, isActive, balance, boardView, hasTrilha, topic, subject, onToggleView, onExit 
}: StudyHeaderProps) => {
  return (
    <div className="flex flex-col gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all duration-700 shadow-2xl ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
            <Timer size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </h2>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Tempo de Foco</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasTrilha && (
            <button 
              onClick={onToggleView}
              className="flex items-center gap-2 px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
            >
              {boardView ? <LayoutGrid size={16} /> : <MapIcon size={16} />}
              {boardView ? 'Cards' : 'Mapa'}
            </button>
          )}
          
          <div className="flex items-center gap-3 px-5 py-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
            <Coins size={18} className="text-amber-500 fill-amber-500" />
            <p className="text-lg font-black text-amber-600 dark:text-amber-400">{balance}</p>
          </div>

          <button 
            onClick={onExit}
            className="w-12 h-12 rounded-xl border-2 border-slate-50 dark:border-slate-800 flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-100 transition-all"
          >
            <Square size={20} />
          </button>
        </div>
      </div>

      <div className="border-t border-slate-50 dark:border-slate-800 pt-4">
         <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">{topic}</h3>
         <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">{subject}</p>
      </div>
    </div>
  );
};
