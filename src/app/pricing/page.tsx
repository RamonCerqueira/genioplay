'use client';

import React, { useState } from 'react';
import { Check, Sparkles, ShieldCheck, Zap, Star, Users, BrainCircuit, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Básico',
      price: 'R$ 0',
      description: 'Ideal para experimentar a potência da IA.',
      features: [
        '1 Estudante (Filho)',
        'Gerador de IA Básico',
        'Limite de 3 lições/mês',
        'Relatórios Simples',
      ],
      cta: 'Começar Grátis',
      premium: false,
    },
    {
      name: 'Premium Pro',
      price: billingCycle === 'monthly' ? 'R$ 47,90' : 'R$ 39,90',
      period: '/mês',
      description: 'O controle total para pais que não aceitam menos que o topo.',
      features: [
        'Filhos ILIMITADOS',
        'IA Profunda (Explicações e Exemplos)',
        'Anti-Cheat (Rastreamento de Foco)',
        'Relatórios de Erros/Acertos Detalhados',
        'Suporte prioritário via WhatsApp',
        'Atribuição em Massa (Para todos os filhos)',
      ],
      cta: 'Garantir Futuro do meu Filho',
      premium: true,
      badge: 'MAIS VENDIDO',
    }
  ];

  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment/mercado-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: billingCycle === 'monthly' ? 'premium_monthly' : 'premium_yearly',
          price: billingCycle === 'monthly' ? 47.90 : 478.80 // Exemplo de valor
        })
      });

      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Erro ao processar pagamento. Tente novamente.');
      }
    } catch (err) {
      alert('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-800"
        >
          <Sparkles className="text-blue-600" size={16} />
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Invista no que importa</span>
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white">Planos que cabem na sua <span className="text-gradient-blue">ambição.</span></h1>
        <p className="text-slate-500 font-bold text-xl max-w-2xl mx-auto">
          Escolha o plano ideal para transformar o tempo de tela do seu filho em conhecimento real com o GênioPlay.
        </p>

        {/* Toggle Faturamento */}
        <div className="flex items-center justify-center gap-4 pt-8">
          <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>Mensal</span>
          <button 
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-8 bg-blue-600 rounded-full relative p-1 transition-all"
          >
            <motion.div 
              animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
              className="w-6 h-6 bg-white rounded-full shadow-lg"
            />
          </button>
          <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>Anual (20% OFF)</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -10 }}
            className={`relative p-10 rounded-[3rem] border-2 transition-all ${
              plan.premium 
                ? 'border-blue-600 bg-white dark:bg-slate-900 shadow-2xl shadow-blue-500/20 z-10' 
                : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-6 py-2 rounded-full shadow-lg">
                {plan.badge}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">{plan.name}</h3>
                <p className="text-slate-500 font-bold mt-2 text-sm">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-slate-800 dark:text-white">{plan.price}</span>
                <span className="text-slate-400 font-bold">{plan.period}</span>
              </div>

              <div className="space-y-4 py-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${plan.premium ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                      <Check size={14} strokeWidth={4} />
                    </div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={plan.premium ? handleSubscribe : undefined}
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                plan.premium 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:bg-blue-700' 
                  : 'bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-50'
              }`}>
                {loading && plan.premium ? <Loader2 className="animate-spin" size={24} /> : plan.cta}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Social Proof Section */}
      <div className="max-w-4xl mx-auto bg-slate-50 dark:bg-slate-900/50 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 grid md:grid-cols-3 gap-8 text-center">
         <div className="space-y-2">
            <Users className="mx-auto text-blue-600" size={32} />
            <p className="text-2xl font-black text-slate-800 dark:text-white">2.4k+</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pais Ativos</p>
         </div>
         <div className="space-y-2">
            <BrainCircuit className="mx-auto text-blue-600" size={32} />
            <p className="text-2xl font-black text-slate-800 dark:text-white">150k+</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lições Geradas</p>
         </div>
         <div className="space-y-2">
            <ShieldCheck className="mx-auto text-blue-600" size={32} />
            <p className="text-2xl font-black text-slate-800 dark:text-white">100%</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Seguro para Crianças</p>
         </div>
      </div>
    </div>
  );
}
