'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, BarChart3, MessageSquare, Settings, ChevronLeft, PlusCircle
} from 'lucide-react';
import Link from 'next/link';

// Importando nossos novos componentes modulares
import { OverviewTab } from '@/components/dashboard/family/OverviewTab';
import { InteractionsTab } from '@/components/dashboard/family/InteractionsTab';
import { MetricsTab } from '@/components/dashboard/family/MetricsTab';
import { SettingsTab } from '@/components/dashboard/family/SettingsTab';
import { ParentalModal } from '@/components/dashboard/family/ParentalModal';
import { motion } from 'framer-motion';

export default function StudentManagePage({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({
    averageScore: 0,
    totalAnswers: 0,
    completedLessons: 0,
    streak: 0,
    walletBalance: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'metrics' | 'interactions'>('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    birthDate: '',
    newPassword: ''
  });

  const [isParentalModalOpen, setIsParentalModalOpen] = useState(false);

  useEffect(() => {
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
        setMetrics(data.metrics || metrics);
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
      if (res.ok) alert('Dados atualizados!');
    } catch (err) {
      alert('Erro ao atualizar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleParentalAction = (action: string) => {
    if (action === 'coins') alert('50 Moedas enviadas!');
    if (action === 'password' || action === 'edit') setActiveTab('settings');
    setIsParentalModalOpen(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="pb-20 max-w-7xl mx-auto px-6">
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Header Moderno */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-6">
                <Link href="/dashboard" className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-blue-600 transition-all">
                  <ChevronLeft size={24} />
                </Link>
                <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-5xl shadow-2xl border-4 border-white dark:border-slate-800">
                  {student.avatar || '🎓'}
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-800 dark:text-white">{student.username}</h1>
                  <p className="text-slate-500 font-bold">Gerenciando a jornada épica de {student.username}</p>
                </div>
              </div>

              <div className="flex gap-3">
                 <Link href={`/dashboard/generator?studentId=${student.id}`} className="btn-primary py-3 px-8 flex items-center gap-2">
                    <PlusCircle size={20} /> Nova Lição
                 </Link>
                 <button 
                  onClick={() => setIsParentalModalOpen(true)}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-blue-600 transition-all"
                 >
                    <Settings size={24} />
                 </button>
              </div>
            </div>

            {/* Abas de Navegação */}
            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
               {[
                 { id: 'overview', label: 'Visão Geral', icon: Zap },
                 { id: 'metrics', label: 'Desempenho', icon: BarChart3 },
                 { id: 'interactions', label: 'Interações IA', icon: MessageSquare },
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

            {/* Conteúdo das Abas */}
            <div className="py-4">
               {activeTab === 'overview' && <OverviewTab metrics={metrics} lessons={lessons} studentId={student.id} studentName={student.username} />}
               {activeTab === 'interactions' && <InteractionsTab studentName={student.username} />}
               {activeTab === 'metrics' && <MetricsTab studentId={student.id} />}
               {activeTab === 'settings' && <SettingsTab formData={formData} setFormData={setFormData} handleUpdate={handleUpdate} isSaving={isSaving} />}
            </div>
      </div>

      {/* Modal de Controle Parental */}
      <ParentalModal 
        isOpen={isParentalModalOpen} 
        onClose={() => setIsParentalModalOpen(false)} 
        studentName={student.username} 
        onAction={handleParentalAction}
      />
    </div>
  );
}
