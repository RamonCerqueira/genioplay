import prisma from "@/lib/prisma";
import { Coins, Flame, Trophy, Play, BookOpen, Star, Target, Brain, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import AchievementBadge from "../study/AchievementBadge";

export default async function StudentDashboard({ studentId }: { studentId: string }) {
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: {
      wallet: true,
      sessions: {
        orderBy: { startTime: 'desc' },
        take: 5
      }
    }
  });

  if (!student) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-2xl shadow-blue-500/20">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Olá, {student.username}! 👋
          </h1>
          <p className="text-blue-100 font-medium opacity-90">
            Você está mandando muito bem! Que tal começar a meta de hoje?
          </p>
          
          <div className="mt-6 flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-2xl flex items-center gap-3 border border-white/20">
              <Coins className="text-yellow-300 fill-yellow-300" size={20} />
              <span className="font-black text-lg">{student.wallet?.balance || 0}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-2xl flex items-center gap-3 border border-white/20">
              <Star className="text-orange-300 fill-orange-300" size={20} />
              <span className="font-black text-lg">Nível 4</span>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-5">
        <div className="premium-card p-6 border-orange-100 group hover:scale-[1.02] transition-all">
          <div className="flex items-center gap-3 text-orange-500 mb-3">
            <div className="bg-orange-50 p-2.5 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Flame size={20} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Ofensiva</span>
          </div>
          <p className="text-3xl font-black text-slate-800">5 Dias</p>
          <p className="text-[10px] text-slate-400 mt-1 font-bold">Amanhã você ganha bônus! 🔥</p>
        </div>
        
        <div className="premium-card p-6 border-blue-100 group hover:scale-[1.02] transition-all">
          <div className="flex items-center gap-3 text-blue-600 mb-3">
            <div className="bg-blue-50 p-2.5 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Target size={20} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Meta Diária</span>
          </div>
          <p className="text-3xl font-black text-slate-800">80%</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-full w-[80%] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
          </div>
        </div>
      </div>

      {/* Primary Action */}
      <Link href="/dashboard/study" className="block relative group">
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-orange-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative premium-card p-10 flex flex-col items-center justify-center gap-6 border-blue-100/50 overflow-hidden text-center">
          <div className="bg-blue-600 w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <Play size={40} fill="white" className="ml-1 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">Iniciar Sessão de Estudo</h3>
            <p className="text-slate-500 font-bold mt-2">Ganhe 50 🪙 por cada ciclo de foco completado!</p>
          </div>
          <div className="bg-blue-50 px-6 py-2 rounded-full border border-blue-100">
             <span className="text-blue-600 font-black text-xs uppercase tracking-widest">Pomodoro Ativo</span>
          </div>
        </div>
      </Link>

      {/* Achievements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-xl">
              <Trophy size={20} className="text-orange-600" />
            </div>
            Suas Conquistas
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AchievementBadge 
            icon={Flame} 
            title="Fogo no Estudo" 
            description="Complete 3 dias seguidos de estudo." 
            unlocked={true} 
            color="orange" 
          />
          <AchievementBadge 
            icon={Brain} 
            title="Mestre da IA" 
            description="Complete 5 conteúdos gerados pela IA." 
            unlocked={true} 
            color="blue" 
          />
          <AchievementBadge 
            icon={ShieldCheck} 
            title="Foco de Ouro" 
            description="Uma sessão inteira sem sair da aba." 
            unlocked={false} 
            color="emerald" 
          />
          <AchievementBadge 
            icon={Zap} 
            title="Velocidade Luz" 
            description="Termine um quiz em menos de 1 minuto." 
            unlocked={false} 
            color="indigo" 
          />
        </div>
      </div>

      {/* Activity Section */}
      <div className="space-y-5 pb-10">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <div className="bg-slate-100 p-2 rounded-xl">
              <BookOpen size={20} className="text-slate-600" />
            </div>
            Atividade Recente
          </h2>
          <button className="text-blue-600 text-sm font-black hover:underline">Ver tudo</button>
        </div>
        
        <div className="space-y-4">
          {student.sessions.length > 0 ? student.sessions.map((session) => (
            <div key={session.id} className="premium-card p-5 flex items-center justify-between border-slate-50 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-white shadow-sm p-3 rounded-2xl border border-slate-100">
                  <BookOpen size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-base font-black text-slate-800">Sessão de {Math.floor(session.focusTime / 60) || 25} min</p>
                  <p className="text-xs text-slate-400 font-bold">{new Date(session.startTime).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-emerald-600">+{session.pomodorosDone * 50 || 50} 🪙</p>
                <div className="flex items-center gap-1 justify-end">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Concluído</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="premium-card p-16 text-center border-dashed border-slate-200 bg-slate-50/50">
               <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 text-slate-300">
                 <Star size={32} />
               </div>
               <p className="text-slate-500 font-black">Sua jornada começa aqui!</p>
               <p className="text-slate-400 text-sm mt-1">Complete sua primeira sessão para ganhar moedas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
