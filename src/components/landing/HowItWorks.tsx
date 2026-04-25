'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, 
  BrainCircuit, 
  Trophy, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: <UserCheck size={36} />,
    title: 'Cadastro e Perfil',
    description: 'Crie seu perfil de guardião e adicione os filhos. Cada um terá seu próprio avatar e jornada personalizada.',
    color: 'from-blue-600 to-indigo-600',
    step: '01'
  },
  {
    icon: <BrainCircuit size={36} />,
    title: 'Missões IA',
    description: 'Nossa IA gera lições baseadas nos assuntos da escola. O aluno estuda com o Anti-Cheat ativado para foco total.',
    color: 'from-indigo-600 to-purple-600',
    step: '02'
  },
  {
    icon: <Trophy size={36} />,
    title: 'Recompensas Reais',
    description: 'O esforço gera GênioCoins. Você define as recompensas e acompanha a evolução real através de relatórios.',
    color: 'from-orange-600 to-amber-600',
    step: '03'
  }
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-32 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent -translate-y-1/2 z-0 hidden lg:block" />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
           <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl text-xs font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800"
          >
             Metodologia
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">
             Simples como <span className="text-blue-600">mágica.</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-bold">
             Uma jornada de aprendizado pensada para ser divertida para os filhos e tranquila para os pais.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {steps.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative group"
            >
              {/* Card Container */}
              <div className="bg-white dark:bg-slate-800/50 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500 flex flex-col items-center text-center">
                
                {/* Number & Icon Container */}
                <div className="relative mb-8">
                   <div className={`w-24 h-24 bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      {item.icon}
                   </div>
                   <div className="absolute -top-4 -right-4 w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl flex items-center justify-center text-sm font-black shadow-lg">
                      {item.step}
                   </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Connecting Arrow (Desktop) */}
              {idx < 2 && (
                <div className="hidden lg:flex absolute top-1/2 -right-6 -translate-y-1/2 z-20 text-slate-300 dark:text-slate-700 animate-pulse">
                   <ArrowRight size={32} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 p-8 md:p-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] shadow-2xl shadow-blue-500/40 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
        >
          <div className="space-y-4">
            <h4 className="text-3xl font-black text-white leading-tight">
               Pronto para transformar <br /> a rotina do seu filho?
            </h4>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <div className="flex items-center gap-2 text-blue-100 text-xs font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full">
                  <ShieldCheck size={16} /> 7 Dias Grátis
               </div>
               <div className="flex items-center gap-2 text-blue-100 text-xs font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full">
                  <Zap size={16} /> Setup em 2 min
               </div>
            </div>
          </div>
          <Link 
            href="/auth/register" 
            className="bg-white text-blue-600 font-black px-12 py-5 rounded-2xl hover:bg-slate-50 transition-all text-xl shadow-xl hover:scale-105 active:scale-95"
          >
             Criar Conta Grátis
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
