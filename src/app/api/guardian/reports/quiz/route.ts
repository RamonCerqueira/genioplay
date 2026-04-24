import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getSession();
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const topicId = searchParams.get('topicId');

  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  if (!studentId || !topicId) {
    return NextResponse.json({ error: 'Faltam parâmetros' }, { status: 400 });
  }

  try {
    const report = await prisma.answer.findMany({
      where: {
        studentId,
        question: {
          topicId
        }
      },
      include: {
        question: {
          include: {
            options: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Calcula estatísticas
    const total = report.length;
    const correct = report.filter(a => a.isCorrect).length;
    const score = total > 0 ? (correct / total) * 100 : 0;

    return NextResponse.json({ 
      report,
      stats: { total, correct, score }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
