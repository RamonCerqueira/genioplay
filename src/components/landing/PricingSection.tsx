'use client';

import React, { useState } from 'react';
import { Check, ShieldCheck, Zap, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link'

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="precos" className="py-40 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800"
          >
            <ShieldCheck size={14} /> Investimento Seguro
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">
            Planos para o <span className="text-blue-600">sucesso</span> deles.
          </h2>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Mensal</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-8 bg-slate-200 dark:bg-slate-800 rounded-full p-1 relative transition-colors"
            >
              <motion.div
                animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
                className="w-6 h-6 bg-blue-600 rounded-full shadow-lg"
              />
            </button>
            <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Anual (20% OFF)</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="premium-card p-12 bg-white dark:bg-slate-800 flex flex-col border-slate-100 dark:border-slate-700 shadow-xl"
          >
            <div className="mb-10">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">Explorador</h3>
              <p className="text-slate-400 font-bold mt-2">Perfeito para conhecer a plataforma</p>
            </div>

            <div className="mb-10">
              <span className="text-6xl font-black text-slate-900 dark:text-white">Grátis</span>
            </div>

            <ul className="space-y-5 mb-12 flex-1">
              {[
                "1 Filho conectado",
                "Pomodoro Educativo Básico",
                "Gestão de Recompensas",
                "3 Quizzes por dia",
                "Métricas Simples de Estudo"
              ].map(f => (
                <li key={f} className="flex items-start gap-3 text-slate-500 dark:text-slate-400 font-bold text-sm">
                  <Check className="text-emerald-500 shrink-0" size={18} /> {f}
                </li>
              ))}
            </ul>

            <button className="w-full py-5 rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-700 font-black text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-lg">
              Começar Agora
            </button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="premium-card p-12 bg-white dark:bg-slate-800 flex flex-col border-blue-100 dark:border-blue-900 relative overflow-hidden shadow-2xl shadow-blue-500/10 ring-2 ring-blue-600/10"
          >
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-8 py-3 rounded-bl-[2rem] text-[10px] font-black uppercase tracking-widest shadow-lg">
              Mais Popular
            </div>

            <div className="mb-10">
              <h3 className="text-2xl font-black text-blue-600 flex items-center gap-2">
                Premium IA <Sparkles size={20} />
              </h3>
              <p className="text-slate-400 font-bold mt-2">Acelerador de Resultados</p>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-400">R$</span>
                <span className="text-6xl font-black text-slate-900 dark:text-white">
                  {billingCycle === 'monthly' ? '49,90' : '39,90'}
                </span>
                <span className="text-lg font-bold text-slate-400">/mês</span>
              </div>
              {billingCycle === 'yearly' && (
                <p className="text-xs font-black text-emerald-500 mt-2 uppercase tracking-widest">Cobrado anualmente</p>
              )}
            </div>

            <ul className="space-y-5 mb-12 flex-1">
              {[
                "Filhos Ilimitados",
                "Tutor de IA (Gemini 1.5) Ilimitado",
                "Anti-Cheat via WebSockets 360°",
                "Relatórios de Performance em PDF",
                "Suporte Prioritário 24/7",
                "GênioCoins em Dobro"
              ].map(f => (
                <li key={f} className="flex items-start gap-3 text-slate-900 dark:text-slate-200 font-black text-sm">
                  <Check className="text-blue-600 shrink-0" size={18} strokeWidth={3} /> {f}
                </li>
              ))}
            </ul>

            <button className="group relative bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-8 rounded-[1.5rem] transition-all duration-300 shadow-xl shadow-blue-500/40 active:scale-95 flex items-center justify-center gap-3 w-full text-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              Assinar Premium
              <Zap size={20} fill="currentColor" />
            </button>

            <p className="text-center mt-6 text-[10px] font-bold text-slate-400 flex items-center justify-center gap-2">
              <ShieldCheck size={12} /> 7 dias de garantia incondicional
            </p>
          </motion.div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-slate-400 font-bold flex items-center justify-center gap-2">
            Dúvidas sobre o plano ideal? <Link href="#contato" className="text-blue-600 hover:underline">Fale com um consultor</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
