'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Baby, GraduationCap, Copy, Check, ChevronRight, X, AlertCircle } from 'lucide-react';

export default function ConnectChild({ guardianId }: { guardianId: string }) {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    birthDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const calculateAge = (dateString: string) => {
    if (!dateString) return 0;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

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
    const inviteUrl = `${window.location.origin}/auth/register?ref=${guardianId}&type=student&email=${formData.email}&birthDate=${formData.birthDate}`;
    navigator.clipboard.writeText(inviteUrl);
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
              <p className="text-slate-500 font-bold">Inicie o cadastro informando os dados básicos.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Data de Nascimento</label>
                <input 
                  type="date" 
                  className="input-field"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">E-mail do Filho(a)</label>
                <input 
                  type="email" 
                  placeholder="ex: filho@email.com"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                  * Usamos o e-mail para validar a conta e enviar convites para maiores de 12 anos.
                </p>
              </div>
            </div>

            <button 
              onClick={() => {
                const age = calculateAge(formData.birthDate);
                setStep(age > 0 && age < 12 ? 2 : 3);
              }}
              disabled={!formData.birthDate || !formData.email}
              className="btn-primary w-full disabled:opacity-50"
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
            <p className="text-sm text-slate-500 font-bold">Por ser menor de 12 anos, você deve definir as credenciais de acesso.</p>

            <div className="space-y-4">
              {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}
              <input 
                type="text" 
                placeholder="Nome de usuário (ex: joao_genio)" 
                className="input-field"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
              <input 
                type="password" 
                placeholder="Senha de acesso" 
                className="input-field"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
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
                disabled={isSubmitting || !formData.username || !formData.password}
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
               <h3 className="text-2xl font-black text-slate-800">Enviar Convite</h3>
            </div>
            <p className="text-sm text-slate-500 font-bold">O perfil será criado e o link enviado para <strong>{formData.email}</strong>.</p>

            <div className="p-4 bg-white rounded-2xl border border-blue-100 flex items-center justify-between gap-4">
              <code className="text-[10px] font-bold text-blue-600 truncate max-w-[200px]">
                {window.location.origin}/invite/{guardianId}
              </code>
              <button 
                onClick={handleCopy}
                className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1 text-[10px] font-black uppercase"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copiado' : 'Link'}
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="text-amber-600 shrink-0" size={18} />
              <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                Ao se cadastrar, a conta dele será vinculada ao seu painel automaticamente.
              </p>
            </div>

            <div className="flex gap-4">
               <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-white">
                  Voltar
               </button>
               <button 
                onClick={handleCreateChild}
                disabled={isSubmitting}
                className="btn-primary flex-1 shadow-lg shadow-blue-500/20"
               >
                 {isSubmitting ? 'Enviando...' : 'Confirmar & Enviar'}
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
