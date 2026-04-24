'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  X, 
  CheckCircle2, 
  Loader2, 
  User, 
  Lock, 
  ChevronRight, 
  Trash2,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function FamilyPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChild, setNewChild] = useState({ username: '', password: '', avatar: '🎓' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const avatars = ['🎓', '🚀', '⭐', '🎨', '🧠', '⚽', '🎸', '🍦', '🎮', '🦄'];

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const res = await fetch('/api/family/list');
      const data = await res.json();
      if (data.success) setChildren(data.children);
    } catch (err) {
      console.error('Fetch error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/family/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newChild),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setNewChild({ username: '', password: '', avatar: '🎓' });
        fetchChildren();
      } else {
        setError(data.error || 'Erro ao cadastrar');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-800 dark:text-white flex items-center gap-4">
                <Users className="text-blue-600" size={40} /> Gestão da Família
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-lg italic">
                "Educar é o ato de dar o exemplo."
              </p>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary py-4 px-8 shadow-xl shadow-blue-500/20 flex items-center gap-2 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" /> 
              Cadastrar Novo Filho
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              [1, 2].map(i => <div key={i} className="h-44 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] animate-pulse border border-slate-100 dark:border-slate-800" />)
            ) : children.length === 0 ? (
              <div className="md:col-span-2 premium-card p-16 bg-white dark:bg-slate-900 border-dashed border-2 flex flex-col items-center text-center space-y-8">
                <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 shadow-inner">
                   <GraduationCap size={48} />
                </div>
                <div className="space-y-3">
                   <h3 className="text-2xl font-black text-slate-800 dark:text-white">Ainda não há alunos cadastrados</h3>
                   <p className="text-slate-500 dark:text-slate-400 font-bold max-w-md mx-auto">
                     Adicione seus filhos para começar a acompanhar o progresso e transformar a educação deles em uma jornada épica.
                   </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary px-10 py-4 shadow-xl shadow-blue-500/20"
                >
                  Cadastrar Agora
                </button>
              </div>
            ) : (
              children.map(child => (
                <Link key={child.id} href={`/dashboard/students/${child.id}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="premium-card p-8 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none flex items-center justify-between group hover:border-blue-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-[2rem] bg-slate-50 dark:bg-blue-900/20 flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 transition-transform">
                        {child.avatar || '🎓'}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">{child.username}</h3>
                        <div className="flex items-center gap-2 text-emerald-500">
                           <CheckCircle2 size={14} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Conta Ativa</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight size={24} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modal de Cadastro */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-3xl relative z-[101] overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
              
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-slate-800 dark:text-white">Novo Aluno</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddChild} className="space-y-8">
                {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold text-center border border-red-100">{error}</div>}

                {/* Avatar Selection */}
                <div className="space-y-4 text-center">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Escolha um Avatar</label>
                   <div className="flex flex-wrap justify-center gap-3">
                      {avatars.map(a => (
                        <button 
                          key={a}
                          type="button"
                          onClick={() => setNewChild({...newChild, avatar: a})}
                          className={`w-12 h-12 text-2xl flex items-center justify-center rounded-2xl transition-all ${newChild.avatar === a ? 'bg-blue-600 scale-125 shadow-lg shadow-blue-500/30' : 'bg-slate-50 dark:bg-slate-800 hover:bg-blue-50'}`}
                        >
                          {a}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Aluno (Login)</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="text" 
                        className="input-field pl-12" 
                        placeholder="Ex: joao_genio" 
                        value={newChild.username}
                        onChange={e => setNewChild({...newChild, username: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Senha de Acesso</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="password" 
                        className="input-field pl-12" 
                        placeholder="Crie uma senha para seu filho" 
                        value={newChild.password}
                        onChange={e => setNewChild({...newChild, password: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-primary w-full py-5 text-lg shadow-2xl shadow-blue-500/30"
                >
                  {submitting ? <Loader2 className="animate-spin" size={24} /> : 'Concluir Cadastro'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
