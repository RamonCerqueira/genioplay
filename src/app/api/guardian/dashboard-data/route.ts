import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Se for estudante, retorna apenas o role para o frontend redirecionar
  if (session.user.role === 'STUDENT') {
    return NextResponse.json({ role: 'STUDENT' });
  }

  try {
    // 1. Busca os filhos vinculados com métricas
    const familyMembers = await prisma.familyMember.findMany({
      where: { guardianId: session.user.id },
      include: { 
        student: {
          include: {
            wallet: true,
            skillLevels: {
              take: 3,
              orderBy: { updatedAt: 'desc' }
            }
          }
        } 
      }
    });
    const children = familyMembers.map(m => ({
      ...m.student,
      walletBalance: m.student.wallet?.balance || 0,
      topSkills: m.student.skillLevels
    }));

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
