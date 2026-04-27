'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { SpaceBackground } from '@/components/ui/SpaceBackground';

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
        if (data.user.role === 'ADMIN') {
          router.push('/admin-master');
        } else if (data.user.role === 'STUDENT') {
          router.push('/dashboard/student');
        } else {
          router.push('/dashboard');
        }
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#020617]">
      <SpaceBackground />

      <Link href="/" className="mb-10 flex flex-col items-center gap-4 group relative z-10">
        <div className="relative">
          <img
            src="/icons/icon-512x512.png"
            alt="GênioPlay Logo"
            className="w-20 h-20 object-contain rounded-[2rem] shadow-2xl shadow-blue-500/40 group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full -z-10 group-hover:bg-blue-500/30 transition-colors" />
        </div>
        <span className="text-4xl font-black tracking-tighter text-white uppercase">Gênio<span className="text-blue-500">Play</span></span>
      </Link>

      <div className="w-full max-w-md space-y-8 premium-card p-10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden z-10">
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
