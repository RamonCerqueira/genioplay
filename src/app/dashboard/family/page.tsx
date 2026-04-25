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
  Mail,
  Calendar,
  Baby
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function FamilyPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChild, setNewChild] = useState({ 
    username: '', 
    email: '',
    birthDate: '',
    password: '', 
    gradeLevel: '',
    avatar: '🎓' 
  });
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
        setNewChild({ username: '', email: '', birthDate: '', password: '', gradeLevel: '', avatar: '🎓' });
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
    <div className="space-y-12 pb-20">
          
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
              Novo Filho
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              [1, 2].map(i => <div key={i} className="h-44 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] animate-pulse border border-slate-100 dark:border-slate-800" />)
            ) : children.length === 0 ? (
              <div className="md:col-span-2 premium-card p-16 bg-white dark:bg-slate-900 border-dashed border-2 border-slate-200 dark:border-slate-800 flex flex-col items-center text-center space-y-8">
                <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 shadow-inner">
                   <Baby size={48} />
                </div>
                <div className="space-y-3">
                   <h3 className="text-2xl font-black text-slate-800 dark:text-white">Ainda não há filhos cadastrados</h3>
                   <p className="text-slate-500 dark:text-slate-400 font-bold max-w-md mx-auto">
                     Adicione seus filhos para começar a acompanhar o progresso e transformar a educação deles em uma jornada épica.
                   </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary px-10 py-4 shadow-xl shadow-blue-500/20"
                >
                  Cadastrar Filho
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

      {/* Modal de Cadastro - Compacto e Premium */}
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
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-3xl relative z-[101] overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
              
              <div className="flex justify-between items-center mb-6">
                <div>
                   <h2 className="text-2xl font-black text-slate-800 dark:text-white">Novo Filho</h2>
                   <p className="text-xs font-bold text-slate-500">Crie a conta de acesso para seu pequeno gênio.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddChild} className="space-y-6">
                {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold text-center border border-red-100">{error}</div>}

                {/* Avatar Selection - Mais compacto */}
                <div className="flex flex-wrap justify-center gap-2">
                  {avatars.map(a => (
                    <button 
                      key={a}
                      type="button"
                      onClick={() => setNewChild({...newChild, avatar: a})}
                      className={`w-10 h-10 text-xl flex items-center justify-center rounded-xl transition-all ${newChild.avatar === a ? 'bg-blue-600 scale-110 shadow-lg shadow-blue-500/30' : 'bg-slate-50 dark:bg-slate-800 hover:bg-blue-50'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Filho</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        className="input-field pl-12 h-12 text-sm" 
                        placeholder="Ex: João Silva" 
                        value={newChild.username}
                        onChange={e => setNewChild({...newChild, username: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail de Acesso</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        className="input-field pl-12 h-12 text-sm" 
                        placeholder="filho@email.com" 
                        value={newChild.email}
                        onChange={e => setNewChild({...newChild, email: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Série / Ano Escolar</label>
                    <select 
                      className="input-field h-12 text-sm appearance-none"
                      value={newChild.gradeLevel}
                      onChange={e => setNewChild({...newChild, gradeLevel: e.target.value})}
                      required
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nascimento</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="date" 
                          className="input-field pl-12 h-12 text-sm" 
                          value={newChild.birthDate}
                          onChange={e => setNewChild({...newChild, birthDate: e.target.value})}
                          required 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="password" 
                          className="input-field pl-12 h-12 text-sm" 
                          placeholder="••••••" 
                          value={newChild.password}
                          onChange={e => setNewChild({...newChild, password: e.target.value})}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-primary w-full py-4 font-black shadow-xl shadow-blue-500/20"
                >
                  {submitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Cadastrar Filho'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
