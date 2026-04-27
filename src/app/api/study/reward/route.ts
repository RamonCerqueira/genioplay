import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { checkAndGrantBadges } from '@/lib/badges';
import { sendNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { amount: baseAmount, type, sessionId } = await request.json();

    if (!baseAmount || !type) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

    // Verifica se o modo Hyperfocus está ativo (Duração de 15min)
    const student = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { hyperfocusActiveUntil: true }
    });

    const isHyperfocus = student?.hyperfocusActiveUntil && new Date(student.hyperfocusActiveUntil) > new Date();
    const amount = isHyperfocus ? baseAmount * 2 : baseAmount;

    // Atualiza o saldo da carteira do estudante em uma transação
    const result = await prisma.$transaction([
      prisma.wallet.update({
        where: { studentId: session.user.id },
        data: { balance: { increment: amount } }
      }),
      prisma.transaction.create({
        data: {
          wallet: { connect: { studentId: session.user.id } },
          amount,
          type // "STUDY_REWARD" ou "QUIZ_BONUS"
        }
      })
    ]);

    // Dispara checagem de conquistas de forma assíncrona
    checkAndGrantBadges(session.user.id);

    // Incrementa progresso na Meta Épica se houver uma ativa
    await prisma.epicGoal.updateMany({
      where: { studentId: session.user.id, status: 'ACTIVE' },
      data: { currentLessons: { increment: 1 } }
    });

    return NextResponse.json({ success: true, newBalance: result[0].balance });
  } catch (error) {
    console.error('Reward error:', error);
    return NextResponse.json({ success: false, error: 'Erro ao processar recompensa' }, { status: 500 });
  }
}
