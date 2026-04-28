import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import StudyPlayer from "@/components/study/StudyPlayer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LessonPage({ params }: { params: { lessonId: string } }) {
  const session = await getSession();
  if (!session) redirect('/login');

  const lesson = await prisma.generatedLesson.findUnique({
    where: { id: params.lessonId },
    include: { topic: true }
  });

  if (!lesson || lesson.completed) redirect('/dashboard/student');

  // Verifica se já existe uma sessão em progresso para esta lição
  let studySession = await prisma.studySession.findFirst({
    where: { 
      studentId: session.user.id,
      topicId: lesson.topicId,
      status: 'IN_PROGRESS'
    }
  });

  if (!studySession) {
    studySession = await prisma.studySession.create({
      data: {
        studentId: session.user.id,
        topicId: lesson.topicId,
        status: 'IN_PROGRESS',
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-3 bg-white dark:bg-slate-900 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100 dark:border-slate-800">
          <ChevronLeft size={20} />
        </Link>
        <div>
           <h1 className="text-2xl font-black text-slate-800 dark:text-white">{lesson.topic.name}</h1>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sessão de Aprendizado</p>
        </div>
      </div>

      <StudyPlayer sessionId={studySession.id} />
    </div>
  );
}
