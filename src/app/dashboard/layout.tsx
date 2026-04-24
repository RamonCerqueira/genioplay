import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar Universal */}
      <Sidebar role={session.user.role} />
      
      {/* Área de Conteúdo com Respiro */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-10 lg:p-16 transition-all duration-500">
          <div className="max-w-[1800px] mx-auto">
            {children}
          </div>
        </main>
        
        {/* Navegação Mobile */}
        <MobileNav role={session.user.role} />
      </div>
    </div>
  );
}
