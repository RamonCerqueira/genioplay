import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { lessonId, answers } = await request.json();

    // 1. Salva as respostas
    const answerRecords = await prisma.answer.createMany({
      data: answers.map((a: any) => ({
        studentId: session.user.id,
        questionId: a.questionId,
        optionId: a.optionId,
        isCorrect: a.isCorrect,
      }))
    });

    // 2. Marca a lição como concluída
    await prisma.generatedLesson.update({
      where: { id: lessonId },
      data: {
        completed: true,
        completedAt: new Date()
      }
    });

    // 3. Calcula recompensa (ex: 150 moedas por lição completa)
    const rewardAmount = 150;

    await prisma.wallet.upsert({
      where: { studentId: session.user.id },
      update: {
        balance: { increment: rewardAmount },
        history: {
          create: {
            amount: rewardAmount,
            type: 'STUDY_REWARD'
          }
        }
      },
      create: {
        studentId: session.user.id,
        balance: rewardAmount,
        history: {
          create: {
            amount: rewardAmount,
            type: 'STUDY_REWARD'
          }
        }
      }
    });

    return NextResponse.json({ success: true, reward: rewardAmount });
  } catch (error: any) {
    console.error('Error completing lesson:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
