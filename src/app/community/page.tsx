'use client';

import React from 'react';
import LandingNav from '@/components/layout/LandingNav';
import LandingFooter from '@/components/layout/LandingFooter';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Share2, Award, Zap, Heart } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-500">
      <LandingNav />
      
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto space-y-24">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-full border border-rose-100 dark:border-rose-800">
               <Heart className="text-rose-500" size={16} />
               <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Você não está sozinho</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white leading-tight">
              Uma Família de <span className="text-blue-600">Gênios.</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed">
              Junte-se a milhares de pais que estão compartilhando estratégias, vitórias e construindo o futuro da educação juntos.
            </p>
          </motion.div>

          {/* Channels Grid */}
          <div className="grid md:grid-cols-3 gap-8">
             {[
               {
                 icon: MessageCircle,
                 title: "Grupos VIP",
                 desc: "Acesse nossos grupos de WhatsApp e Telegram exclusivos para assinantes Pro. Troque experiências em tempo real.",
                 action: "Entrar nos Grupos",
                 color: "bg-emerald-500"
               },
               {
                 icon: Share2,
                 title: "Fórum de Estratégias",
                 desc: "Descubra como outros pais estão configurando as recompensas reais e motivando seus filhos a estudarem mais.",
                 action: "Ver Discussões",
                 color: "bg-blue-600"
               },
               {
                 icon: Award,
                 title: "Ranking de Pais",
                 desc: "Participe de desafios mensais e ganhe selos exclusivos de 'Mentor de Elite' para exibir no seu perfil.",
                 action: "Ver Ranking",
                 color: "bg-purple-600"
               }
             ].map((item, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="premium-card p-10 bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 flex flex-col items-center text-center space-y-6 group"
               >
                 <div className={`${item.color} text-white p-5 rounded-2xl shadow-lg shadow-blue-500/10 group-hover:rotate-12 transition-transform`}>
                    <item.icon size={32} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-800 dark:text-white">{item.title}</h3>
                 <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed">{item.desc}</p>
                 <button className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline pt-4">
                    {item.action}
                 </button>
               </motion.div>
             ))}
          </div>

          {/* Social Proof Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-center space-y-10 relative overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
             <div className="relative z-10 space-y-6">
                <h2 className="text-4xl md:text-5xl font-black text-white">Juntos somos <span className="text-blue-500">mais fortes.</span></h2>
                <p className="text-slate-400 font-bold text-xl max-w-2xl mx-auto italic">
                  "O GênioPlay mudou a dinâmica da minha casa. Através da comunidade, aprendi a usar a IA para temas que eu nem sabia como explicar."
                </p>
                <div className="flex items-center justify-center gap-4">
                   <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-blue-600 overflow-hidden">
                      <img src="https://i.pravatar.cc/150?u=12" alt="Avatar" />
                   </div>
                   <div className="text-left">
                      <p className="font-black text-white text-lg">Ricardo Santos</p>
                      <p className="text-blue-500 font-bold text-xs uppercase tracking-widest">Pai de 2 Gênios</p>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
