'use client';

import React from 'react';
import { 
  Brain, Coins, Flame, Target, ShieldCheck, 
  Zap, Clock, ChevronRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface OverviewTabProps {
  metrics: any;
  lessons: any[];
  studentId: string;
  studentName: string;
}

export const OverviewTab = ({ metrics, lessons, studentId, studentName }: OverviewTabProps) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Mini Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="premium-card p-6 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Saldo GênioCoins</p>
          <div className="flex items-center gap-2">
            <Coins className="text-orange-500" size={24} />
            <span className="text-3xl font-black text-slate-800 dark:text-white">{metrics.walletBalance}</span>
          </div>
        </div>
        
        <div className="premium-card p-6 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ofensiva Atual</p>
          <div className="flex items-center gap-2">
            <Flame className="text-rose-500" size={24} />
            <span className="text-3xl font-black text-slate-800 dark:text-white">{metrics.streak} Dias</span>
          </div>
        </div>

        <div className="premium-card p-6 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Média de Acertos</p>
          <div className="flex items-center gap-2">
            <Target className="text-emerald-500" size={24} />
            <span className="text-3xl font-black text-slate-800 dark:text-white">{metrics.averageScore}%</span>
          </div>
        </div>

        <div className="premium-card p-6 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status Anti-Cheat</p>
          <div className="flex items-center gap-2 text-blue-500">
            <ShieldCheck size={24} />
            <span className="text-sm font-black uppercase">Protegido</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Active Lessons List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <Zap className="text-blue-600" size={28} /> Lições Ativas
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {lessons.length === 0 ? (
              <div className="col-span-full premium-card p-12 text-center text-slate-400 font-bold border-dashed border-2">
                Nenhuma lição atribuída no momento.
              </div>
            ) : (
              lessons.map(lesson => (
                <div key={lesson.id} className="premium-card p-6 bg-white dark:bg-slate-900 hover:border-blue-200 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Brain size={24} />
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                      lesson.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {lesson.completed ? 'Concluída' : 'Pendente'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                    {lesson.topic?.name || 'Assunto'}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    {lesson.topic?.subject?.name || 'Matéria'}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Clock size={14} /> 15 min
                    </div>
                    <Link href={`/dashboard/reports?studentId=${studentId}`} className="text-xs font-black text-blue-600 hover:underline">
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Skills sidebar */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <Target className="text-indigo-600" size={28} /> Habilidades
          </h2>
          <div className="premium-card p-8 bg-white dark:bg-slate-900 space-y-6">
            {[
              { name: 'Matemática', val: 85, color: 'bg-blue-500' },
              { name: 'Português', val: 92, color: 'bg-emerald-500' },
              { name: 'Ciências', val: 70, color: 'bg-orange-500' }
            ].map(skill => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span className="text-slate-500">{skill.name}</span>
                  <span className="text-slate-800 dark:text-white">{skill.val}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.val}%` }}
                    className={`h-full ${skill.color}`}
                  />
                </div>
              </div>
            ))}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm font-bold text-slate-500 text-center italic">
                "{studentName} está evoluindo muito bem em Português!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
