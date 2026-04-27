'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  BrainCircuit, 
  Zap, 
  BarChart3, 
  Bot, 
  Target 
} from 'lucide-react';

const benefits = [
  { 
    icon: Target, 
    title: "Meta Épica em Família", 
    desc: "Transforme grandes sonhos em realidade através de um mosaico interativo. Cada lição concluída revela uma peça do prêmio final.",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/20"
  },
  { 
    icon: Bot, 
    title: "Mentor IA para Pais", 
    desc: "Não apenas dados, mas conselhos. Nossa IA analisa o perfil do seu filho e sugere ações proativas para melhorar o aprendizado.",
    color: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-900/20"
  },
  { 
    icon: Zap, 
    title: "Modo Hyperfocus", 
    desc: "Dispare desafios relâmpago do seu celular. Motivação instantânea com bônus de XP e moedas em dobro por tempo limitado.",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20"
  },
  { 
    icon: ShieldCheck, 
    title: "Anti-Cheat Inteligente", 
    desc: "Foco total garantido. O sistema detecta distrações e bloqueia o progresso se o aluno sair da zona de estudo.",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20"
  },
  { 
    icon: BarChart3, 
    title: "Boletim Gênio", 
    desc: "Relatórios de elite com métricas de proficiência (ELO) por matéria, tempo de foco e evolução histórica detalhada.",
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-900/20"
  },
  { 
    icon: BrainCircuit, 
    title: "IA Adaptativa", 
    desc: "O conteúdo se molda ao ritmo do aluno, focando nas lacunas de conhecimento para um aprendizado sem frustrações.",
    color: "text-cyan-600",
    bg: "bg-cyan-50 dark:bg-cyan-900/20"
  }
];

export default function BenefitsSection() {
  return (
    <section id="beneficios" className="py-40 relative overflow-hidden bg-white dark:bg-slate-900">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800"
          >
            Vantagens Exclusivas
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">
            Tecnologia que <span className="text-blue-600">transforma</span> a rotina.
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto">
            Saia do ciclo de brigas pelo celular e entre na era da educação inteligente, onde cada minuto de tela é um investimento.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="premium-card group p-10 bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-500"
            >
              <div className={`${item.bg} ${item.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                <item.icon size={36} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
