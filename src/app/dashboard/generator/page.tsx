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
    gradeLevel: '',
    persona: 'Divertido',
  });
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);

  useEffect(() => {
    // Busca estudantes do responsável
    fetch('/api/guardian/students')
      .then(res => res.json())
      .then(data => setStudents(data.students || []));
  }, []);

  const toggleStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    setFormData(prev => {
      const isRemoving = prev.studentIds.includes(id);
      const newIds = isRemoving
        ? prev.studentIds.filter(sid => sid !== id)
        : [...prev.studentIds, id];
      
      // Se estiver adicionando o primeiro estudante e ele tiver série definida, preenche automático
      let newGrade = prev.gradeLevel;
      if (!isRemoving && newIds.length === 1 && student?.gradeLevel) {
        newGrade = student.gradeLevel;
      }

      return {
        ...prev,
        studentIds: newIds,
        gradeLevel: newGrade
      };
    });
  };

  const toggleAll = () => {
    setFormData(prev => {
      const allSelected = prev.studentIds.length === students.length;
      const newIds = allSelected ? [] : students.map(s => s.id);
      
      // Se selecionar todos, pega a série do primeiro se estiver vazio
      let newGrade = prev.gradeLevel;
      if (!allSelected && students.length > 0 && !newGrade) {
        newGrade = students[0].gradeLevel || '';
      }

      return { ...prev, studentIds: newIds, gradeLevel: newGrade };
    });
  };

  const [loadingMessage, setLoadingMessage] = useState('Consultando a BNCC...');

  const handleGenerate = async () => {
    setLoading(true);
    setLoadingMessage('Consultando a BNCC...');
    
    // Simulação de progresso para UX
    const messages = [
      'Consultando a BNCC...',
      'Desenhando os cards pedagógicos...',
      'Criando os desafios (06 questões)...',
      'Preparando as questões bônus...',
      'Finalizando o material de estudo...'
    ];
    
    let msgIdx = 0;
    const interval = setInterval(() => {
      if (msgIdx < messages.length - 1) {
        msgIdx++;
        setLoadingMessage(messages[msgIdx]);
      }
    }, 4000);

    try {
      const res = await fetch('/api/study/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedData(data.data);
        setStep(4);
      } else {
        alert('Ops! O Google me disse algo estranho: ' + (data.error || 'Erro desconhecido') + '. Vamos tentar de novo? 🧐');
      }
    } catch (err) {
      alert('Houve um problema de conexão ao gerar o conteúdo. Por favor, verifique sua internet e tente novamente.');
    } finally {
      clearInterval(interval);
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
            <div className="space-y-6">
              <label className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={16} /> Planejamento Pedagógico
              </label>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Matéria</p>
                  <input
                    type="text"
                    placeholder="Ex: Matemática, História..."
                    className="input-field"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Série / Ano</p>
                   <select 
                    className="input-field appearance-none"
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                   >
                      <option value="">Selecione a série...</option>
                      <optgroup label="Ensino Fundamental I">
                        <option value="1º Ano">1º Ano</option>
                        <option value="2º Ano">2º Ano</option>
                        <option value="3º Ano">3º Ano</option>
                        <option value="4º Ano">4º Ano</option>
                        <option value="5º Ano">5º Ano</option>
                      </optgroup>
                      <optgroup label="Ensino Fundamental II">
                        <option value="6º Ano">6º Ano</option>
                        <option value="7º Ano">7º Ano</option>
                        <option value="8º Ano">8º Ano</option>
                        <option value="9º Ano">9º Ano</option>
                      </optgroup>
                      <optgroup label="Ensino Médio">
                        <option value="1º Série">1ª Série</option>
                        <option value="2º Série">2ª Série</option>
                        <option value="3º Série">3ª Série (Vestibular)</option>
                      </optgroup>
                   </select>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Assunto Específico</p>
                <input
                  type="text"
                  placeholder="Ex: Frações, Revolução Francesa, Cadeia Alimentar..."
                  className="input-field"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                Voltar
              </button>
              <button 
                onClick={nextStep} 
                disabled={!formData.subject || !formData.topic || !formData.gradeLevel} 
                className="btn-primary flex-1"
              >
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
                  <div className="flex flex-col items-center gap-3 py-2">
                    <Loader2 className="animate-spin" size={32} />
                    <span className="text-sm font-black animate-pulse">{loadingMessage}</span>
                  </div>
                ) : (
                  <>Gerar Conteúdo Agora <Sparkles size={20} /></>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && generatedData && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Sucesso Header */}
            <div className="premium-card p-10 text-center space-y-4 border-emerald-100 dark:border-emerald-900/30">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white">Conteúdo Gerado com Sucesso!</h2>
              <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-800/50 text-left max-w-3xl mx-auto">
                 <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                   <Sparkles size={14} /> Resumo Pedagógico do Gênio
                 </p>
                 <p className="text-sm text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
                   {generatedData.summary}
                 </p>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold max-w-xl mx-auto">
                O material já está disponível no dashboard dos seus filhos. Confira abaixo o resumo pedagógico e o gabarito.
              </p>
            </div>

            {/* Resumo Pedagógico e Gabarito */}
            <div className="grid lg:grid-cols-2 gap-8 text-left">
               {/* Coluna 1: Resumo da Teoria */}
               <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                     <BookOpen className="text-blue-600" size={24} /> Resumo da Teoria
                  </h3>
                  <div className="space-y-4">
                     {generatedData.cards.map((card: any, idx: number) => (
                       <div key={idx} className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                          <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Card {idx + 1}</p>
                          <h4 className="font-black text-slate-800 dark:text-white mb-2">{card.title}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{card.content}</p>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Coluna 2: Gabarito dos Testes */}
               <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                     <CheckCircle2 className="text-emerald-600" size={24} /> Gabarito (Respostas)
                  </h3>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                     {generatedData.questions.map((q: any, idx: number) => (
                       <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Questão {idx + 1} - {q.difficulty}</p>
                          <p className="font-bold text-slate-800 dark:text-white mb-3">{q.text}</p>
                          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl">
                             <p className="text-sm font-black text-emerald-700 dark:text-emerald-400">Resposta: {q.options[q.correctIndex]}</p>
                             <p className="text-xs text-emerald-600 dark:text-emerald-500/80 mt-1 italic">{q.explanation}</p>
                          </div>
                       </div>
                     ))}
                     {generatedData.bonusQuestions.map((q: any, idx: number) => (
                       <div key={idx} className="p-6 bg-orange-50 dark:bg-orange-900/10 rounded-3xl border border-orange-100 dark:border-orange-900/20">
                          <p className="text-[10px] font-black text-orange-400 uppercase mb-2">DESAFIO BÔNUS</p>
                          <p className="font-bold text-slate-800 dark:text-white mb-3">{q.text}</p>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                             <p className="text-sm font-black text-orange-600">Resposta: {q.options[q.correctIndex]}</p>
                             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{q.explanation}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="flex justify-center pt-8">
               <button onClick={() => window.location.href = '/dashboard'} className="btn-primary px-12">
                  Voltar ao Dashboard
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
