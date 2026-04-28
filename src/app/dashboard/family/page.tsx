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
  Pencil,
  Trash2,
  DollarSign,
  TrendingUp,
  Clock,
  Baby,
  Eye,
  EyeOff,
  History,
  GraduationCap,
  MessageSquare,
  Search,
  Check,
  ShieldCheck,
  Brain,
  Star,
  UserCircle,
  Target,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PedagogicalAI } from '@/components/dashboard/PedagogicalAI';
import { EpicGoalManager } from '@/components/dashboard/EpicGoalManager';
import { HyperfocusControl } from '@/components/dashboard/HyperfocusControl';

type TabType = 'perfil' | 'historico' | 'notas' | 'chat' | 'conquistas' | 'meta';

export default function FamilyPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('perfil');
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: 'perfil', label: 'Editar Perfil', icon: <UserCircle size={16} /> },
    { id: 'meta', label: 'Meta Épica', icon: <Target size={16} /> },
    { id: 'historico', label: 'Acessos', icon: <History size={16} /> },
    { id: 'notas', label: 'Notas', icon: <GraduationCap size={16} /> },
    { id: 'conquistas', label: 'Conquistas', icon: <Trophy size={16} /> },
    { id: 'chat', label: 'Tutor IA', icon: <MessageSquare size={16} /> },
  ];

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

  const openEditModal = (child: any) => {
    setIsEditing(true);
    setSelectedChild(child);
    setNewChild({
      username: child.username || '',
      email: child.email || '',
      birthDate: child.birthDate ? new Date(child.birthDate).toISOString().split('T')[0] : '',
      password: '',
      gradeLevel: child.gradeLevel || '',
      avatar: child.avatar || '🎓'
    });
    setActiveTab('perfil');
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setSelectedChild(null);
    setNewChild({ username: '', email: '', birthDate: '', password: '', gradeLevel: '', avatar: '🎓' });
    setActiveTab('perfil');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const endpoint = isEditing ? '/api/family/update' : '/api/family/add';
    const payload = isEditing ? { ...newChild, id: selectedChild.id } : newChild;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchChildren();
      } else {
        setError(data.error || 'Erro ao processar');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setSubmitting(false);
    }
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length > 6) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength(newChild.password);
  const strengthColor = strength === 0 ? 'bg-slate-200' : strength === 1 ? 'bg-red-500' : strength === 2 ? 'bg-orange-500' : strength === 3 ? 'bg-yellow-500' : 'bg-emerald-500';
  const strengthText = strength === 0 ? 'Vazia' : strength === 1 ? 'Fraca' : strength === 2 ? 'Razoável' : strength === 3 ? 'Boa' : 'Excelente';

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
          onClick={openAddModal}
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
              onClick={openAddModal}
              className="btn-primary px-10 py-4 shadow-xl shadow-blue-500/20"
            >
              Cadastrar Filho
            </button>
          </div>
        ) : (
          children.map(child => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col group"
            >
              {/* Top Header - Info Básica */}
              <div className="p-8 flex items-center justify-between border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-white dark:bg-slate-800 flex items-center justify-center text-4xl shadow-sm border border-slate-100 dark:border-slate-700">
                    {child.avatar || '🎓'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white">{child.username}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full uppercase">{child.gradeLevel}</span>
                      <span className="text-[10px] font-bold text-slate-400">• Estudante GênioPlay</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openEditModal(child)}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-blue-600 border border-slate-100 dark:border-slate-700 transition-all flex items-center justify-center shadow-sm"
                  title="Perfil e Configurações"
                >
                  <User size={16} />
                </button>
              </div>

              {/* Body - Stats e Matérias */}
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100/50 flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Moedas Gênio</p>
                      <p className="text-xl font-black text-slate-800 dark:text-white">{child.walletBalance}</p>
                    </div>
                  </div>
                  <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100/50 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Nível XP</p>
                      <p className="text-xl font-black text-slate-800 dark:text-white">Master</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Desempenho por Matéria</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {child.skills?.length > 0 ? child.skills.map((skill: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">{skill.subjectName}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-black text-blue-600">{skill.elo}</span>
                      </div>
                    )) : (
                      <p className="text-xs font-bold text-slate-400 italic">Nenhum progresso registrado ainda.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal de Perfil "Social" / Edição */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="w-full max-w-6xl h-[90vh] bg-white dark:bg-slate-900 rounded-[3rem] shadow-3xl relative z-[101] overflow-hidden flex flex-col md:flex-row"
            >
              {/* Sidebar do Perfil */}
              <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-800/50 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 p-4 md:p-8 flex flex-col items-center shrink-0">
                <div className="flex md:flex-col items-center gap-4 md:gap-0 w-full md:w-auto">
                  <div className="relative mb-0 md:mb-8 shrink-0">
                    <div className="w-16 h-16 md:w-32 md:h-32 bg-white dark:bg-slate-800 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-3xl md:text-6xl shadow-xl border-2 md:border-4 border-white dark:border-slate-700">
                      {newChild.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-6 h-6 md:w-10 md:h-10 bg-blue-600 text-white rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg border-2 md:border-4 border-slate-50 dark:border-slate-800">
                      <Star size={12} className="md:w-4 md:h-4" fill="currentColor" />
                    </div>
                  </div>

                  <div className="text-left md:text-center md:mb-10 flex-1">
                    <h2 className="text-lg md:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                      {newChild.username || 'Novo Aluno'}
                    </h2>
                    <p className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">
                      {newChild.gradeLevel || 'Sem série'}
                    </p>
                  </div>
                </div>

                {/* Tabs / Menu Navigation */}
                <div className="w-full flex md:flex-col gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0 mt-4 md:mt-0">
                  <TabButton
                    active={activeTab === 'perfil'}
                    onClick={() => setActiveTab('perfil')}
                    icon={<User size={18} />}
                    label="Editar Perfil"
                  />
                  {isEditing && (
                    <>
                      <TabButton
                        active={activeTab === 'historico'}
                        onClick={() => setActiveTab('historico')}
                        icon={<History size={18} />}
                        label="Histórico de Acesso"
                      />
                      <TabButton
                        active={activeTab === 'notas'}
                        onClick={() => setActiveTab('notas')}
                        icon={<GraduationCap size={18} />}
                        label="Notas e Desempenho"
                      />
                      <TabButton
                        active={activeTab === 'chat'}
                        onClick={() => setActiveTab('chat')}
                        icon={<MessageSquare size={18} />}
                        label="Pesquisas e Tutor"
                      />
                      <TabButton
                        active={activeTab === 'conquistas'}
                        onClick={() => setActiveTab('conquistas')}
                        icon={<Star size={18} />}
                        label="Conquistas e Selos"
                      />
                    </>
                  )}
                </div>

                <div className="hidden md:flex mt-auto pt-10 w-full">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-black rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <X size={18} /> Fechar
                  </button>
                </div>
              </div>

              {/* Área de Conteúdo Central */}
              <div className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar relative">
                {/* Fechar Mobile */}
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="md:hidden absolute top-4 right-4 w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 z-10"
                >
                  <X size={18} />
                </button>
                <AnimatePresence mode="wait">
                  {activeTab === 'perfil' && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="max-w-2xl mx-auto"
                    >
                      <div className="mb-8 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white pr-10 md:pr-0">Dados do Gênio</h3>
                        <div className="flex gap-2">
                          {avatars.map(a => (
                            <button
                              key={a}
                              onClick={() => setNewChild({ ...newChild, avatar: a })}
                              className={`w-10 h-10 text-xl flex items-center justify-center rounded-xl transition-all ${newChild.avatar === a ? 'bg-blue-600 shadow-lg' : 'bg-slate-100 dark:bg-slate-800 hover:bg-blue-50'}`}
                            >
                              {a}
                            </button>
                          ))}
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-8">
                        {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold text-center border border-red-100">{error}</div>}

                        <div className="grid md:grid-cols-2 gap-8">
                          <InputGroup
                            label="Nome de Usuário"
                            icon={<User size={18} />}
                            placeholder="Ex: joao_genio"
                            value={newChild.username}
                            onChange={(v) => setNewChild({ ...newChild, username: v })}
                          />
                          <InputGroup
                            label="E-mail de Acesso"
                            icon={<Mail size={18} />}
                            placeholder="filho@email.com"
                            value={newChild.email}
                            onChange={(v) => setNewChild({ ...newChild, email: v })}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Série / Ano Escolar</label>
                            <select
                              className="input-field h-14 text-sm appearance-none"
                              value={newChild.gradeLevel}
                              onChange={e => setNewChild({ ...newChild, gradeLevel: e.target.value })}
                              required
                            >
                              <option value="">Selecione a série...</option>
                              <optgroup label="Fundamental I">
                                <option value="1º Ano">1º Ano</option>
                                <option value="2º Ano">2º Ano</option>
                                <option value="3º Ano">3º Ano</option>
                                <option value="4º Ano">4º Ano</option>
                                <option value="5º Ano">5º Ano</option>
                              </optgroup>
                              <optgroup label="Fundamental II">
                                <option value="6º Ano">6º Ano</option>
                                <option value="7º Ano">7º Ano</option>
                                <option value="8º Ano">8º Ano</option>
                                <option value="9º Ano">9º Ano</option>
                              </optgroup>
                              <optgroup label="Ensino Médio">
                                <option value="1ª Série">1ª Série</option>
                                <option value="2ª Série">2ª Série</option>
                                <option value="3ª Série">3ª Série (Vestibular)</option>
                              </optgroup>
                            </select>
                          </div>
                          <InputGroup
                            label="Data de Nascimento"
                            type="date"
                            icon={<Calendar size={18} />}
                            value={newChild.birthDate}
                            onChange={(v) => setNewChild({ ...newChild, birthDate: v })}
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="relative">
                            <InputGroup
                              label={isEditing ? 'Nova Senha (deixe vazio para manter)' : 'Senha de Acesso'}
                              type={showPassword ? 'text' : 'password'}
                              icon={<Lock size={18} />}
                              placeholder="••••••"
                              value={newChild.password}
                              onChange={(v) => setNewChild({ ...newChild, password: v })}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-5 top-12 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>

                          {/* Password Strength Meter */}
                          {newChild.password && (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-400">Força da Senha</span>
                                <span className={strength <= 2 ? 'text-red-500' : 'text-emerald-500'}>{strengthText}</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1">
                                {[...Array(4)].map((_, i) => (
                                  <div key={i} className={`h-full flex-1 transition-all duration-500 ${i < strength ? strengthColor : 'bg-transparent'}`} />
                                ))}
                              </div>
                              <p className="text-[10px] text-slate-400 font-bold">Use letras maiúsculas, números e caracteres especiais.</p>
                            </div>
                          )}
                        </div>

                        <div className="pt-10">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary w-full py-5 text-lg font-black shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3"
                          >
                            {submitting ? <Loader2 className="animate-spin" size={24} /> : (
                              <>
                                <ShieldCheck size={24} />
                                {isEditing ? 'Atualizar Perfil do Gênio' : 'Finalizar Cadastro Épico'}
                              </>
                            )}
                          </button>
                        </div>
                      </form>

                      {isEditing && (
                        <div className="mt-12">
                          <HyperfocusControl studentId={selectedChild?.id} />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'meta' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <EpicGoalManager studentId={selectedChild.id} />
                    </motion.div>
                  )}

                  {activeTab === 'historico' && (
                    <motion.div key="historico" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                      <h3 className="text-3xl font-black text-slate-800 dark:text-white">Linha do Tempo</h3>
                      <div className="space-y-6">
                        {selectedChild?.sessions?.length > 0 ? selectedChild.sessions.map((s: any, i: number) => (
                          <div key={i} className="flex gap-6 relative group">
                            <div className="w-12 flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 z-10 border-4 border-white dark:border-slate-900 shadow-md">
                                <Clock size={18} />
                              </div>
                              {i < selectedChild.sessions.length - 1 && (
                                <div className="w-1 h-full bg-slate-100 dark:bg-slate-800 -mt-2" />
                              )}
                            </div>
                            <div className="flex-1 pb-10">
                              <div className="premium-card p-6 bg-slate-50/50 dark:bg-slate-800/30 border-none group-hover:bg-white dark:group-hover:bg-slate-800 transition-all shadow-none group-hover:shadow-xl">
                                <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">
                                  {new Date(s.startTime).toLocaleDateString()} - {new Date(s.startTime).toLocaleTimeString()}
                                </p>
                                <h4 className="text-lg font-black text-slate-800 dark:text-white">Sessão de Foco Completa</h4>
                                <p className="text-sm font-bold text-slate-500 mt-2">
                                  {s.pomodorosDone} ciclos de foco realizados com sucesso.
                                </p>
                              </div>
                            </div>
                          </div>
                        )) : <p className="text-slate-400 font-bold text-center py-20">Nenhum registro de acesso encontrado.</p>}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'notas' && (
                    <motion.div key="notas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                      <h3 className="text-3xl font-black text-slate-800 dark:text-white">Boletim Gênio</h3>

                      <PedagogicalAI studentId={selectedChild.id} />

                      {/* Radar Chart Mock / Skills */}
                      <div className="grid md:grid-cols-2 gap-8">
                        {selectedChild?.skills?.map((s: any, i: number) => (
                          <div key={i} className="premium-card p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-none shadow-xl">
                            <div className="flex justify-between items-center mb-6">
                              <h4 className="text-xl font-black text-slate-800 dark:text-white">{s.subjectName}</h4>
                              <div className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-black">ELO {s.elo}</div>
                            </div>
                            <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]" style={{ width: `${Math.min(100, (s.elo - 800) / 4)}%` }} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Nível de Proficiência IA</p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Últimas Atividades</h4>
                        <div className="space-y-4">
                          {selectedChild?.recentLessons?.length > 0 ? selectedChild.recentLessons.map((l: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-emerald-600 shadow-sm"><CheckCircle2 /></div>
                                <div>
                                  <p className="text-lg font-black text-slate-800 dark:text-white">{l.topic.subject.name}: {l.topic.name}</p>
                                  <p className="text-xs font-bold text-emerald-600 uppercase">
                                    {l.score}/100 Acertos • +{l.coinsEarned || 0} LarCoins
                                  </p>
                                </div>
                              </div>
                              <span className="text-2xl font-black text-emerald-600">
                                {l.score >= 90 ? 'A+' : l.score >= 80 ? 'A' : l.score >= 70 ? 'B' : 'C'}
                              </span>
                            </div>
                          )) : (
                            <p className="text-sm font-bold text-slate-400 italic text-center py-10">Nenhuma lição concluída ainda.</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'chat' && (
                    <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                      <div className="flex justify-between items-center">
                        <h3 className="text-3xl font-black text-slate-800 dark:text-white">Interações com IA</h3>
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input className="pl-10 pr-6 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs font-bold w-64" placeholder="Buscar conversas..." />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="premium-card p-0 overflow-hidden border-slate-100 dark:border-slate-800">
                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><MessageSquare size={16} /></div>
                            <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Chat com Tutor Gênio</p>
                          </div>
                          <div className="p-6 space-y-6 max-h-[400px] overflow-y-auto">
                            <div className="flex gap-4">
                              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">🎓</div>
                              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none text-sm font-bold text-slate-700 dark:text-slate-300">
                                O que é a fotossíntese exatamente? Não entendi a parte das plantas.
                              </div>
                            </div>
                            <div className="flex gap-4 flex-row-reverse">
                              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 text-white shadow-lg shadow-blue-500/20"><Brain size={16} /></div>
                              <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none text-sm font-bold text-white shadow-xl shadow-blue-500/10">
                                Imagine que as folhas são pequenas cozinhas, e o Sol é o fogão! A planta usa a luz para cozinhar o "açúcar" dela usando água e ar. 🌿✨
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tópicos Pesquisados recentemente</p>
                          <div className="flex flex-wrap gap-2">
                            {['Revolução Francesa', 'Célula Animal', 'Geometria Espacial', 'Pronomes', 'Tabela Periódica'].map(t => (
                              <div key={t} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-black text-slate-600 dark:text-slate-400 flex items-center gap-2 hover:border-blue-300 transition-all cursor-default">
                                <Search size={12} /> {t}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'conquistas' && (
                    <motion.div key="badges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                      <div className="flex justify-between items-center">
                        <h3 className="text-3xl font-black text-slate-800 dark:text-white">Galeria de Conquistas</h3>
                        <div className="px-4 py-2 bg-amber-100 text-amber-700 rounded-2xl text-xs font-black flex items-center gap-2">
                          <Star size={16} fill="currentColor" /> {selectedChild?.studentBadges?.length || 0} Emblemas
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {selectedChild?.studentBadges?.length > 0 ? selectedChild.studentBadges.map((sb: any, i: number) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="premium-card p-6 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 flex flex-col items-center text-center space-y-4 shadow-xl"
                          >
                            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center shadow-inner overflow-hidden">
                              <img
                                src={sb.badge.icon}
                                alt={sb.badge.name}
                                className="w-16 h-16 object-contain drop-shadow-md"
                              />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{sb.badge.name}</h4>
                              <p className="text-[10px] font-bold text-slate-400 mt-1">{sb.badge.description}</p>
                            </div>
                            <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest pt-2">Conquistado em {new Date(sb.earnedAt).toLocaleDateString()}</p>
                          </motion.div>
                        )) : (
                          <div className="col-span-full py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mx-auto">
                              <Star size={40} />
                            </div>
                            <p className="text-slate-400 font-bold italic">Seu filho ainda não conquistou emblemas épicos.</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Componentes Auxiliares ---

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-auto md:w-full p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-4 transition-all duration-300 group shrink-0
        ${active
          ? 'bg-blue-600 text-white shadow-lg md:shadow-xl shadow-blue-500/30'
          : 'bg-slate-100 dark:bg-slate-800/50 md:bg-transparent text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600'
        }
      `}
    >
      <div className={`transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className="text-xs md:text-sm font-black uppercase tracking-tight whitespace-nowrap">{label}</span>
      {active && <ChevronRight className="hidden md:block ml-auto" size={16} />}
    </button>
  );
}

function InputGroup({ label, icon, value, onChange, placeholder, type = 'text' }: { label: string, icon: any, value: string, onChange: (v: string) => void, placeholder?: string, type?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field pl-14 h-14 text-sm font-bold"
          required={type !== 'password'}
        />
      </div>
    </div>
  );
}
