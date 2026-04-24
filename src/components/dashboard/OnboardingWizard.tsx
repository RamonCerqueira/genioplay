'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, UserPlus, Gift, Rocket, CheckCircle2 } from 'lucide-react';
import ConnectChild from './ConnectChild';

export default function OnboardingWizard({ guardianId, guardianName }: { guardianId: string, guardianName: string }) {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/20 overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-slate-100">
           <motion.div 
             className="h-full bg-blue-600"
             animate={{ width: `${(step / 3) * 100}%` }}
           />
        </div>

        <div className="p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 text-center"
              >
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto animate-bounce">
                   <Rocket size={40} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-slate-800">Olá, {guardianName}! 👋</h2>
                  <p className="text-lg text-slate-500 font-bold max-w-md mx-auto">
                    Estamos felizes em ter você aqui. Vamos configurar o EduTrack para sua família em menos de 1 minuto?
                  </p>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="btn-primary w-full py-5 !text-lg"
                >
                  Vamos Começar!
                  <ArrowRight size={24} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                   <h3 className="text-2xl font-black text-slate-800">Passo 1: Seu Primeiro Aluno</h3>
                   <p className="text-slate-500 font-bold">Conecte o perfil do seu filho para monitorar o foco.</p>
                </div>
                
                {/* Reutilizamos o componente ConnectChild mas simplificado ou direto */}
                <ConnectChild guardianId={guardianId} />

                <div className="flex justify-center">
                   <button onClick={() => setStep(3)} className="text-slate-400 font-black text-sm hover:text-blue-600 transition-colors">
                      Pular este passo por enquanto
                   </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 text-center"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto">
                   <CheckCircle2 size={40} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-slate-800">Tudo Pronto! 🚀</h2>
                  <p className="text-slate-500 font-bold max-w-sm mx-auto">
                    Agora você já pode acompanhar o progresso e gerar conteúdos incríveis com nossa IA.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center gap-4 text-left">
                   <div className="bg-blue-600 p-3 rounded-2xl text-white">
                      <Gift size={24} />
                   </div>
                   <div>
                      <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Dica Premium</p>
                      <p className="text-sm font-bold text-slate-700">Não esqueça de cadastrar os Prêmios Reais na aba "Recompensas"!</p>
                   </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full py-5"
                >
                  Ir para o Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
