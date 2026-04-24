import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Busca os filhos vinculados
    const familyMembers = await prisma.familyMember.findMany({
      where: { guardianId: session.user.id },
      include: { student: true }
    });
    const children = familyMembers.map(m => m.student);

    // 2. Busca alertas recentes de foco (Anti-Cheat)
    // Buscamos eventos de foco vinculados a qualquer filho desse guardião
    const alerts = await prisma.focusEvent.findMany({
      where: {
        session: {
          studentId: { in: children.map(c => c.id) }
        }
      },
      include: {
        session: {
          include: { student: true }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 5
    });

    // 3. Estatísticas Gerais
    const totalLessons = await prisma.generatedLesson.count({
      where: { guardianId: session.user.id }
    });

    // Média de acertos global
    const answers = await prisma.answer.findMany({
      where: {
        studentId: { in: children.map(c => c.id) }
      }
    });
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const averageScore = answers.length > 0 ? Math.round((correctAnswers / answers.length) * 100) : 0;

    // Status da assinatura
    const sub = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    });

    return NextResponse.json({
      children,
      alerts: alerts.map(a => ({
        type: a.type,
        timestamp: a.timestamp,
        student: a.session.student
      })),
      stats: {
        totalLessons,
        averageScore,
        subscriptionStatus: sub?.status || 'FREE'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
