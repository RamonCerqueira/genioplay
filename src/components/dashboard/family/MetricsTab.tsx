'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface MetricsTabProps {
  studentId: string;
}

export const MetricsTab = ({ studentId }: MetricsTabProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="premium-card p-20 text-center space-y-8 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50">
        <div className="w-28 h-28 bg-indigo-50 dark:bg-indigo-900/30 rounded-[2rem] flex items-center justify-center mx-auto text-indigo-600 shadow-inner">
          <BarChart3 size={56} />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">Análise de Performance</h2>
          <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
            Estamos processando os dados de aprendizado para gerar gráficos de evolução detalhados. Em breve você verá o progresso em tempo real por disciplina.
          </p>
        </div>
        <div className="pt-4">
          <Link 
            href={`/dashboard/reports?studentId=${studentId}`} 
            className="btn-primary px-12 py-4.5 text-lg shadow-xl shadow-blue-500/20 inline-flex items-center gap-3"
          >
            Ver Boletim Completo
          </Link>
        </div>
      </div>
    </div>
  );
};
