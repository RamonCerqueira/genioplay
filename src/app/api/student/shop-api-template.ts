// Exemplo de como organizar as APIs de shop
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// 1. GET /api/student/wallet
export async function GET_WALLET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const wallet = await prisma.wallet.findUnique({ where: { studentId: session.user.id } });
  return NextResponse.json({ balance: wallet?.balance || 0 });
}

// 2. GET /api/student/rewards
export async function GET_REWARDS() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Busca o responsável do estudante para pegar os prêmios da família
  const family = await prisma.familyMember.findFirst({
    where: { studentId: session.user.id }
  });

  const rewards = await prisma.reward.findMany({
    where: { guardianId: family?.guardianId, isActive: true }
  });

  return NextResponse.json({ rewards });
}

// 3. POST /api/student/redeem
export async function POST_REDEEM(request: Request) {
  const session = await getSession();
  const { rewardId } = await request.json();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
    const wallet = await prisma.wallet.findUnique({ where: { studentId: session.user.id } });

    if (!reward || !wallet || wallet.balance < reward.cost) {
      return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 });
    }

    const result = await prisma.$transaction([
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
