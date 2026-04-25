'use client';

import React from 'react';
import LandingNav from '@/components/layout/LandingNav';
import LandingFooter from '@/components/layout/LandingFooter';
import { motion } from 'framer-motion';
import { Brain, Target, Zap, Award, BookOpen, BarChart3 } from 'lucide-react';

export default function MethodologyPage() {
  const steps = [
    {
      icon: Brain,
      title: "IA Adaptativa",
      desc: "Nossa inteligência artificial não apenas gera conteúdo, ela analisa o nível cognitivo e a série do aluno para criar desafios que estão exatamente na zona de desenvolvimento proximal.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: Target,
      title: "Foco Blindado",
      desc: "Utilizamos técnicas de micro-aprendizado. Lições curtas e intensas que mantêm a dopamina alta no aprendizado e baixa na distração.",
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      icon: Award,
      title: "Recompensa Real",
      desc: "A gamificação só funciona se houver valor. O aluno ganha GênioCoins que são trocados por recompensas reais definidas pelos pais, criando um ciclo de esforço e mérito.",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-500">
      <LandingNav />
      
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto space-y-24">
          
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white leading-tight">
              A Ciência por trás do <span className="text-blue-600">GênioPlay.</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-bold max-w-3xl mx-auto leading-relaxed">
              Não é apenas um jogo, é uma metodologia pedagógica validada para maximizar a retenção de conhecimento e o engajamento estudantil.
            </p>
          </motion.div>

          {/* Pillars Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-6"
              >
                <div className={`${step.bg} ${step.color} w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm`}>
                  <step.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Detailed Section */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                Baseado na BNCC
              </div>
              <h2 className="text-4xl font-black text-slate-800 dark:text-white leading-tight">
                Alinhamento Pedagógico de <span className="text-blue-600">Nível Nacional.</span>
              </h2>
              <div className="space-y-6">
                {[
                  { icon: BookOpen, title: "Curadoria de Temas", desc: "Todo conteúdo gerado pela IA segue as competências e habilidades exigidas pela Base Nacional Comum Curricular." },
                  { icon: BarChart3, title: "Avaliação Formativa", desc: "Monitoramos o desempenho em tempo real para sugerir revisões automáticas de temas onde o aluno teve dificuldade." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-slate-800 dark:text-white">{item.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="relative"
            >
               <div className="aspect-square bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-1 shadow-2xl rotate-3">
                  <div className="w-full h-full bg-slate-900 rounded-[2.8rem] flex items-center justify-center p-12 overflow-hidden">
                     <div className="text-center space-y-4">
                        <Zap size={60} className="text-blue-500 mx-auto animate-pulse" />
                        <h3 className="text-2xl font-black text-white italic">"A educação é a arma mais poderosa que você pode usar para mudar o mundo."</h3>
                        <p className="text-blue-400 font-bold">- Nelson Mandela</p>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
