import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ShieldCheck, CheckCircle2, Crown, Zap, Settings, CreditCard } from 'lucide-react';

export default async function SubscriptionPage() {
  const session = await getSession();

  // Apenas guardiões podem ver a página de assinatura
  if (!session || session.user.role !== 'GUARDIAN') {
    redirect('/dashboard');
  }

  // Buscar usuário para saber o status atual
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true }
  });

  const isPro = user?.subscription?.status === 'PREMIUM';

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-800 dark:text-white flex items-center gap-4">
            <CreditCard className="text-blue-600" size={40} /> Minha Assinatura
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">
            Gerencie seu plano e garanta o melhor para o aprendizado do seu filho.
          </p>
        </div>
      </div>

      {/* Status Atual */}
      <div className="premium-card bg-white dark:bg-slate-900 border-none shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-xl ${isPro ? 'bg-gradient-to-br from-orange-400 to-amber-600 shadow-amber-500/30' : 'bg-slate-200 dark:bg-slate-800 shadow-slate-500/10'}`}>
            {isPro ? <Crown size={40} /> : <ShieldCheck size={40} className="text-slate-400" />}
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Plano Atual</p>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white">
              {isPro ? 'GênioPlay PRO' : 'GênioPlay Básico'}
            </h2>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-2">
              {isPro ? 'Acesso total liberado para toda família.' : 'Acesso limitado às missões diárias gratuitas.'}
            </p>
          </div>
        </div>

        {isPro && (
          <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2 font-black">
            <CheckCircle2 size={20} /> Assinatura Ativa
          </div>
        )}
      </div>

      {/* Planos */}
      {!isPro && (
        <div className="grid md:grid-cols-2 gap-8 pt-8">
          {/* Plano Free - Disabled State */}
          <div className="premium-card p-8 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-70">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Plano Básico</h3>
            <div className="text-3xl font-black text-slate-400 mb-8">Grátis</div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-500 font-bold"><CheckCircle2 size={18} /> 1 Missão por dia</li>
              <li className="flex items-center gap-3 text-slate-500 font-bold"><CheckCircle2 size={18} /> Relatórios básicos</li>
              <li className="flex items-center gap-3 text-slate-500 font-bold"><CheckCircle2 size={18} /> Acesso à loja</li>
            </ul>
            <button disabled className="w-full py-4 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-500 font-black uppercase tracking-widest cursor-not-allowed">
              Plano Atual
            </button>
          </div>

          {/* Plano PRO - Upgrade */}
          <div className="premium-card p-1 relative border-transparent bg-gradient-to-br from-blue-600 to-indigo-600 overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            <div className="bg-white dark:bg-slate-900 h-full w-full rounded-[2.3rem] p-8 relative z-10 flex flex-col">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 w-fit">
                <Crown size={12} /> Recomendado
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">GênioPlay PRO</h3>
              <div className="text-5xl font-black text-slate-800 dark:text-white mb-8">
                R$39<span className="text-lg text-slate-400">/mês</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-bold"><Zap size={18} className="text-amber-500" /> Missões ilimitadas geradas por IA</li>
                <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-bold"><Zap size={18} className="text-amber-500" /> Tutor IA disponível 24h</li>
                <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-bold"><Zap size={18} className="text-amber-500" /> Adicione múltiplos filhos</li>
                <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-bold"><Zap size={18} className="text-amber-500" /> Relatórios profundos de performance</li>
              </ul>

              <UpgradeButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Client component for the payment action
import { UpgradeButton } from './UpgradeButton';
