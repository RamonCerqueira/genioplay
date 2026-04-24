import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { amount, type, sessionId } = await request.json();

    if (!amount || !type) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

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

    return NextResponse.json({ success: true, newBalance: result[0].balance });
  } catch (error) {
    console.error('Reward error:', error);
    return NextResponse.json({ success: false, error: 'Erro ao processar recompensa' }, { status: 500 });
  }
}
