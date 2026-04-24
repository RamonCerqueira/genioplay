import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getSession();
  const { rewardId } = await request.json();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
    const wallet = await prisma.wallet.findUnique({ where: { studentId: session.user.id } });

    if (!reward || !wallet || wallet.balance < reward.cost) {
      return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.wallet.update({
        where: { studentId: session.user.id },
        data: { balance: { decrement: reward.cost } }
      }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          amount: -reward.cost,
          type: 'REWARD_REDEEM'
        }
      }),
      prisma.redemption.create({
        data: {
          studentId: session.user.id,
          rewardId: reward.id,
          status: 'PENDING'
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
