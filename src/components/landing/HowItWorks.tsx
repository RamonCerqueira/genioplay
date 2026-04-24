'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, 
  BrainCircuit, 
  Trophy, 
  ArrowRight, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const steps = [
  {
    icon: <UserCheck size={36} />,
    title: 'Cadastro e Perfil',
    description: 'Crie seu perfil de guardião e adicione os filhos. Cada um terá seu próprio avatar e jornada personalizada.',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    step: '01'
  },
  {
    icon: <BrainCircuit size={36} />,
    title: 'Missões IA',
    description: 'Nossa IA gera lições baseadas nos assuntos da escola. O aluno estuda com o Anti-Cheat ativado para foco total.',
    color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    step: '02'
  },
  {
    icon: <Trophy size={36} />,
    title: 'Recompensas Reais',
    description: 'O esforço gera GênioCoins. Você define as recompensas e acompanha a evolução real através de relatórios.',
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    step: '03'
  }
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-32 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
           <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700"
          >
             Passo a Passo
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">
             Simples como <span className="text-blue-600">mágica.</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-bold">
             Entenda como transformamos o tempo de tela em tempo de aprendizado em apenas 3 passos simples.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[100px] left-[15%] right-[15%] h-1 bg-gradient-to-r from-blue-100 via-indigo-100 to-orange-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-orange-900/30 z-0" />

          {steps.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative z-10 space-y-8 group"
            >
              {/* Number Badge */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-900 rounded-2xl flex items-center justify-center text-lg font-black text-slate-300 dark:text-slate-700 shadow-sm z-20">
                {item.step}
              </div>

              {/* Icon Container */}
              <div className={`w-28 h-28 ${item.color} rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-slate-200/50 dark:shadow-none relative group-hover:scale-110 transition-transform duration-500`}>
                 <div className="absolute inset-0 bg-white/20 dark:bg-black/10 rounded-[2.5rem] scale-90 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                 {item.icon}
              </div>

              {/* Text Content */}
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed max-w-[280px] mx-auto">
                  {item.description}
                </p>
              </div>

              {/* Arrow (Mobile) */}
              {idx < 2 && (
                <div className="lg:hidden flex justify-center py-6 text-slate-200">
                   <ChevronRight size={32} className="rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Call to action footer */}
        <div className="mt-24 text-center">
           <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-8 bg-blue-600 rounded-[3rem] shadow-2xl shadow-blue-500/40 inline-flex flex-col md:flex-row items-center gap-8"
           >
              <div className="flex items-center gap-4 text-white text-left">
                 <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <ShieldCheck size={28} />
                 </div>
                 <div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-80">Pronto para começar?</p>
                    <p className="text-xl font-black">Configure em menos de 5 minutos</p>
                 </div>
              </div>
              <Link 
                href="/auth/register" 
                className="bg-white text-blue-600 font-black px-10 py-4 rounded-2xl hover:bg-slate-50 transition-colors flex items-center gap-2 text-lg"
              >
                 Criar Conta Grátis
                 <ArrowRight size={20} />
              </Link>
           </motion.div>
        </div>
      </div>
    </section>
  );
}
