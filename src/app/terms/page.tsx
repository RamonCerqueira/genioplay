'use client';

import React, { useState } from 'react';
import LandingNav from '@/components/layout/LandingNav';
import LandingFooter from '@/components/layout/LandingFooter';
import { motion } from 'framer-motion';

const content = {
  terms: {
    title: "Termos de Uso",
    updated: "23 de Abril de 2024",
    body: [
      { h: "1. Aceitação dos Termos", p: "Ao acessar e usar o EduTrack, você concorda em cumprir estes Termos de Uso. Se você não concordar, não utilize o serviço." },
      { h: "2. Descrição do Serviço", p: "O EduTrack é uma ferramenta de auxílio ao estudo gamificada que utiliza IA para geração de conteúdo e monitoramento de foco." },
      { h: "3. Responsabilidades do Usuário", p: "Os pais são responsáveis pela supervisão do uso da plataforma por seus filhos e pela configuração das recompensas reais." }
    ]
  },
  privacy: {
    title: "Política de Privacidade",
    updated: "23 de Abril de 2024",
    body: [
      { h: "1. Coleta de Dados", p: "Coletamos dados básicos como nome, e-mail e progresso acadêmico para personalizar a experiência de estudo." },
      { h: "2. Uso de IA", p: "Nossa IA processa temas de estudo de forma anônima para gerar material didático. Não vendemos dados para terceiros." },
      { h: "3. Segurança", p: "Utilizamos protocolos de criptografia de ponta a ponta para proteger as informações da sua família." }
    ]
  }
};

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <div className="bg-white min-h-screen">
      <LandingNav />
      
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <button 
              onClick={() => setActiveTab('terms')}
              className={`w-full p-4 rounded-2xl text-left font-black transition-all ${activeTab === 'terms' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              Termos de Uso
            </button>
            <button 
              onClick={() => setActiveTab('privacy')}
              className={`w-full p-4 rounded-2xl text-left font-black transition-all ${activeTab === 'privacy' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              Privacidade
            </button>
          </div>

          {/* Content */}
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 space-y-8"
          >
            <div>
              <h1 className="text-4xl font-black text-slate-800 mb-2">{content[activeTab].title}</h1>
              <p className="text-sm font-bold text-slate-400">Última atualização: {content[activeTab].updated}</p>
            </div>

            <div className="prose prose-slate max-w-none space-y-10">
              {content[activeTab].body.map((item, i) => (
                <div key={i} className="space-y-3">
                  <h3 className="text-xl font-black text-slate-700">{item.h}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.p}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
