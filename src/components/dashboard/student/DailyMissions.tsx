'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Clock, ChevronRight, Trophy } from 'lucide-react';
import Link from 'next/link';

interface Mission {
  id: string;
  topic: {
    name: string;
    subject: {
      name: string;
    }
  }
}

interface DailyMissionsProps {
  missions: Mission[];
}

export const DailyMissions = ({ missions }: DailyMissionsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <Trophy className="text-orange-500" size={28} />
          Missões do Dia
        </h2>
        <Link href="/dashboard/study" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
          Ver Todas
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {missions.length === 0 ? (
          <div className="col-span-full premium-card p-12 text-center border-dashed border-2 bg-slate-50/50 dark:bg-slate-800/20">
             <p className="text-slate-400 font-bold">Nenhuma missão para hoje. Relaxe ou peça uma nova ao seu guardião!</p>
          </div>
        ) : (
          missions.map((mission, i) => (
            <motion.div 
              key={mission.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="premium-card p-8 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:scale-[1.02] transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                    <Brain size={32} />
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                     <Coins size={12} className="fill-orange-500" /> +150
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                    {mission.topic.name}
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      {mission.topic.subject.name}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <Clock size={14} /> 15 MIN
                    </span>
                  </div>
                </div>

                <Link 
                  href={`/dashboard/study/${mission.id}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 group-hover:gap-4 transition-all"
                >
                  Iniciar Jornada
                  <ChevronRight size={20} />
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

// Mock para evitar erro de import se 'Coins' não estiver disponível aqui
const Coins = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/>
    <path d="M7 6h1v4"/><path d="M17.22 15.31h1v4"/>
  </svg>
);
