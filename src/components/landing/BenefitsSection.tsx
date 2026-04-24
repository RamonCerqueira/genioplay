'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, BrainCircuit, Zap } from 'lucide-react';

const benefits = [
  { 
    icon: ShieldCheck, 
    title: "Anti-Cheat Inteligente", 
    desc: "Monitoramos o foco em tempo real. Se o aluno trocar de aba, o tempo pausa e você recebe um alerta.",
    color: "text-blue-600",
    bg: "bg-blue-100"
  },
  { 
    icon: BrainCircuit, 
    title: "IA Alinhada à Escola", 
    desc: "Geramos conteúdo personalizado baseado no que ele está aprendendo na sala de aula.",
    color: "text-indigo-600",
    bg: "bg-indigo-100"
  },
  { 
    icon: Zap, 
    title: "Gamificação Real", 
    desc: "O estudo gera moedas que ele troca por recompensas reais que VOCÊ define.",
    color: "text-orange-600",
    bg: "bg-orange-100"
  }
];

export default function BenefitsSection() {
  return (
    <section id="beneficios" className="py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-slate-800">
            Por que o EduTrack é o seu maior aliado?
          </h2>
          <p className="text-lg text-slate-500 font-bold">
            Unimos tecnologia de ponta com métodos pedagógicos comprovados.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="premium-card p-10 bg-white space-y-6"
            >
              <div className={`${item.bg} ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center`}>
                <item.icon size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-800">{item.title}</h3>
              <p className="text-slate-500 font-bold leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
