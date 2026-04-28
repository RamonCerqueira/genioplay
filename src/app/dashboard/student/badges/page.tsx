import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ShieldCheck, Trophy, Lock, Sparkles } from 'lucide-react';
import { BADGES } from '@/lib/badges';
import Image from 'next/image';

export default async function BadgesGalleryPage() {
  const session = await getSession();
  if (!session || session.user.role !== 'STUDENT') {
    redirect('/dashboard');
  }

  // Buscar emblemas conquistados pelo aluno
  const studentBadges = await prisma.studentBadge.findMany({
    where: { studentId: session.user.id },
    include: { badge: true },
    orderBy: { earnedAt: 'desc' }
  });

  const earnedBadgeNames = studentBadges.map(sb => sb.badge.name);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4 mb-16 mt-8">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-amber-500/40 border-4 border-amber-300 relative">
          <Trophy size={48} className="text-white drop-shadow-lg" />
          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg border-2 border-[#020617]">
            {earnedBadgeNames.length} / {BADGES.length}
          </div>
        </div>
        <h1 className="text-5xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
          Suas <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 italic">Conquistas</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
          Cada emblema representa um marco épico na sua jornada de aprendizado. Cumpra missões e destrave todos!
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {BADGES.map((badgeDef, i) => {
          const isEarned = earnedBadgeNames.includes(badgeDef.name);
          const earnedInfo = studentBadges.find(sb => sb.badge.name === badgeDef.name);

          return (
            <div 
              key={i}
              className={`relative overflow-hidden rounded-[2.5rem] border p-6 flex flex-col items-center text-center transition-all duration-500 ${
                isEarned 
                  ? 'bg-white dark:bg-slate-900 border-amber-500/30 shadow-xl shadow-amber-500/10 hover:-translate-y-2' 
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60 grayscale'
              }`}
            >
              {isEarned && (
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.1)_0%,transparent_70%)] pointer-events-none" />
              )}
              
              {/* Badge Icon */}
              <div className="relative w-32 h-32 mb-6 drop-shadow-2xl">
                {isEarned ? (
                  <img src={badgeDef.icon} alt={badgeDef.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Lock size={40} className="text-slate-400" />
                  </div>
                )}
                {isEarned && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-lg">
                    <Sparkles size={16} className="text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <h3 className={`text-xl font-black uppercase tracking-tight mb-2 ${isEarned ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                {badgeDef.name}
              </h3>
              <p className="text-xs font-bold text-slate-400 leading-relaxed mb-4">
                {badgeDef.description}
              </p>

              {/* Status/Date */}
              {isEarned ? (
                <div className="mt-auto inline-block px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Conquistado
                </div>
              ) : (
                <div className="mt-auto inline-block px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Bloqueado
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
