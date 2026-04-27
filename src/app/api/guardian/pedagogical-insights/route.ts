import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { generatePedagogicalInsights } from '@/lib/ai-service';

export async function GET(request: Request) {
  const session = await getSession();
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  if (!studentId) {
    return NextResponse.json({ error: 'Estudante não especificado' }, { status: 400 });
  }

  try {
    // 1. Verifica se já existe um insight recente (últimas 24h)
    const recentInsight = await prisma.pedagogicalInsight.findFirst({
      where: {
        studentId,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (recentInsight) {
      // Retorna o que já existe (podemos ter vários registros com categorias diferentes)
      const insights = await prisma.pedagogicalInsight.findMany({
        where: {
          studentId,
          createdAt: { gte: new Date(recentInsight.createdAt.getTime() - 1000) }
        }
      });
      return NextResponse.json({ success: true, insights });
    }

    // 2. Busca dados de desempenho para a IA analisar
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        answers: {
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: { question: { include: { topic: true } } }
        },
        sessions: {
          take: 5,
          orderBy: { startTime: 'desc' },
          include: { focusEvents: true }
        }
      }
    });

    if (!student) return NextResponse.json({ error: 'Estudante não encontrado' }, { status: 404 });

    const performanceSummary = {
      recentAnswers: student.answers.map(a => ({
        topic: a.question.topic.name,
        correct: a.isCorrect,
        difficulty: a.question.difficulty
      })),
      recentSessions: student.sessions.map(s => ({
        duration: s.focusTime,
        distractions: s.focusEvents.length,
        pomodoros: s.pomodorosDone
      }))
    };

    // 3. Gera novos insights via IA
    const aiInsights = await generatePedagogicalInsights({
      studentName: student.username,
      performanceData: performanceSummary
    });

    // 4. Salva no banco de dados
    const savedInsights = await prisma.$transaction([
      prisma.pedagogicalInsight.create({
        data: {
          studentId,
          guardianId: session.user.id,
          category: 'STRENGTH',
          text: aiInsights.strength
        }
      }),
      prisma.pedagogicalInsight.create({
        data: {
          studentId,
          guardianId: session.user.id,
          category: 'WEAKNESS',
          text: aiInsights.weakness
        }
      }),
      prisma.pedagogicalInsight.create({
        data: {
          studentId,
          guardianId: session.user.id,
          category: 'SUGGESTION',
          text: aiInsights.suggestion
        }
      })
    ]);

    return NextResponse.json({ success: true, insights: savedInsights });

  } catch (error: any) {
    console.error('Insight API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
