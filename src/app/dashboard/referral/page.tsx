'use client';

import React, { useState, useEffect } from 'react';
import { Gift, Share2, Users, CheckCircle2, Copy, AlertTriangle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotify } from '@/components/ui/NotificationSystem';

export default function ReferralPage() {
  const notify = useNotify();
  const [referralCode, setReferralCode] = useState('EDU-RAMON-2024'); // Viria do DB
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const MAX_REFERRALS = 5;

  useEffect(() => {
    fetch('/api/guardian/referrals/count')
      .then(res => res.json())
      .then(data => {
        setReferralCount(data.count || 0);
        setLoading(false);
      });
  }, []);

  const copyToClipboard = () => {
    const link = `https://edutrack.com/invite?code=${referralCode}`;
    navigator.clipboard.writeText(link);
    notify({
      title: 'Link Copiado! 📝',
      message: 'Agora é só enviar para outros pais e começar a ganhar bônus.',
      type: 'SUCCESS',
      duration: 5000
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center text-blue-600 mx-auto shadow-xl shadow-blue-500/10">
          <Gift size={40} />
        </div>
        <h1 className="text-4xl font-black text-slate-800 dark:text-white">Traga outros Pais</h1>
        <p className="text-slate-500 font-bold text-lg">Compartilhe o EduTrack e ganhe bônus exclusivos. (Máximo de 5 indicações)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Card de Convite */}
        <div className="premium-card p-10 space-y-8 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <Share2 className="text-blue-600" size={24} /> Seu Link de Convite
            </h2>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">
              Cada pai que assinar usando seu link, você ganha 1 mês de Premium grátis e ele ganha 20% de desconto no GênioPlay.
            </p>
          </div>

          {referralCount >= MAX_REFERRALS ? (
            <div className="p-6 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 flex items-start gap-4">
              <AlertTriangle className="text-orange-500 shrink-0" size={24} />
              <p className="text-sm font-bold text-orange-800 dark:text-orange-400">
                Você atingiu o limite de {MAX_REFERRALS} indicações. Obrigado por ajudar nossa comunidade a crescer!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 font-mono text-sm break-all">
                https://edutrack.com/invite?code={referralCode}
              </div>
              <button
                onClick={copyToClipboard}
                className="btn-primary w-full py-4"
              >
                <Copy size={20} /> Copiar Link de Convite
              </button>
            </div>
          )}
        </div>

        {/* Card de Progresso */}
        <div className="premium-card p-10 space-y-8">
          <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <Users className="text-blue-600" size={24} /> Progresso ({referralCount}/{MAX_REFERRALS})
          </h2>

          <div className="space-y-6">
            {[...Array(MAX_REFERRALS)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${i < referralCount ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-300'
                  }`}>
                  {i < referralCount ? <CheckCircle2 size={20} /> : <Users size={18} />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-black ${i < referralCount ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                    Indicação {i + 1}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {i < referralCount ? 'Completado! 🎉' : 'Aguardando convite'}
                  </p>
                </div>
                {i < referralCount && (
                  <div className="text-xs font-black text-emerald-500">+1 Mês Grátis</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-blue-500/30">
        <div className="relative z-10 space-y-4 max-w-xl">
          <h2 className="text-3xl font-black">Por que indicar?</h2>
          <p className="font-bold opacity-90 leading-relaxed">
            Acreditamos que a educação muda o mundo. Ao trazer outros pais, você fortalece nossa rede de suporte e ajuda mais crianças a terem acesso a uma IA que realmente ensina.
          </p>
        </div>
        <Sparkles className="absolute -right-10 -bottom-10 text-white/10" size={300} />
      </div>
    </div>
  );
}
