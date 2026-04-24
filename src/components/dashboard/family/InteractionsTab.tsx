'use client';

import React from 'react';
import { MessageSquare, Brain } from 'lucide-react';

interface InteractionsTabProps {
  studentName: string;
}

export const InteractionsTab = ({ studentName }: InteractionsTabProps) => {
  // Mock de dados (No futuro virá de uma API de logs de chat)
  const messages = [
    { role: 'user', content: 'O que é a gravidade?', time: 'Hoje às 10:15' },
    { role: 'assistant', content: 'É a força invisível que puxa tudo para o centro da Terra! Imagine um imã gigante... 🌍🧲', time: 'Hoje às 10:16' },
    { role: 'user', content: 'Por que a lua não cai?', time: 'Hoje às 10:20' },
    { role: 'assistant', content: 'Porque ela está se movendo muito rápido "de lado" enquanto a Terra a puxa. É um equilíbrio perfeito! 🌕✨', time: 'Hoje às 10:21' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="premium-card p-10 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
              <MessageSquare className="text-blue-600" size={32} />
              Conversas com Tutor Gênio
            </h2>
            <p className="text-sm font-bold text-slate-500 mt-1">Acompanhe as curiosidades e dúvidas de {studentName}.</p>
          </div>
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 text-[10px] font-black uppercase tracking-widest">
            Auditoria Parental
          </div>
        </div>

        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 scrollbar-hide">
          {messages.map((chat, i) => (
            <div key={i} className={`flex flex-col ${chat.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] p-5 rounded-3xl text-sm font-bold shadow-sm ${
                chat.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-800'
              }`}>
                {chat.content}
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-2 px-2 uppercase tracking-widest">{chat.time}</span>
            </div>
          ))}
        </div>

        {/* AI Insight Card */}
        <div className="mt-12 p-8 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/30 flex items-center gap-8">
          <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-500/10">
            <Brain size={40} />
          </div>
          <div>
            <h4 className="text-xl font-black text-slate-800 dark:text-white">Relatório de Interesse</h4>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {studentName} está muito interessado em **Física Espacial** esta semana. Que tal assistirem um documentário sobre planetas juntos? 🚀🪐
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
