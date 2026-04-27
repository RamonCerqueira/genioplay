'use client';

import React, { useState, useEffect } from 'react';
import { StudentHeader } from '@/components/dashboard/student/StudentHeader';
import { TutorChat } from '@/components/dashboard/student/TutorChat';
import { DailyMissions } from '@/components/dashboard/student/DailyMissions';
import { StatsCards } from '@/components/dashboard/student/StatsCards';
import { BadgeGallery } from '@/components/dashboard/student/BadgeGallery';
import { BadgeAchievement } from '@/components/dashboard/student/BadgeAchievement';
import { EpicGoalTracker } from '@/components/dashboard/student/EpicGoalTracker';
import { HyperfocusAlert } from '@/components/dashboard/student/HyperfocusAlert';

export default function StudentDashboard() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [newBadgeCelebration, setNewBadgeCelebration] = useState<any>(null);
  const [studentName, setStudentName] = useState('Estudante');
  const [stats, setStats] = useState({
    balance: 0,
    streak: 0,
    xp: 0,
    progress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/dashboard-data')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setLessons(data.lessons || []);
          
          // Detecta nova conquista
          if (badges.length > 0 && data.badges && data.badges.length > badges.length) {
            setNewBadgeCelebration(data.badges[data.badges.length - 1]);
          }
          
          setBadges(data.badges || []);
          setStudentName(data.username || 'Estudante');
          setStats(prev => ({ 
            ...prev, 
            balance: data.balance || 0,
            xp: data.xp || 1250,
            streak: data.streak || 3
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [badges.length]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 pt-12">
      <div className="space-y-12">
        
        {/* Cabeçalho Modular - Corrigido com Respiro */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <StudentHeader 
            name={studentName} 
            xp={stats.xp} 
            missionsCount={lessons.length} 
            progress={stats.progress} 
          />
        </div>

        <EpicGoalTracker />

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Coluna da Esquerda: Estatísticas */}
          <div className="lg:col-span-4 space-y-8">
            <StatsCards streak={stats.streak} walletBalance={stats.balance} />
            <BadgeGallery badges={badges} />
          </div>

          {/* Coluna da Direita: Missões do Dia */}
          <div className="lg:col-span-8">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <DailyMissions missions={lessons} />
            </div>
          </div>
        </div>
      </div>

      <BadgeAchievement 
        newBadge={newBadgeCelebration} 
        onComplete={() => setNewBadgeCelebration(null)} 
      />

      <HyperfocusAlert />

      {/* Tutor Gênio Flutuante */}
      <TutorChat />
    </div>
  );
}
