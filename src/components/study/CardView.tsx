'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CardViewProps {
  currentCard: number;
  totalCards: number;
  title: string;
  content: string;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
}

export const CardView = ({ 
  currentCard, totalCards, title, content, onNext, onPrev, onFinish 
}: CardViewProps) => {
  return (
    <motion.div 
      key="cards"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="premium-card p-10 bg-white dark:bg-slate-900 border-none min-h-[400px] flex flex-col justify-between relative shadow-2xl"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            Flashcard {currentCard + 1}/{totalCards}
          </span>
          <div className="flex gap-1.5">
            {[...Array(totalCards)].map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentCard ? 'w-8 bg-blue-600' : 'w-2 bg-slate-100 dark:bg-slate-800'}`} />
            ))}
          </div>
        </div>
        
        <h3 className="text-3xl font-black text-slate-800 dark:text-white leading-tight tracking-tight">
          {title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-xl leading-relaxed">
          {content}
        </p>
      </div>
      
      <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-50 dark:border-slate-800">
        <button 
          onClick={onPrev}
          disabled={currentCard === 0}
          className="flex items-center gap-2 text-slate-400 font-black text-xs hover:text-blue-600 disabled:opacity-0 transition-all uppercase tracking-widest"
        >
          <ChevronLeft size={20} /> Anterior
        </button>
        
        {currentCard < totalCards - 1 ? (
          <button 
            onClick={onNext}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest shadow-xl"
          >
            Próximo <ChevronRight size={20} />
          </button>
        ) : (
          <button 
            onClick={onFinish}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest shadow-xl shadow-blue-500/25"
          >
            Iniciar Quiz 🚀
          </button>
        )}
      </div>
    </motion.div>
  );
};
