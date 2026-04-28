import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { BadgeUnlockModal } from "@/components/dashboard/BadgeUnlockModal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Sidebar Universal */}
      <Sidebar role={session.user.role} />
      
      {/* Área de Conteúdo com Respiro */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 p-6 pb-32 md:pb-10 md:p-10 lg:p-16 pt-0 lg:pt-0 transition-all duration-500">
          <div className="max-w-[1800px] mx-auto">
            {children}
          </div>
        </main>
        
        {/* Navegação Mobile */}
        <MobileNav role={session.user.role} />
      </div>

      {/* Modal Global de Conquistas (Apenas para Alunos) */}
      {session.user.role === 'STUDENT' && <BadgeUnlockModal />}
    </div>
  );
}
