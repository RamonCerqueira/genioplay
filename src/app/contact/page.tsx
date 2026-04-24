'use client';

import React from 'react';
import LandingNav from '@/components/layout/LandingNav';
import LandingFooter from '@/components/layout/LandingFooter';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
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
              <h1 className="text-5xl font-black text-slate-800">Estamos aqui para <span className="text-gradient-blue">te ouvir.</span></h1>
              <p className="text-xl text-slate-500 font-bold leading-relaxed">
                Tem alguma dúvida, sugestão ou precisa de suporte técnico? Entre em contato por um de nossos canais.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Mail, label: "E-mail", value: "suporte@edutrack.com.br" },
                { icon: Phone, label: "WhatsApp", value: "+55 (11) 99999-9999" },
                { icon: MessageSquare, label: "Chat", value: "Disponível no Dashboard" },
                { icon: MapPin, label: "Sede", value: "São Paulo, SP - Brasil" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-lg font-bold text-slate-700">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="premium-card p-10 bg-slate-50/50 border-slate-100"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nome</label>
                  <input type="text" placeholder="Seu nome" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Sobrenome</label>
                  <input type="text" placeholder="Seu sobrenome" className="input-field" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">E-mail</label>
                <input type="email" placeholder="seu@email.com" className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mensagem</label>
                <textarea placeholder="Como podemos ajudar?" className="input-field min-h-[150px] resize-none" />
              </div>
              <button type="submit" className="btn-primary w-full">
                Enviar Mensagem
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
