'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, Send, CheckCircle2, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError(data.error || 'Não foi possível processar sua solicitação.');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl" />
      </div>

      <Link href="/" className="mb-8 flex items-center gap-3 group relative z-10">
        <div className="bg-blue-600 p-2.5 rounded-[1.2rem] group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20 text-white">
          <GraduationCap size={28} />
        </div>
        <span className="text-3xl font-black tracking-tighter text-slate-800 dark:text-white">Gênio<span className="text-blue-600">Play</span></span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="premium-card p-10 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="request"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-3">
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white leading-tight">Recuperar Senha</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                    Enviaremos um link de segurança para o seu e-mail cadastrado.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold text-center">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Seu E-mail</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        className="input-field pl-12" 
                        placeholder="seu@email.com" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full py-4.5">
                    {loading ? <Loader2 className="animate-spin" size={24} /> : (
                      <>
                        Enviar Link <Send size={18} />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <Link href="/auth/login" className="text-sm font-black text-slate-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                    <ArrowLeft size={16} /> Voltar para o Login
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8"
              >
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                  <CheckCircle2 size={40} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white">E-mail Enviado!</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed">
                    Verifique sua caixa de entrada (e a pasta de spam). O link expira em 1 hora.
                  </p>
                </div>
                <Link href="/auth/login" className="btn-primary w-full inline-flex py-4.5">
                  Voltar ao Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
