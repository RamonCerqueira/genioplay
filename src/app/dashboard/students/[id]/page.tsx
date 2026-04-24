'use client';

import React, { useState, useEffect } from 'react';
import { 
  Brain, Coins, Trophy, Zap, Clock, ChevronLeft, 
  Star, Flame, Target, BarChart3, PlusCircle, 
  Settings, ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';

export default function StudentManagePage({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca dados detalhados do estudante para o responsável
    fetch(`/api/guardian/student-details?id=${params.id}`)
      .then(res => res.json())
      .then(data => {
        setStudent(data.student);
        setLessons(data.lessons || []);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!student) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-black text-slate-800 dark:text-white">Estudante não encontrado</h2>
      <Link href="/dashboard" className="btn-primary px-8 py-3">Voltar ao Painel</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar role="GUARDIAN" />
      
      <main className="md:ml-72 p-6 md:px-8 xl:px-16 pt-12 pb-32">
        <div className="max-w-[1400px] mx-auto space-y-10">
          
          {/* Header - Perfil do Filho */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-blue-600 transition-colors">
                <ChevronLeft size={24} />
              </Link>
              <div className="w-20 h-20 rounded-[2rem] bg-blue-600 flex items-center justify-center text-4xl shadow-xl shadow-blue-500/20">
                {student.avatar || '🎓'}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black text-slate-800 dark:text-white">{student.username}</h1>
                  <span className="badge bg-blue-50 text-blue-600 dark:bg-blue-900/30 font-black">Nível 5</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-bold">Gerenciando progresso de {student.username}</p>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
               <Link href={`/dashboard/generator?studentId=${student.id}`} className="btn-primary flex-1 md:flex-none py-3 px-6 flex items-center justify-center gap-2">
                  <PlusCircle size={20} /> Atribuir Lição
               </Link>
               <button className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-blue-600 transition-colors">
                  <Settings size={24} />
               </button>
            </div>
          </div>

          {/* Grid de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="premium-card p-6 bg-white dark:bg-slate-900">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Saldo GênioCoins</p>
                <div className="flex items-center gap-2">
                   <Coins className="text-orange-500" size={24} />
                   <span className="text-3xl font-black text-slate-800 dark:text-white">{student.wallet?.balance || 0}</span>
                </div>
             </div>
             <div className="premium-card p-6 bg-white dark:bg-slate-900">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ofensiva Atual</p>
                <div className="flex items-center gap-2">
                   <Flame className="text-rose-500" size={24} />
                   <span className="text-3xl font-black text-slate-800 dark:text-white">3 Dias</span>
                </div>
             </div>
             <div className="premium-card p-6 bg-white dark:bg-slate-900">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Média de Acertos</p>
                <div className="flex items-center gap-2">
                   <Target className="text-emerald-500" size={24} />
                   <span className="text-3xl font-black text-slate-800 dark:text-white">82%</span>
                </div>
             </div>
             <div className="premium-card p-6 bg-white dark:bg-slate-900">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status Anti-Cheat</p>
                <div className="flex items-center gap-2">
                   <ShieldCheck className="text-blue-500" size={24} />
                   <span className="text-sm font-black text-blue-500 uppercase">Protegido</span>
                </div>
             </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Lições Ativas */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                <Zap className="text-blue-600" size={28} /> Lições Ativas
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {lessons.length === 0 ? (
                  <div className="col-span-full premium-card p-12 text-center text-slate-400 font-bold border-dashed">
                    Nenhuma lição atribuída no momento.
                  </div>
                ) : (
                  lessons.map(lesson => (
                    <div key={lesson.id} className="premium-card p-6 bg-white dark:bg-slate-900 hover:border-blue-200 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                          <Brain size={24} />
                        </div>
                        <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest">
                          Pendente
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                        {lesson.topic.name}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                        {lesson.topic.subject.name}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <Clock size={14} /> 15 min
                        </div>
                        <Link href={`/dashboard/reports?studentId=${student.id}`} className="text-xs font-black text-blue-600 hover:underline">
                          Ver Relatório
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sidebar - Desempenho por Matéria */}
            <div className="space-y-6">
               <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                <BarChart3 className="text-indigo-600" size={28} /> Habilidades
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
                      "A evolução em Português foi excelente nesta semana!" - IA GênioPlay
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileNav role="GUARDIAN" />
    </div>
  );
}
