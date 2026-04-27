'use client';

import React, { useState } from 'react';
import { Zap, Timer, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function HyperfocusControl({ studentId }: { studentId: string }) {
  const [loading, setLoading] = useState(false);
  const [activeUntil, setActiveUntil] = useState<Date | null>(null);

  const handleActivate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/guardian/hyperfocus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      });
      const data = await res.json();
      if (data.success) {
        setActiveUntil(new Date(data.hyperfocusUntil));
      } else if (data.code === 'PREMIUM_REQUIRED') {
        alert("Esta é uma função Premium! Assine para desbloquear o Modo Hyperfocus.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-card p-6 bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none shadow-xl shadow-blue-500/20">
      <div className="flex justify-between items-start mb-6">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
               <Zap size={20} className="text-yellow-400 fill-yellow-400" />
            </div>
            <div>
               <h3 className="text-lg font-black uppercase tracking-tight">Modo Hyperfocus</h3>
               <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Premium Active Focus</p>
            </div>
         </div>
         <div className="bg-black/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10">
            Remoto
         </div>
      </div>

      <p className="text-sm font-bold text-indigo-100 mb-6 leading-relaxed">
        Dispare um desafio de 15 minutos para seu filho. <span className="text-white">Toda lição concluída valerá o DOBRO de XP e Moedas!</span>
      </p>

      {activeUntil && new Date(activeUntil) > new Date() ? (
        <div className="bg-white/10 p-4 rounded-2xl border border-white/10 flex items-center justify-center gap-3 animate-pulse">
           <Timer size={20} />
           <span className="font-black text-xl tracking-tighter">ATIVADO! 🚀</span>
        </div>
      ) : (
        <button
          onClick={handleActivate}
          disabled={loading}
          className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-[0.1em] hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : (
            <>
              <Zap size={18} className="group-hover:scale-125 transition-transform" />
              Ativar Foco Total
            </>
          )}
        </button>
      )}
      
      <div className="mt-4 flex items-center gap-2 opacity-60">
         <Sparkles size={12} />
         <p className="text-[9px] font-bold uppercase tracking-widest">Motivação instantânea via satélite</p>
      </div>
    </div>
  );
}
