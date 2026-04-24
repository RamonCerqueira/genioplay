import prisma from "@/lib/prisma";
import { Users, Plus, Award, TrendingUp, AlertTriangle, ShieldCheck, Sparkles, BrainCircuit, Heart, Timer } from "lucide-react";
import Link from "next/link";
import GuardianCharts from "./GuardianCharts";
import GuardianNotificationListener from "./GuardianNotificationListener";
import ConnectChild from "./ConnectChild";
import OnboardingWizard from "./OnboardingWizard";

export default async function GuardianDashboard({ guardianId }: { guardianId: string }) {
  const guardian = await prisma.user.findUnique({
    where: { id: guardianId },
    include: {
      guardianOf: {
        include: {
          student: {
            include: {
              wallet: true,
              sessions: {
                take: 1,
                orderBy: { startTime: 'desc' }
              }
            }
          }
        }
      }
    }
  });

  if (!guardian) return null;

  const showOnboarding = guardian.guardianOf.length === 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <GuardianNotificationListener guardianId={guardianId} />
      
      {showOnboarding && <OnboardingWizard guardianId={guardianId} guardianName={guardian.username} />}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <ShieldCheck className="text-blue-600" size={32} />
            Painel de Controle
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Gestão pedagógica e controle parental inteligente</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Bem-vindo,</p>
              <p className="text-sm font-black text-slate-800 dark:text-white">{guardian.username}</p>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
              <Users size={24} />
           </div>
        </div>
      </div>

      {/* Quick Stats & Chart */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 premium-card p-8 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Engajamento Semanal</h3>
            <p className="text-sm font-bold text-slate-400 mb-6">Média de horas dedicadas aos estudos</p>
            <GuardianCharts />
          </div>
        </div>

        <div className="space-y-6">
          <div className="premium-card p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
              <Sparkles size={140} />
            </div>
            <h4 className="text-lg font-black mb-1">GênioPlay Premium</h4>
            <p className="text-sm font-bold text-blue-100 mb-6">Acesso ilimitado a todas as IAs e relatórios avançados.</p>
            <Link href="/dashboard/subscription" className="inline-block px-6 py-3 bg-white text-blue-600 font-black rounded-xl shadow-lg hover:scale-105 transition-transform">
              Ver Planos
            </Link>
          </div>

          <div className="premium-card p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800 dark:text-white">Alertas de Foco</h4>
                <p className="text-xs font-bold text-slate-400">Nenhum desvio detectado hoje.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <Heart className="text-rose-500" size={28} /> Meus Filhos
          </h3>
          <ConnectChild guardianId={guardianId} />
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {guardian.guardianOf.map((member) => (
            <Link 
              key={member.student.id} 
              href={`/dashboard/students/${member.student.id}`}
              className="premium-card p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl hover:border-blue-200 transition-all group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-colors">
                  {member.student.avatar ? (
                    <img src={member.student.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    "🎓"
                  )}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 dark:text-white text-lg group-hover:text-blue-600 transition-colors">
                    {member.student.username}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Award size={12} className="text-yellow-500" /> Nível 5 - Explorador
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Moedas</p>
                  <p className="text-xl font-black text-blue-600 flex items-center gap-1">
                    <Sparkles size={18} /> {member.student.wallet?.balance || 0}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                  <p className="text-xs font-black text-emerald-500 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Ativo Agora
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-1">
                  <Timer size={14} /> Último acesso: Hoje
                </div>
                <div className="text-blue-600 font-black">Ver Relatório →</div>
              </div>
            </Link>
          ))}
          
          {guardian.guardianOf.length === 0 && (
            <div className="md:col-span-3 premium-card p-20 bg-slate-50 dark:bg-slate-900/50 border-dashed border-2 flex flex-col items-center gap-4 text-center">
              <BrainCircuit className="text-slate-300" size={64} />
              <p className="text-slate-500 font-bold">Nenhum filho conectado ainda.<br/>Clique no botão "+" acima para começar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
