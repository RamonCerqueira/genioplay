import prisma from "@/lib/prisma";
import { Users, Plus, Award, TrendingUp, AlertTriangle, ShieldCheck, Sparkles, BrainCircuit } from "lucide-react";
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
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <ShieldCheck className="text-blue-600" size={32} />
            Painel de Controle
          </h1>
          <p className="text-slate-500 font-bold">Gestão pedagógica e controle parental inteligente</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Bem-vindo,</p>
              <p className="text-sm font-black text-slate-800">{guardian.username}</p>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Users size={24} />
           </div>
        </div>
      </div>
