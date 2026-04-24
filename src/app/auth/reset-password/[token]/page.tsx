'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Lock, Loader2, CheckCircle2, ShieldCheck, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push('/auth/login'), 3000);
      } else {
        setError(data.error || 'Token inválido ou expirado.');
      }
    } catch (err) {
      setError('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-100/20 dark:bg-blue-900/10 rounded-full blur-3xl" />
      </div>

      <div className="mb-8 flex items-center gap-3 relative z-10">
        <div className="bg-blue-600 p-2.5 rounded-[1.2rem] shadow-lg shadow-blue-500/20 text-white">
          <GraduationCap size={28} />
        </div>
        <span className="text-3xl font-black tracking-tighter text-slate-800 dark:text-white">Gênio<span className="text-blue-600">Play</span></span>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="premium-card p-10 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-2xl">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="text-center space-y-3">
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white leading-tight">Nova Senha</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                    Crie uma senha forte para proteger sua conta GênioPlay.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold text-center">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Senha de Segurança</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="input-field pl-12 pr-12" 
                        placeholder="Min. 8 caracteres" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    
                    {/* Strength Indicator */}
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Força da Senha</span>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                          {passwordStrength === 100 ? 'Excelente' : passwordStrength >= 50 ? 'Média' : 'Fraca'}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${passwordStrength >= 75 ? 'bg-emerald-500' : passwordStrength >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                          animate={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Repetir Nova Senha</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className={`input-field pl-12 ${confirmPassword && confirmPassword !== password ? 'border-red-500 bg-red-50' : ''}`} 
                        placeholder="Confirme sua nova senha" 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                        required 
                      />
                      <ShieldCheck className={`absolute left-4 top-1/2 -translate-y-1/2 ${confirmPassword && confirmPassword !== password ? 'text-red-500' : 'text-slate-400'}`} size={20} />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full py-4.5">
                    {loading ? <Loader2 className="animate-spin" size={24} /> : 'Alterar Senha'}
                  </button>
                </form>
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
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white">Senha Alterada!</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                    Sua segurança foi atualizada. Redirecionando para o login...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
