'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Trophy, Target } from 'lucide-react';

interface StudentHeaderProps {
  name: string;
  xp: number;
  missionsCount: number;
  progress: number;
}

export const StudentHeader = ({ name, xp, missionsCount, progress }: StudentHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-blue-500/20 mb-10"
    >
      {/* Elementos Decorativos */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 blur-2xl rounded-full" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl shadow-inner">
            <Rocket className="animate-bounce-slow" size={40} />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Olá, {name}!
            </h1>
            <p className="text-blue-100 font-bold mt-2 flex items-center gap-2 text-lg">
              <Target size={20} /> Você já conquistou {progress}% da meta semanal
            </p>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-[2rem] border border-white/10 text-center min-w-[120px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">XP Atual</p>
            <p className="text-3xl font-black">{xp}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-[2rem] border border-white/10 text-center min-w-[120px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Missões</p>
            <p className="text-3xl font-black">{missionsCount}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
