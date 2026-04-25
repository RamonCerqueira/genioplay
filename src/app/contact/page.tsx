'use client';

import React, { useState } from 'react';
import LandingNav from '@/components/layout/LandingNav';
import LandingFooter from '@/components/layout/LandingFooter';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useNotify } from '@/components/ui/NotificationSystem';

export default function ContactPage() {
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    subject: 'Geral',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.name} ${formData.lastName}`,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      if (response.ok) {
        setSubmitted(true);
        notify({
          title: 'Mensagem Enviada!',
          message: 'Recebemos seu contato. Responderemos em breve no seu e-mail.',
          type: 'SUCCESS'
        });
      } else {
        throw new Error('Falha ao enviar');
      }
    } catch (error) {
      notify({
        title: 'Erro no Envio',
        message: 'Não conseguimos enviar sua mensagem agora. Tente novamente mais tarde.',
        type: 'WARNING'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-500">
      <LandingNav />
      
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Info Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <h1 className="text-5xl font-black text-slate-800 dark:text-white leading-tight">
                Estamos aqui para <span className="text-blue-600">te ouvir.</span>
              </h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                Tem alguma dúvida, sugestão ou precisa de suporte técnico? Entre em contato por um de nossos canais.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Mail, label: "E-mail", value: "suporte@genioplay.com.br" },
                { icon: Phone, label: "WhatsApp", value: "+55 (11) 99999-9999" },
                { icon: MessageSquare, label: "Chat", value: "Disponível no Dashboard" },
                { icon: MapPin, label: "Sede", value: "Brasil" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center border border-slate-100 dark:border-slate-800">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-50/50 dark:bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Seu nome" 
                        className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sobrenome</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Seu sobrenome" 
                        className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail</label>
                    <input 
                      type="email" 
                      required
                      placeholder="seu@email.com" 
                      className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mensagem</label>
                    <textarea 
                      required
                      placeholder="Como podemos ajudar?" 
                      className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm min-h-[150px] resize-none focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full py-5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Enviar Mensagem</>}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white">Mensagem Enviada!</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold mt-2">
                      Obrigado pelo contato, {formData.name}. <br /> Responderemos o mais rápido possível.
                    </p>
                  </div>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline"
                  >
                    Enviar outra mensagem
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
