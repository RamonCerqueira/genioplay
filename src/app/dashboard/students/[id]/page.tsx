'use client';

import React, { useState, useEffect } from 'react';
import { 
  Brain, Coins, Trophy, Zap, Clock, ChevronLeft, 
  Star, Flame, Target, BarChart3, PlusCircle, 
  Settings, ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function StudentManagePage({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'metrics'>('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    birthDate: '',
    newPassword: ''
  });

  useEffect(() => {
    // Busca dados detalhados do estudante para o responsável
    fetch(`/api/guardian/student-details?id=${params.id}`)
      .then(res => res.json())
      .then(data => {
        setStudent(data.student);
        setFormData({
          username: data.student.username || '',
          email: data.student.email || '',
          birthDate: data.student.birthDate ? data.student.birthDate.split('T')[0] : '',
          newPassword: ''
        });
        setLessons(data.lessons || []);
        setLoading(false);
      });
  }, [params.id]);

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/guardian/update-student', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id, ...formData })
      });
      if (res.ok) {
        alert('Dados atualizados com sucesso!');
        window.location.reload();
      }
    } catch (err) {
      alert('Erro ao atualizar');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!student) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-black text-slate-800 dark:text-white">Estudante não encontrado</h2>
      <Link href="/dashboard" className="btn-primary px-8 py-3">Voltar ao Painel</Link>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Header - Perfil do Filho */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-blue-600 transition-colors">
                <ChevronLeft size={24} />
              </Link>
              <div className="w-20 h-20 rounded-[2rem] bg-blue-600 flex items-center justify-center text-4xl shadow-xl shadow-blue-500/20">
                {student.avatar || '🎓'}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black text-slate-800 dark:text-white">{student.username}</h1>
                  <span className="badge bg-blue-50 text-blue-600 dark:bg-blue-900/30 font-black">Nível 5</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-bold">Gerenciando progresso de {student.username}</p>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
               <Link href={`/dashboard/generator?studentId=${student.id}`} className="btn-primary flex-1 md:flex-none py-3 px-6 flex items-center justify-center gap-2">
                  <PlusCircle size={20} /> Atribuir Lição
               </Link>
               <button className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-blue-600 transition-colors">
                  <Settings size={24} />
               </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-px overflow-x-auto">
             {[
               { id: 'overview', label: 'Visão Geral', icon: Zap },
               { id: 'metrics', label: 'Desempenho', icon: BarChart3 },
               { id: 'settings', label: 'Cadastro', icon: Settings }
             ].map(tab => (
               <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-black text-sm transition-all relative ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
               >
                 <tab.icon size={18} />
                 {tab.label}
                 {activeTab === tab.id && (
                   <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                 )}
               </button>
             ))}
          </div>

          {activeTab === 'overview' && (
            <>
              {/* Grid de Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="premium-card p-6 bg-white dark:bg-slate-900">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Saldo GênioCoins</p>
                    <div className="flex items-center gap-2">
                      <Coins className="text-orange-500" size={24} />
                      <span className="text-3xl font-black text-slate-800 dark:text-white">{student.wallet?.balance || 0}</span>
                    </div>
                </div>
                <div className="premium-card p-6 bg-white dark:bg-slate-900">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ofensiva Atual</p>
                    <div className="flex items-center gap-2">
                      <Flame className="text-rose-500" size={24} />
                      <span className="text-3xl font-black text-slate-800 dark:text-white">3 Dias</span>
                    </div>
                </div>
                <div className="premium-card p-6 bg-white dark:bg-slate-900">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Média de Acertos</p>
                    <div className="flex items-center gap-2">
                      <Target className="text-emerald-500" size={24} />
                      <span className="text-3xl font-black text-slate-800 dark:text-white">82%</span>
                    </div>
                </div>
                <div className="premium-card p-6 bg-white dark:bg-slate-900">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status Anti-Cheat</p>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="text-blue-500" size={24} />
                      <span className="text-sm font-black text-blue-500 uppercase">Protegido</span>
                    </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-10">
                {/* Lições Ativas */}
                <div className="lg:col-span-2 space-y-6">
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                    <Zap className="text-blue-600" size={28} /> Lições Ativas
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {lessons.length === 0 ? (
                      <div className="col-span-full premium-card p-12 text-center text-slate-400 font-bold border-dashed">
                        Nenhuma lição atribuída no momento.
                      </div>
                    ) : (
                      lessons.map(lesson => (
                        <div key={lesson.id} className="premium-card p-6 bg-white dark:bg-slate-900 hover:border-blue-200 transition-all group">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                              <Brain size={24} />
                            </div>
                            <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest">
                              Pendente
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                            {lesson.topic?.name || 'Assunto'}
                          </h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                            {lesson.topic?.subject?.name || 'Matéria'}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                              <Clock size={14} /> 15 min
                            </div>
                            <Link href={`/dashboard/reports?studentId=${student.id}`} className="text-xs font-black text-blue-600 hover:underline">
                              Ver Relatório
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Sidebar - Desempenho por Matéria */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                    <BarChart3 className="text-indigo-600" size={28} /> Habilidades
                  </h2>

                  <div className="premium-card p-8 bg-white dark:bg-slate-900 space-y-6">
                    {[
                      { name: 'Matemática', val: 85, color: 'bg-blue-500' },
                      { name: 'Português', val: 92, color: 'bg-emerald-500' },
                      { name: 'Ciências', val: 70, color: 'bg-orange-500' }
                    ].map(skill => (
                      <div key={skill.name} className="space-y-2">
                          <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                            <span className="text-slate-500">{skill.name}</span>
                            <span className="text-slate-800 dark:text-white">{skill.val}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.val}%` }}
                              className={`h-full ${skill.color}`}
                            />
                          </div>
                      </div>
                    ))}
                    
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-bold text-slate-500 text-center italic">
                          "A evolução em Português foi excelente nesta semana!" - IA GênioPlay
                        </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto premium-card p-10 bg-white dark:bg-slate-900 space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white">Dados de Cadastro</h2>
                <p className="text-slate-500 font-bold">Edite as informações de acesso do seu filho.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nome de Usuário</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">E-mail de Acesso</label>
                  <input 
                    type="email" 
                    className="input-field" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Data de Nascimento</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={formData.birthDate}
                    onChange={e => setFormData({...formData, birthDate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nova Senha (deixe em branco para manter)</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="input-field" 
                    value={formData.newPassword}
                    onChange={e => setFormData({...formData, newPassword: e.target.value})}
                  />
                </div>

                <div className="pt-6 flex gap-4">
                   <button 
                    onClick={handleUpdate}
                    disabled={isSaving}
                    className="btn-primary flex-1 py-4 shadow-xl shadow-blue-500/20"
                   >
                     {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                   </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="premium-card p-20 text-center space-y-6 bg-white dark:bg-slate-900">
               <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                  <BarChart3 size={40} />
               </div>
               <div className="space-y-2">
                 <h2 className="text-2xl font-black text-slate-800 dark:text-white">Relatórios de Inteligência</h2>
                 <p className="text-slate-500 font-bold max-w-sm mx-auto">
                    Estamos processando os dados de aprendizado para gerar gráficos de evolução detalhados por matéria.
                 </p>
               </div>
               <Link href={`/dashboard/reports?studentId=${student.id}`} className="btn-primary px-8 py-3.5 inline-flex">
                  Ver Boletim Atual
               </Link>
            </div>
          )}
        </div>
    </div>
  );
}
