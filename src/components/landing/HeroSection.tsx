'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Trophy } from 'lucide-react';
import HeroAnimation from './HeroAnimation';

export default function HeroSection() {
  return (
    <section className="pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <Star className="text-blue-600 fill-blue-600" size={16} />
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">O Futuro da Educação Familiar</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-800 leading-[1.1]">
            Trabalhe tranquilo enquanto seu filho <span className="text-gradient-blue">estuda de verdade.</span>
          </h1>
          <p className="text-xl text-slate-500 font-bold leading-relaxed max-w-xl">
            Chega de brigar pelo tempo de tela. O EduTrack usa IA e gamificação para garantir foco total, gerando relatórios automáticos para você.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/25 active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto !text-lg">
              Garantir Foco do meu Filho
              <ChevronRight size={20} />
            </Link>
            <div className="flex items-center gap-4 px-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                ))}
              </div>
              <p className="text-sm font-bold text-slate-400">+2.000 pais confiam</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <HeroAnimation />
          
          {/* Floating UI elements */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-10 -right-10 premium-card p-6 border-blue-100 hidden md:block"
          >
            <div className="flex items-center gap-3">
              <Trophy className="text-orange-500" size={24} />
              <div>
                <p className="text-xs font-black text-slate-400">Meta Batida!</p>
                <p className="text-lg font-black text-slate-800">+50 🪙</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
