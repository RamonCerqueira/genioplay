'use client';

import React from 'react';
import { BrainCircuit, Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-xl shadow-blue-500/20">
                <BrainCircuit size={28} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">Gênio<span className="text-blue-600">Play</span></span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-sm">
              Transformando o tempo de tela em aprendizado real. A plataforma definitiva para famílias que buscam educação de elite e diversão gamificada.
            </p>
            <div className="flex items-center gap-4">
               {[Instagram, Linkedin, Twitter, Github].map((Icon, idx) => (
                 <a key={idx} href="#" className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all">
                    <Icon size={20} />
                 </a>
               ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Plataforma</h4>
            <ul className="space-y-4">
              {['Sobre Nós', 'Benefícios', 'Planos', 'Metodologia'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Suporte</h4>
            <ul className="space-y-4">
              {['Centro de Ajuda', 'Contato', 'FAQs', 'Comunidade'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Legal</h4>
            <ul className="space-y-4">
              {['Termos de Uso', 'Privacidade', 'Segurança', 'Cookies'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
            © 2026 GênioPlay. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-2 text-xs font-black text-emerald-500 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Sistemas Online
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Feito por DevTec</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
