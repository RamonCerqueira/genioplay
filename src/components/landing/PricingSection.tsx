'use client';

import React from 'react';
import { Check } from 'lucide-react';

export default function PricingSection() {
  return (
    <section id="precos" className="py-32">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-slate-800">Planos que cabem no futuro deles</h2>
          <p className="text-lg text-slate-500 font-bold text-center">Comece grátis e evolua quando sentir os resultados.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="premium-card p-12 text-left space-y-8 border-slate-100">
            <div>
              <h3 className="text-2xl font-black text-slate-800">Plano Gratuito</h3>
              <p className="text-slate-400 font-bold">Essencial para começar</p>
            </div>
            <div className="text-5xl font-black text-slate-800">R$ 0<span className="text-lg font-bold text-slate-400">/mês</span></div>
            <ul className="space-y-4">
              {["1 Filho conectado", "Pomodoro Básico", "Gestão de Recompensas", "3 Quizzes por dia"].map(f => (
                <li key={f} className="flex items-center gap-3 text-slate-500 font-bold">
                  <Check className="text-emerald-500" size={18} /> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 rounded-2xl border-2 border-slate-100 font-black text-slate-800 hover:bg-slate-50 transition-all">
              Começar Grátis
            </button>
          </div>

          {/* Premium Plan */}
          <div className="premium-card p-12 text-left space-y-8 border-blue-100 bg-blue-50/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-3xl text-xs font-black uppercase tracking-widest">
              Recomendado
            </div>
            <div>
              <h3 className="text-2xl font-black text-blue-600">Premium IA</h3>
              <p className="text-slate-400 font-bold">Para foco total e resultados rápidos</p>
            </div>
            <div className="text-5xl font-black text-slate-800">R$ 49<span className="text-lg font-bold text-slate-400">,90/mês</span></div>
            <ul className="space-y-4">
              {[
                "Até 5 Filhos", 
                "IA de Geração de Conteúdo Ilimitada", 
                "Relatórios via E-mail (Sexta-feira)", 
                "Anti-Cheat via WebSockets", 
                "Suporte Prioritário"
              ].map(f => (
                <li key={f} className="flex items-center gap-3 text-slate-800 font-black">
                  <Check className="text-blue-600" size={18} strokeWidth={3} /> {f}
                </li>
              ))}
            </ul>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/40 active:scale-95 flex items-center justify-center gap-2 w-full">
              Assinar Premium IA
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
