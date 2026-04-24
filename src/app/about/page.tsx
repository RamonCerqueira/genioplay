'use client';

import React from 'react';
import LandingNav from '@/components/layout/LandingNav';
import LandingFooter from '@/components/layout/LandingFooter';
import { motion } from 'framer-motion';
import { Target, Heart, ShieldCheck, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <LandingNav />
      
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-20">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-black text-slate-800 leading-tight">
              Nossa Missão é <span className="text-gradient-blue">Transformar o Estudo.</span>
            </h1>
            <p className="text-xl text-slate-500 font-bold leading-relaxed max-w-2xl mx-auto">
              Nascemos da necessidade de equilibrar a tecnologia com o aprendizado real, devolvendo a tranquilidade aos pais e o foco aos alunos.
            </p>
          </motion.div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                icon: Target, 
                title: "Foco Absoluto", 
                desc: "Acreditamos que o aprendizado profundo só acontece com concentração total, longe das distrações digitais.",
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              { 
                icon: Heart, 
                title: "Empatia Familiar", 
                desc: "Entendemos as dores dos pais modernos e criamos uma ponte de confiança entre tecnologia e educação.",
                color: "text-rose-500",
                bg: "bg-rose-50"
              },
              { 
                icon: ShieldCheck, 
                title: "Ética Digital", 
                desc: "Segurança e privacidade são nossos pilares. Os dados dos seus filhos estão protegidos com o mais alto nível de criptografia.",
                color: "text-emerald-600",
                bg: "bg-emerald-50"
              },
              { 
                icon: Zap, 
                title: "Inovação IA", 
                desc: "Usamos inteligência artificial para personalizar o ensino, tornando-o mais eficiente e menos cansativo.",
                color: "text-orange-500",
                bg: "bg-orange-50"
              }
            ].map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="premium-card p-10 bg-white space-y-6"
              >
                <div className={`${value.bg} ${value.color} w-14 h-14 rounded-2xl flex items-center justify-center`}>
                  <value.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-slate-800">{value.title}</h3>
                <p className="text-slate-500 font-bold leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Vision Statement */}
          <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             className="premium-card p-12 bg-blue-600 text-white border-none shadow-blue-500/30 text-center"
          >
             <h2 className="text-3xl font-black mb-6">Onde queremos chegar</h2>
             <p className="text-lg font-bold opacity-90 leading-relaxed max-w-2xl mx-auto">
               Queremos ser a plataforma padrão para famílias que buscam excelência acadêmica no mundo digital, impactando milhões de estudantes em todo o Brasil.
             </p>
          </motion.div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
