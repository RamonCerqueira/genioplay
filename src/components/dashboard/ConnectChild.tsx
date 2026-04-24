'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Baby, GraduationCap, Copy, Check, ChevronRight, X, AlertCircle } from 'lucide-react';

export default function ConnectChild({ guardianId }: { guardianId: string }) {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState<number | ''>('');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    birthDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCreateChild = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/guardian/register-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        window.location.reload();
      } else {
        setError(data.error || 'Erro ao criar perfil');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/auth/register?ref=${guardianId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="premium-card p-8 border-blue-100 bg-blue-50/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <UserPlus size={100} className="text-blue-600" />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-black text-slate-800">Conectar Novo Filho</h3>
              <p className="text-slate-500 font-bold">A segurança começa com o perfil correto.</p>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Qual a idade do seu filho(a)?</label>
              <input 
                type="number" 
                placeholder="Ex: 8" 
                className="input-field"
                value={age}
                onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
              />
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                * Crianças menores de 12 anos têm o perfil gerenciado diretamente por você. 
                Maiores de 12 anos podem realizar o próprio cadastro via convite seguro.
              </p>
            </div>

            <button 
              onClick={() => setStep(age && age < 12 ? 2 : 3)}
              disabled={!age}
              className="btn-primary w-full"
            >
              Continuar <ChevronRight size={20} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 text-blue-600">
               <Baby size={28} />
               <h3 className="text-2xl font-black text-slate-800">Perfil Infantil</h3>
            </div>
            <p className="text-sm text-slate-500 font-bold">Por ser menor de 12 anos, você deve definir o acesso.</p>

            <div className="space-y-4">
              {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}
              <input 
                type="text" 
                placeholder="Nome de usuário do filho" 
                className="input-field"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
              <input 
                type="password" 
                placeholder="Senha de acesso dele(a)" 
                className="input-field"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
              <input 
                type="date" 
                className="input-field"
                value={formData.birthDate}
                onChange={e => setFormData({...formData, birthDate: e.target.value})}
              />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(1)} 
                disabled={isSubmitting}
                className="px-6 py-3 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-white disabled:opacity-50"
              >
                Voltar
              </button>
              <button 
                onClick={handleCreateChild}
                disabled={isSubmitting}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {isSubmitting ? 'Criando...' : 'Criar Perfil'}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 text-indigo-600">
               <GraduationCap size={28} />
               <h3 className="text-2xl font-black text-slate-800">Link de Convite</h3>
            </div>
            <p className="text-sm text-slate-500 font-bold">Envie este link para seu filho realizar o cadastro seguro.</p>

            <div className="p-4 bg-white rounded-2xl border border-blue-100 flex items-center justify-between gap-4">
              <code className="text-xs font-bold text-blue-600 truncate">edutrack.com.br/invite/{guardianId}</code>
              <button 
                onClick={handleCopy}
                className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="text-amber-600 shrink-0" size={18} />
              <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                O cadastro via link vinculará o perfil dele automaticamente ao seu controle parental.
              </p>
            </div>

            <button onClick={() => setStep(1)} className="w-full py-3 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-white">
              Voltar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
