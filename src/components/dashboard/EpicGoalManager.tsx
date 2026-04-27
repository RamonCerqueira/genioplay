'use client';

import React, { useState, useEffect } from 'react';
import { Target, Trophy, CheckCircle2, XCircle, PlusCircle, Loader2, Camera, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MosaicVisualizer } from './MosaicVisualizer';

export function EpicGoalManager({ studentId }: { studentId: string }) {
  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ prize: '', targetLessons: 100, imageUrl: '' });

  useEffect(() => {
    if (studentId) {
      fetchGoal();
    }
  }, [studentId]);

  const fetchGoal = async () => {
    setLoading(true);
    const res = await fetch(`/api/guardian/epic-goal?studentId=${studentId}`);
    const data = await res.json();
    if (data.success) setGoal(data.goal);
    setLoading(false);
  };

  const handleCreate = async () => {
    const res = await fetch('/api/guardian/epic-goal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, ...form })
    });
    if (res.ok) {
      setIsEditing(false);
      fetchGoal();
    }
  };

  const handleStatus = async (status: 'ACHIEVED' | 'FAILED') => {
    const res = await fetch('/api/guardian/epic-goal', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goalId: goal.id, status })
    });
    if (res.ok) fetchGoal();
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentId', studentId);

    try {
      const res = await fetch('/api/guardian/epic-goal/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm({ ...form, imageUrl: data.imageUrl });
      }
    } catch (err) {
      console.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const generateAIImage = async () => {
    // Simulação de geração de imagem com a IA do sistema
    setForm({ ...form, imageUrl: 'https://images.unsplash.com/photo-1533481406255-7a6b6ad84213?q=80&w=1000' }); 
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></div>;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
               <Target size={24} />
            </div>
            <div>
               <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Meta Épica em Família</h3>
               <p className="text-xs font-bold text-slate-400 italic">Construindo o futuro, uma peça por vez.</p>
            </div>
         </div>
         {!goal && !isEditing && (
           <button onClick={() => setIsEditing(true)} className="btn-primary py-3 px-6 text-sm font-black flex items-center gap-2">
             <PlusCircle size={18} /> Definir Meta Épica
           </button>
         )}
      </div>

      <AnimatePresence>
        {isEditing ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="premium-card p-10 bg-slate-50 dark:bg-slate-800/50 border-none shadow-2xl space-y-8">
             <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Qual é o grande prêmio?</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Viagem para a Disney, Bicicleta Nova..." 
                        value={form.prize}
                        onChange={e => setForm({...form, prize: e.target.value})}
                        className="w-full h-14 bg-white dark:bg-slate-900 border-none rounded-2xl px-6 text-sm font-black shadow-sm focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Meta de Lições (Peças)</label>
                      <input 
                        type="number" 
                        value={form.targetLessons}
                        onChange={e => setForm({...form, targetLessons: Number(e.target.value)})}
                        className="w-full h-14 bg-white dark:bg-slate-900 border-none rounded-2xl px-6 text-sm font-black shadow-sm focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                      <p className="text-[10px] text-slate-400 mt-2 italic font-bold">Dica: 50 a 100 lições é o ideal para grandes metas.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Imagem do Prêmio</label>
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     className="hidden" 
                     accept="image/*" 
                     onChange={handleUpload} 
                   />
                   <div className="aspect-video rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center bg-white dark:bg-slate-900 relative overflow-hidden group">
                      {uploading ? (
                        <div className="text-center space-y-2">
                           <Loader2 className="animate-spin text-blue-600 mx-auto" />
                           <p className="text-[10px] font-black text-blue-600 uppercase">Enviando Imagem...</p>
                        </div>
                      ) : form.imageUrl ? (
                        <>
                          <img src={form.imageUrl} className="w-full h-full object-cover opacity-80" />
                          <button onClick={() => setForm({...form, imageUrl: ''})} className="absolute top-4 right-4 p-2 bg-rose-500 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><XCircle size={18} /></button>
                        </>
                      ) : (
                        <div className="text-center space-y-4 p-6">
                           <ImageIcon size={40} className="text-slate-200 mx-auto" />
                           <div className="flex flex-col gap-2">
                              <button onClick={() => fileInputRef.current?.click()} className="text-xs font-black text-blue-600 hover:underline flex items-center justify-center gap-1">
                                 <Camera size={14} /> Fazer Upload
                              </button>
                              <button onClick={generateAIImage} className="text-[10px] font-black text-amber-600 hover:underline flex items-center justify-center gap-1">
                                 <Sparkles size={12} /> Sugestão da IA
                              </button>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </div>

             <div className="flex gap-4 pt-4">
                <button onClick={handleCreate} className="btn-primary flex-1 py-5 text-lg shadow-xl shadow-blue-500/20">Ativar Meta Épica</button>
                <button onClick={() => setIsEditing(false)} className="px-10 py-5 bg-white dark:bg-slate-900 text-slate-400 font-black rounded-2xl border border-slate-100 dark:border-slate-800">Cancelar</button>
             </div>
          </motion.div>
        ) : goal ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
             <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7">
                   {goal.imageUrl ? (
                     <MosaicVisualizer 
                       imageUrl={goal.imageUrl} 
                       totalPieces={goal.targetLessons} 
                       unlockedPieces={goal.currentLessons} 
                     />
                   ) : (
                     <div className="aspect-video rounded-[3rem] bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700">
                        <ImageIcon size={60} strokeWidth={1} />
                        <p className="mt-4 font-bold">Nenhuma imagem definida para o mosaico.</p>
                     </div>
                   )}
                </div>

                <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
                   <div className="premium-card p-10 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
                      <div className="relative z-10 space-y-6">
                        <div>
                           <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Grande Objetivo</p>
                           <h4 className="text-3xl font-black text-slate-800 dark:text-white leading-tight">{goal.title}</h4>
                        </div>
                        
                        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] border border-blue-100 dark:border-blue-800/50">
                           <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">O Prêmio Prometido</p>
                           <div className="flex items-center gap-3">
                              <Trophy className="text-amber-500" size={32} />
                              <span className="text-2xl font-black text-slate-800 dark:text-white">{goal.prize}</span>
                           </div>
                        </div>

                        <div className="flex gap-4">
                           <button 
                             onClick={() => handleStatus('ACHIEVED')}
                             className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all"
                           >
                              Meta Atingida! 🎉
                           </button>
                           <button 
                             onClick={() => handleStatus('FAILED')}
                             className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-100 hover:text-rose-600 transition-all"
                           >
                              Meta Perdida
                           </button>
                        </div>
                      </div>
                      <Sparkles className="absolute -right-10 -bottom-10 text-slate-50 dark:text-slate-800/50" size={240} />
                   </div>
                </div>
             </div>
          </motion.div>
        ) : (
          <div className="p-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
             <p className="text-sm font-bold text-slate-400 italic">Nenhuma meta épica definida ainda.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
