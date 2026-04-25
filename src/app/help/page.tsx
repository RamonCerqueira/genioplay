'use client';

import React, { useState } from 'react';
import LandingNav from '@/components/layout/LandingNav';
import LandingFooter from '@/components/layout/LandingFooter';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Rocket, Smartphone, ShieldCheck, CreditCard } from 'lucide-react';

const faq = [
  {
    category: "Primeiros Passos",
    icon: Rocket,
    questions: [
      { q: "Como conecto meu filho ao EduTrack?", a: "No dashboard do responsável, clique em 'Conectar Filho'. Você receberá um código de convite ou poderá criar uma conta diretamente para ele." },
      { q: "O EduTrack funciona em tablets?", a: "Sim! Somos uma PWA (Progressive Web App) otimizada para smartphones e tablets Android/iOS." }
    ]
  },
  {
    category: "Uso do Aluno",
    icon: Smartphone,
    questions: [
      { q: "Como funcionam as moedas virtuais?", a: "A cada ciclo de foco (Pomodoro) completado, o aluno ganha moedas. Moedas bônus podem ser ganhas ao acertar perguntas do quiz." },
      { q: "O cronômetro para se eu sair do app?", a: "Sim, o sistema anti-cheat detecta quando a aba perde o foco e pausa o cronômetro automaticamente." }
    ]
  },
  {
    category: "Segurança e IA",
    icon: ShieldCheck,
    questions: [
      { q: "Quais dados a IA coleta?", a: "A IA processa apenas os assuntos de estudo fornecidos pelo responsável para gerar conteúdo pedagógico. Não coletamos dados sensíveis fora do escopo educacional." }
    ]
  }
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-500">
      <LandingNav />
      
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white leading-tight">Centro de <span className="text-gradient-blue">Ajuda.</span></h1>
            <div className="relative max-w-xl mx-auto">
              <input type="text" placeholder="Como podemos te ajudar hoje?" className="input-field pl-14" />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-16">
            {faq.map((section, sIdx) => (
              <div key={sIdx} className="space-y-6">
                <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-xl">
                    <section.icon size={20} />
                  </div>
                  {section.category}
                </h2>
                
                <div className="space-y-4">
                  {section.questions.map((item, qIdx) => {
                    const id = `${sIdx}-${qIdx}`;
                    const isOpen = openIndex === id;
                    
                    return (
                      <div key={id} className={`premium-card transition-all ${isOpen ? 'border-blue-200 dark:border-blue-500/30 bg-blue-50/20 dark:bg-blue-900/10' : 'hover:border-slate-200 dark:hover:border-slate-700'}`}>
                        <button 
                          onClick={() => setOpenIndex(isOpen ? null : id)}
                          className="w-full p-6 flex items-center justify-between text-left"
                        >
                          <span className="font-bold text-slate-700 dark:text-slate-200">{item.q}</span>
                          <ChevronDown className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} size={20} />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Support CTA */}
          <div className="premium-card p-12 bg-slate-50 dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-6">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">Ainda tem dúvidas?</h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold">Nossa equipe de suporte está pronta para te ajudar de segunda a sexta.</p>
            <button onClick={() => window.location.href = '/contact'} className="btn-primary mx-auto">
              Falar com o Suporte
            </button>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
