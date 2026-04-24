'use client';

import React, { useState, useEffect } from 'react';
import { BrainCircuit, BookOpen, User, Sparkles, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContentGeneratorPage() {
  const [step, setStep] = useState(1);
  const [students, setStudents] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    studentIds: [] as string[],
    subject: '',
    topic: '',
    persona: 'Divertido',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Busca estudantes do responsável
    fetch('/api/guardian/students')
      .then(res => res.json())
      .then(data => setStudents(data.students || []));
  }, []);

  const toggleStudent = (id: string) => {
    setFormData(prev => ({
      ...prev,
      studentIds: prev.studentIds.includes(id)
        ? prev.studentIds.filter(sid => sid !== id)
        : [...prev.studentIds, id]
    }));
  };

  const toggleAll = () => {
    setFormData(prev => ({
      ...prev,
      studentIds: prev.studentIds.length === students.length ? [] : students.map(s => s.id)
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/study/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setStep(4);
      } else {
        alert('Erro ao gerar: ' + data.error);
      }
    } catch (err) {
      alert('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <BrainCircuit className="text-blue-600" size={32} />
          Gerador de Conteúdo IA
        </h1>
        <p className="text-slate-500 font-bold">Crie materiais de estudo personalizados em segundos.</p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between px-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${step >= i ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-200 text-slate-500'
              }`}>
              {step > i ? <CheckCircle2 size={20} /> : i}
            </div>
            {i < 3 && <div className={`w-12 h-1 bg-slate-200 rounded-full ${step > i ? 'bg-blue-600' : ''}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="premium-card p-8 space-y-6"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <User size={16} /> Para qual(is) filho(s)?
                </label>
                <button
                  onClick={toggleAll}
                  className="text-xs font-black text-blue-600 hover:underline"
                >
                  {formData.studentIds.length === students.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                </button>
              </div>

              <div className="grid gap-3">
                {students.map(s => (
                  <button
                    key={s.id}
                    onClick={() => toggleStudent(s.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all font-bold ${formData.studentIds.includes(s.id)
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${formData.studentIds.includes(s.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-200'
                        }`}>
                        {formData.studentIds.includes(s.id) && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                      {s.username}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={nextStep}
              disabled={formData.studentIds.length === 0}
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
            className="premium-card p-8 space-y-6"
          >
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={16} /> O que vamos estudar?
              </label>
              <input
                type="text"
                placeholder="Ex: Matemática, História..."
                className="input-field"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
              <input
                type="text"
                placeholder="Ex: Frações, Revolução Francesa..."
                className="input-field"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              />
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="px-6 py-3 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all">
                Voltar
              </button>
              <button onClick={nextStep} disabled={!formData.subject || !formData.topic} className="btn-primary flex-1">
                Quase lá! <ChevronRight size={20} />
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
            className="premium-card p-8 space-y-6"
          >
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={16} /> Estilo do Professor (IA)
              </label>
              <div className="grid grid-cols-2 gap-4">
                {['Divertido', 'Sério', 'Paciente', 'Desafiador'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setFormData({ ...formData, persona: p })}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold ${formData.persona === p ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="px-6 py-3 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all">
                Voltar
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="btn-secondary flex-1"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>Gerar Conteúdo Agora <Sparkles size={20} /></>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="premium-card p-12 text-center space-y-6"
          >
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white">Sucesso!</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold mt-2">
                O conteúdo foi gerado e já está disponível no dashboard dos {formData.studentIds.length} filho(s) selecionado(s)!
              </p>
            </div>
            <button onClick={() => window.location.href = '/dashboard'} className="btn-primary w-full">
              Voltar ao Início
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
