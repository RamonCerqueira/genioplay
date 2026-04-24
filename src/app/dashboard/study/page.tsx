import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import StudyPlayer from "@/components/study/StudyPlayer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function StudyPage() {
  const session = await getSession();
  
  // Cria uma sessão inicial no banco
  const newSession = await prisma.studySession.create({
    data: {
      studentId: session.user.id,
      status: 'IN_PROGRESS',
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 glass-card hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">Sessão de Estudo</h1>
      </div>

      <StudyPlayer sessionId={newSession.id} />
    </div>
  );
}
