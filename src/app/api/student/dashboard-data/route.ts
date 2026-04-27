import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // 1. Busca lições pendentes do aluno
    const lessons = await prisma.generatedLesson.findMany({
      where: {
        studentId: session.user.id,
        completed: false
      },
      include: {
        topic: {
          include: {
            subject: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 2. Busca dados de gamificação
    const wallet = await prisma.wallet.findUnique({
      where: { studentId: session.user.id }
    });

    const answers = await prisma.answer.findMany({
      where: { studentId: session.user.id }
    });
    const xp = answers.filter(a => a.isCorrect).length * 10;

    // 3. Calcula Streak (Simplificado)
    const recentActivities = await prisma.generatedLesson.findMany({
      where: { 
        studentId: session.user.id,
        completed: true 
      },
      select: { completedAt: true },
      orderBy: { completedAt: 'desc' },
      take: 30
    });

    let streak = 0;
    if (recentActivities.length > 0) {
      // Lógica de streak simples: contar dias consecutivos
      const uniqueDays = new Set(recentActivities.map(a => a.completedAt?.toDateString()));
      streak = uniqueDays.size; // Por enquanto, apenas o número de dias com atividade
    }

    // 4. Busca Badges
    const badges = await prisma.studentBadge.findMany({
      where: { studentId: session.user.id },
      include: { badge: true }
    });

    return NextResponse.json({
      lessons,
      username: session.user.username,
      balance: wallet?.balance || 0,
      xp: xp || 0,
      streak: streak || 0,
      badges
    });
  } catch (error: any) {
    console.error('Student dashboard error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
