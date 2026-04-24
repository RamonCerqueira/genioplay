'use client';

import React from 'react';
import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="py-20 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
        <div className="flex items-center justify-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <BrainCircuit size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-800">EduTrack</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left max-w-4xl mx-auto border-y border-slate-100 py-12">
          <div className="space-y-4">
            <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest">Plataforma</h4>
            <ul className="space-y-2 text-sm font-bold text-slate-400">
              <li><Link href="#about" className="hover:text-blue-600 transition-colors">Sobre Nós</Link></li>
              <li><Link href="#beneficios" className="hover:text-blue-600 transition-colors">Benefícios</Link></li>
              <li><Link href="#precos" className="hover:text-blue-600 transition-colors">Planos</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest">Suporte</h4>
            <ul className="space-y-2 text-sm font-bold text-slate-400">
              <li><Link href="/help" className="hover:text-blue-600 transition-colors">Centro de Ajuda</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contato</Link></li>
              <li><Link href="/help" className="hover:text-blue-600 transition-colors">FAQs</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest">Legal</h4>
            <ul className="space-y-2 text-sm font-bold text-slate-400">
              <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Termos de Uso</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacidade</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Cookies</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest">Social</h4>
            <ul className="space-y-2 text-sm font-bold text-slate-400">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <p className="text-slate-400 font-bold max-w-sm mx-auto pt-8">
          © 2024 EduTrack. Todos os direitos reservados. Feito para famílias focadas no futuro.
        </p>
      </div>
    </footer>
  );
}
