'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BrainCircuit, Mail, Lock, ShieldCheck, ArrowRight, Loader2, HeartHandshake, User, GraduationCap, Phone, Fingerprint, MapPin, Search, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { validateCPF, formatCPF } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const inviteRef = searchParams.get('ref');

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: inviteRef ? 'STUDENT' : 'GUARDIAN',
    ref: inviteRef || '',
    cpf: '',
    phone: '',
    cep: '',
    address: '',
    city: '',
    state: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [isCpfTaken, setIsCpfTaken] = useState(false);
  const [isPhoneTaken, setIsPhoneTaken] = useState(false);

  // Debounced Field Validations
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.email.includes('@')) {
        const res = await fetch(`/api/auth/validate?email=${formData.email}`);
        const data = await res.json();
        setIsEmailTaken(data.exists);
      }
      if (formData.cpf.length === 14) {
        const res = await fetch(`/api/auth/validate?cpf=${formData.cpf}`);
        const data = await res.json();
        setIsCpfTaken(data.exists);
      }
      if (formData.phone.length >= 10) {
        const res = await fetch(`/api/auth/validate?phone=${formData.phone}`);
        const data = await res.json();
        setIsPhoneTaken(data.exists);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [formData.email, formData.cpf, formData.phone]);

  // Password Strength Logic
  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength += 25;
    if (/[A-Z]/.test(formData.password)) strength += 25;
    if (/[0-9]/.test(formData.password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25;
    setPasswordStrength(strength);
  }, [formData.password]);

  // CEP Lookup
  const handleCEPLookup = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');
    setFormData({ ...formData, cep: cleanCEP });
    if (cleanCEP.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            address: `${data.logradouro}, ${data.bairro}`,
            city: data.localidade,
            state: data.uf
          }));
        }
      } catch (err) {
        console.error('CEP error');
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações antes de prosseguir/enviar
    if (isEmailTaken) { setError('Este e-mail já está em uso.'); return; }
    if (isCpfTaken) { setError('Este CPF já está cadastrado.'); return; }
    if (isPhoneTaken) { setError('Este telefone já está cadastrado.'); return; }

    if (step === 3 || formData.role === 'STUDENT') {
       if (formData.password !== confirmPassword) {
         setError('As senhas não coincidem.');
         return;
       }
    }

    if (step === 1 && formData.role === 'GUARDIAN' && !validateCPF(formData.cpf)) {
      setError('Por favor, informe um CPF válido para continuar.');
      return;
    }

    if (step < 3 && formData.role === 'GUARDIAN') {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Falha no registro');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-3xl" />
      </div>

      <Link href="/" className="mb-8 flex items-center gap-3 group relative z-10">
        <div className="bg-blue-600 p-2.5 rounded-[1.2rem] group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20 text-white">
          <GraduationCap size={28} />
        </div>
        <span className="text-3xl font-black tracking-tighter text-slate-800">Gênio<span className="text-blue-600">Play</span></span>
      </Link>

      <div className="w-full max-w-xl relative z-10">
        <div className="premium-card p-10 bg-white border-slate-100 shadow-2xl relative overflow-hidden">
          {/* Progress Bar */}
          {formData.role === 'GUARDIAN' && (
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
              <motion.div
                className="h-full bg-blue-600"
                animate={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          )}

          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 mb-6">
              {formData.role === 'GUARDIAN' ? <ShieldCheck className="text-blue-600" size={16} /> : <GraduationCap className="text-indigo-600" size={16} />}
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                {formData.role === 'GUARDIAN' ? `Cadastro de Responsável • Passo ${step}/3` : 'Cadastro de Aluno Convidado'}
              </span>
            </div>
            <h2 className="text-4xl font-black text-slate-800">
              {formData.role === 'GUARDIAN' ? 'Perfil de Segurança' : 'Sua Jornada Começa'}
            </h2>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {error && <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold text-center">{error}</div>}

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                  <div className="relative">
                    <input type="text" className="input-field pl-12" placeholder="Seu nome" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      className={`input-field pl-12 ${isEmailTaken ? 'border-red-500 bg-red-50 text-red-600' : ''}`} 
                      placeholder="seu@email.com" 
                      value={formData.email} 
                      onChange={e => setFormData({ ...formData, email: e.target.value })} 
                      required 
                    />
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${isEmailTaken ? 'text-red-500' : 'text-slate-400'}`} size={20} />
                    {isEmailTaken && (
                       <AlertTriangle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-pulse" size={18} />
                    )}
                  </div>
                  {isEmailTaken && <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">E-mail já cadastrado</p>}
                </div>
                {formData.role === 'GUARDIAN' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">CPF</label>
                      <div className="relative">
                        <input
                          type="text"
                          className={`input-field pl-12 ${(formData.cpf.length === 14 && !validateCPF(formData.cpf)) || isCpfTaken ? 'border-red-500 bg-red-50 text-red-600' : ''}`}
                          placeholder="000.000.000-00"
                          value={formData.cpf}
                          onChange={e => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                          required
                        />
                        <Fingerprint className={`absolute left-4 top-1/2 -translate-y-1/2 ${(formData.cpf.length === 14 && !validateCPF(formData.cpf)) || isCpfTaken ? 'text-red-500' : 'text-slate-400'}`} size={20} />
                        {((formData.cpf.length === 14 && !validateCPF(formData.cpf)) || isCpfTaken) && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-in fade-in zoom-in">
                            <AlertTriangle size={18} />
                          </div>
                        )}
                      </div>
                      {isCpfTaken ? (
                         <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">CPF já cadastrado</p>
                      ) : formData.cpf.length === 14 && !validateCPF(formData.cpf) && (
                        <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">CPF Inválido</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          className={`input-field pl-12 ${isPhoneTaken ? 'border-red-500 bg-red-50 text-red-600' : ''}`} 
                          placeholder="(11) 99999-9999" 
                          value={formData.phone} 
                          onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                          required 
                        />
                        <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 ${isPhoneTaken ? 'text-red-500' : 'text-slate-400'}`} size={20} />
                        {isPhoneTaken && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-in fade-in zoom-in">
                            <AlertTriangle size={18} />
                          </div>
                        )}
                      </div>
                      {isPhoneTaken && <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">WhatsApp já cadastrado</p>}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">CEP (Busca Automática)</label>
                  <div className="relative">
                    <input type="text" className="input-field pl-12" placeholder="00000-000" value={formData.cep} onChange={e => handleCEPLookup(e.target.value)} required />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Endereço</label>
                  <div className="relative">
                    <input type="text" className="input-field pl-12" placeholder="Rua, Bairro..." value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" className="input-field" placeholder="Cidade" value={formData.city} readOnly />
                  <input type="text" className="input-field" placeholder="UF" value={formData.state} readOnly />
                </div>
              </motion.div>
            )}

            {(step === 3 || formData.role === 'STUDENT') && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Senha de Segurança</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="input-field pl-12 pr-12" 
                      placeholder="Min. 8 caracteres" 
                      value={formData.password} 
                      onChange={e => setFormData({ ...formData, password: e.target.value })} 
                      required 
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {/* Confirm Password */}
                  <div className="mt-6 space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Repetir Senha</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className={`input-field pl-12 ${confirmPassword && confirmPassword !== formData.password ? 'border-red-500 bg-red-50' : ''}`} 
                        placeholder="Confirme sua senha" 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                        required 
                      />
                      <ShieldCheck className={`absolute left-4 top-1/2 -translate-y-1/2 ${confirmPassword && confirmPassword !== formData.password ? 'text-red-500' : 'text-slate-400'}`} size={20} />
                    </div>
                    {confirmPassword && confirmPassword !== formData.password && (
                       <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">As senhas não coincidem</p>
                    )}
                  </div>

                  {/* Strength Indicator */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Força da Senha</span>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                        {passwordStrength === 100 ? 'Excelente' : passwordStrength >= 50 ? 'Média' : 'Fraca'}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${passwordStrength >= 75 ? 'bg-emerald-500' : passwordStrength >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                        animate={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex gap-4">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="px-8 py-4 rounded-2xl border border-slate-200 font-black text-slate-400 hover:bg-slate-50 transition-all">
                  Voltar
                </button>
              )}
              <button type="submit" disabled={loading} className="btn-primary flex-1 py-4.5">
                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    {step === 3 || formData.role === 'STUDENT' ? 'Finalizar Cadastro' : 'Próximo Passo'}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center space-y-4">
            <p className="text-sm font-bold text-slate-400 italic">"Segurança em primeiro lugar."</p>
            <p className="text-sm text-slate-500 font-bold">
              Já tem uma conta? <Link href="/auth/login" className="text-blue-600 hover:underline">Entre aqui</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


