import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

export default async function AdminMasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.user.role !== 'ADMIN') {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-slate-900 flex relative overflow-hidden text-slate-100">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Sidebar de Admin */}
      <Sidebar role="ADMIN" />
      
      {/* Área de Conteúdo */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-10 lg:p-16 transition-all duration-500">
          <div className="max-w-[1800px] mx-auto">
            {children}
          </div>
        </main>
        
        {/* Navegação Mobile de Admin */}
        <MobileNav role="ADMIN" />
      </div>
    </div>
  );
}
