'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Falha no login');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-900 to-slate-950">
      <Link href="/" className="mb-8 flex items-center gap-3 group">
        <div className="bg-blue-600 p-2.5 rounded-[1.2rem] group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20 text-white">
          <GraduationCap size={28} />
        </div>
        <span className="text-3xl font-black tracking-tighter text-slate-800 dark:text-white">Gênio<span className="text-blue-600">Play</span></span>
      </Link>

      <div className="w-full max-w-md space-y-8 premium-card p-10 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="text-center relative z-10">
          <h2 className="text-4xl font-black text-slate-800 dark:text-white">Bem-vindo</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 text-sm italic">"O sucesso do seu filho começa aqui."</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Seu E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                className="input-field !pl-12"
                placeholder="ex: voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Senha</label>
              <Link href="/auth/forgot-password" virtual-active="true" className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">
                Esqueci a senha
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                className="input-field !pl-12"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-3 py-4.5"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
              <>
                Entrar no GênioPlay
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm font-bold text-slate-500 pt-4">
          Não tem uma conta? <Link href="/auth/register" className="text-blue-600 hover:underline font-black">Crie agora</Link>
        </div>
      </div>
    </div>
  );
}
