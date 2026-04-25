'use client';

import React, { useState } from 'react';
import { HelpCircle, MessageSquare, ChevronRight, Search, BookOpen, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HelpCenterPage() {
  const [step, setStep] = useState<'FAQ' | 'TICKET' | 'SUCCESS'>('FAQ');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [ticketData, setTicketData] = useState({ subject: '', message: '' });

  const faqs = [
    { q: 'Como cadastro meu filho?', a: 'Vá em "Gestão da Família" e clique em "Novo Filho". Preencha os dados e a série escolar.' },
    { q: 'O que são as GênioCoins?', a: 'São moedas virtuais que seu filho ganha ao completar missões e lições. Elas podem ser trocadas por recompensas que VOCÊ define.' },
    { q: 'Como funciona o Anti-Cheat?', a: 'O GênioPlay monitora se o aluno sai da aba ou tenta usar outras ferramentas durante a lição, emitindo um alerta para você no dashboard.' },
    { q: 'Posso trocar a série do conteúdo?', a: 'Sim! No Gerador de Conteúdo, você pode alterar a série antes de gerar a atividade, ideal para reforço escolar.' },
  ];

  const handleOpenTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/support/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });
      if (res.ok) setStep('SUCCESS');
    } catch (err) {
      alert('Erro ao enviar chamado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-800 dark:text-white">Central de Ajuda <span className="text-blue-600">GênioPlay</span></h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold">Como podemos ajudar você hoje?</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'FAQ' && (
          <motion.div
            key="faq"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
              <input 
                type="text" 
                placeholder="Busque por sua dúvida..." 
                className="input-field pl-16 py-6 text-lg shadow-xl shadow-slate-200/20"
                value={search}
                onChange={(e) => setSearch(search)}
              />
            </div>

            {/* Top FAQs */}
            <div className="grid gap-4">
               {faqs.map((faq, i) => (
                 <div key={i} className="premium-card p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-200 transition-all group cursor-default">
                    <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-3">
                       <HelpCircle size={18} className="text-blue-600" /> {faq.q}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 font-bold leading-relaxed">{faq.a}</p>
                 </div>
               ))}
            </div>

            {/* Support CTA */}
            <div className="premium-card p-10 bg-blue-600 text-white border-none shadow-2xl shadow-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
               <div className="space-y-2">
                  <h2 className="text-2xl font-black">Não encontrou o que precisava?</h2>
                  <p className="text-blue-100 font-bold">Abra um chamado direto com nossa equipe de suporte.</p>
               </div>
               <button 
                onClick={() => setStep('TICKET')}
                className="bg-white text-blue-600 px-10 py-4 rounded-[1.5rem] font-black text-lg hover:scale-105 transition-all flex items-center gap-3"
               >
                 Abrir Ticket <MessageSquare size={20} />
               </button>
            </div>
          </motion.div>
        )}

        {step === 'TICKET' && (
          <motion.div
            key="ticket"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="premium-card p-10 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-3xl"
          >
            <div className="flex items-center gap-4 mb-8">
               <button onClick={() => setStep('FAQ')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <ChevronRight className="rotate-180 text-slate-400" size={24} />
               </button>
               <h2 className="text-2xl font-black text-slate-800 dark:text-white">Abrir Novo Chamado</h2>
            </div>

            <form onSubmit={handleOpenTicket} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Assunto</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Ex: Dúvida sobre pagamento" 
                    required 
                    value={ticketData.subject}
                    onChange={(e) => setTicketData({...ticketData, subject: e.target.value})}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Sua Mensagem</label>
                  <textarea 
                    className="input-field min-h-[200px] py-4" 
                    placeholder="Descreva detalhadamente como podemos ajudar..." 
                    required
                    value={ticketData.message}
                    onChange={(e) => setTicketData({...ticketData, message: e.target.value})}
                  />
               </div>
               <button type="submit" disabled={loading} className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : (
                    <>
                      Enviar para Suporte <Send size={20} />
                    </>
                  )}
               </button>
               <p className="text-center text-xs text-slate-400 font-bold">Tempo médio de resposta: 4h úteis</p>
            </form>
          </motion.div>
        )}

        {step === 'SUCCESS' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="premium-card p-16 text-center space-y-6"
          >
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
               <CheckCircle2 size={56} />
            </div>
            <div className="space-y-2">
               <h2 className="text-3xl font-black text-slate-800 dark:text-white">Chamado Enviado!</h2>
               <p className="text-slate-500 dark:text-slate-400 font-bold max-w-sm mx-auto">
                  Seu ticket foi gerado com sucesso. Você receberá a resposta diretamente no seu e-mail de cadastro.
               </p>
            </div>
            <button 
              onClick={() => setStep('FAQ')}
              className="btn-primary px-12"
            >
              Voltar à Central
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
