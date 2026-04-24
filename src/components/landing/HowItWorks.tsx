'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, BrainCircuit, Trophy, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <MousePointer2 size={32} />,
      title: '1. Você Atribui',
      description: 'Escolha o assunto que seu filho precisa reforçar. Nossa IA cria o conteúdo na hora.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: <BrainCircuit size={32} />,
      title: '2. Ele Aprende',
      description: 'O aluno estuda com flashcards 3D e quizzes inteligentes que se adaptam ao nível dele.',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: <Trophy size={32} />,
      title: '3. Todos Ganham',
      description: 'Ele ganha LarCoins por concluir missões e você recebe relatórios detalhados de evolução.',
      color: 'bg-emerald-100 text-emerald-600',
    }
  ];

  return (
    <section id="como-funciona" className="py-24 bg-white dark:bg-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter">O ciclo do <span className="text-blue-600">sucesso.</span></h2>
          <p className="text-slate-500 font-bold text-lg max-w-2xl mx-auto">
            Simples, divertido e focado em resultados. Veja como o GênioPlay transforma a rotina de estudos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Linhas Conectoras (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />

          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative z-10 bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none space-y-6 text-center"
            >
              <div className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center mx-auto shadow-lg`}>
                {step.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
              {idx < 2 && (
                <div className="md:hidden flex justify-center py-4">
                   <ArrowRight className="text-slate-300 rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
