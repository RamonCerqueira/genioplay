'use client';

import React, { useState } from 'react';
import { QrCode, Copy, Check, Loader2, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export function PixCheckout({ userId, planPrice }: { userId: string, planPrice: string }) {
  const [pixData, setPixData] = useState<{ qrCode: string, copyPaste: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePix = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment/mercado-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: planPrice.replace('R$ ', '').replace(',', '.'), 
          description: 'Plano Premium EduTrack' 
        })
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      setPixData({
        qrCode: `data:image/png;base64,${data.qrCodeBase64}`,
        copyPaste: data.copyPaste
      });
    } catch (err: any) {
      alert('Erro ao gerar PIX: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyPix = () => {
    if (!pixData) return;
    navigator.clipboard.writeText(pixData.copyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="premium-card p-10 max-w-md mx-auto text-center space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center justify-center gap-2">
          <QrCode className="text-blue-600" /> Checkout PIX
        </h2>
        <p className="text-slate-500 font-bold">Escaneie o código abaixo para ativar seu Premium.</p>
      </div>

      {!pixData ? (
        <button 
          onClick={generatePix}
          disabled={loading}
          className="btn-primary w-full py-5 flex items-center justify-center gap-3"
        >
          {loading ? <Loader2 className="animate-spin" /> : <CreditCard />}
          Gerar PIX de {planPrice}
        </button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="bg-white p-4 rounded-3xl inline-block shadow-inner border border-slate-100">
            <img src={pixData.qrCode} alt="PIX QR Code" className="w-48 h-48" />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Ou copie o código</p>
            <div className="flex gap-2">
              <input 
                readOnly 
                value={pixData.copyPaste} 
                className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-[10px] font-mono flex-1 truncate"
              />
              <button 
                onClick={copyPix}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-emerald-500 text-sm font-black animate-pulse">
            <Loader2 className="animate-spin" size={16} />
            Aguardando pagamento...
          </div>
        </motion.div>
      )}
    </div>
  );
}
