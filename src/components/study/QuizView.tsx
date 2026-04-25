'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface QuizViewProps {
  currentQuestion: number;
  totalQuestions: number;
  question: string;
  options: string[];
  correctIndex: number;
  selectedOption: number | null;
  onOptionSelect: (index: number) => void;
}

export const QuizView = ({ 
  currentQuestion, totalQuestions, question, options, correctIndex, selectedOption, onOptionSelect 
}: QuizViewProps) => {
  return (
    <motion.div 
      key="quiz"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="premium-card p-10 bg-slate-900 border-none text-white min-h-[400px] space-y-8 shadow-2xl"
    >
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
          Pergunta {currentQuestion + 1}/{totalQuestions}
        </span>
        <div className="flex gap-1.5">
          {[...Array(totalQuestions)].map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i < currentQuestion ? 'bg-emerald-500 w-4' : i === currentQuestion ? 'bg-blue-500 w-8' : 'bg-slate-700 w-2'}`} />
          ))}
        </div>
      </div>

      <div className="space-y-12">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
            <Brain size={32} />
          </div>
          <h3 className="text-2xl font-black leading-tight tracking-tight max-w-2xl">
            {question}
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {options.map((option: string, i: number) => (
            <button
              key={i}
              disabled={selectedOption !== null}
              onClick={() => onOptionSelect(i)}
              className={`w-full p-6 rounded-2xl text-left font-bold transition-all flex items-center justify-between border-2 ${
                selectedOption === i 
                ? i === correctIndex 
                  ? 'bg-emerald-500 border-emerald-400 text-white' 
                  : 'bg-rose-500 border-rose-400 text-white'
                : selectedOption !== null && i === correctIndex
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${selectedOption === i ? 'bg-white/20' : 'bg-slate-900 text-white shadow-sm'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm md:text-base">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
