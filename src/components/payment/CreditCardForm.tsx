'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Lock, Calendar, User, ShieldCheck, CheckCircle2, Loader2, X } from 'lucide-react';

interface CreditCardFormProps {
  onSuccess: (cardData: any) => void;
  onCancel: () => void;
}

export function CreditCardForm({ onSuccess, onCancel }: CreditCardFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  const [flipped, setFlipped] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de processamento Mercado Pago
    setTimeout(() => {
      setLoading(false);
      onSuccess(formData);
    }, 2000);
  };

  const formatCardNumber = (val: string) => {
    return val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  };

  const formatExpiry = (val: string) => {
    return val.replace(/\D/g, '').replace(/(.{2})/, '$1/').trim().slice(0, 5);
  };

  return (
    <div className="space-y-10">
      {/* Visual Card Preview */}
      <div className="perspective-1000 h-56 w-full max-w-[400px] mx-auto">
        <motion.div 
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          className="relative w-full h-full preserve-3d"
        >
          {/* Front */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 rounded-3xl p-8 text-white shadow-2xl backface-hidden border border-white/10 overflow-hidden">
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
             <div className="flex justify-between items-start mb-12">
                <div className="w-12 h-10 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center">
                   <div className="w-8 h-6 bg-amber-400/40 rounded-sm" />
                </div>
                <CreditCard size={32} className="text-white/20" />
             </div>
             <div className="space-y-6">
                <p className="text-2xl font-black tracking-[0.2em] font-mono">
                  {formData.number || '•••• •••• •••• ••••'}
                </p>
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Titular</p>
                      <p className="text-sm font-black uppercase tracking-tight truncate max-w-[200px]">
                        {formData.name || 'NOME DO TITULAR'}
                      </p>
                   </div>
                   <div className="space-y-1 text-right">
                      <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Validade</p>
                      <p className="text-sm font-black tracking-tight">{formData.expiry || 'MM/AA'}</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl text-white shadow-2xl backface-hidden rotate-y-180 border border-white/10 py-8">
             <div className="h-12 w-full bg-slate-800 mb-6" />
             <div className="px-8">
                <div className="h-10 bg-slate-700 rounded-lg flex items-center justify-end px-4">
                   <span className="text-slate-400 font-mono font-black italic">{formData.cvc || '•••'}</span>
                </div>
                <div className="mt-8 opacity-20 text-[6px] font-bold leading-tight">
                  Este cartão é para uso exclusivo na plataforma GênioPlay. Ao cadastrar este cartão você concorda com nossos termos de serviço e faturamento recorrente.
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número do Cartão</label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              className="input-field pl-12" 
              placeholder="0000 0000 0000 0000"
              value={formData.number}
              onChange={e => setFormData({...formData, number: formatCardNumber(e.target.value)})}
              onFocus={() => setFlipped(false)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome no Cartão</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              className="input-field pl-12 uppercase" 
              placeholder="COMO ESTÁ NO CARTÃO"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              onFocus={() => setFlipped(false)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Validade</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                className="input-field pl-12" 
                placeholder="MM/AA"
                value={formData.expiry}
                onChange={e => setFormData({...formData, expiry: formatExpiry(e.target.value)})}
                onFocus={() => setFlipped(false)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVC / CVV</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                className="input-field pl-12" 
                placeholder="000"
                maxLength={3}
                value={formData.cvc}
                onChange={e => setFormData({...formData, cvc: e.target.value})}
                onFocus={() => setFlipped(true)}
                required
              />
            </div>
          </div>
        </div>

        <div className="pt-6 flex gap-4">
           <button type="button" onClick={onCancel} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black rounded-2xl">Cancelar</button>
           <button type="submit" disabled={loading} className="flex-[2] btn-primary py-4 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
              Salvar Cartão Seguro
           </button>
        </div>
      </form>
    </div>
  );
}
