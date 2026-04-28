'use client';

import React, { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';

export function UpgradeButton() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payment/mercado-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: 'premium_pro',
          description: 'Assinatura GênioPlay PRO (Mensal)',
          price: 39.00
        }),
      });

      const data = await response.json();
      
      if (data.init_point) {
        // Redireciona de forma segura para o checkout do Mercado Pago
        window.location.href = data.init_point;
      } else {
        alert(data.error || 'Erro ao iniciar pagamento.');
      }
    } catch (error) {
      alert('Erro de conexão ao processar o pagamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {loading ? (
        <><Loader2 className="animate-spin" size={20} /> Processando...</>
      ) : (
        <><CreditCard size={20} /> Assinar PRO Agora</>
      )}
    </button>
  );
}
