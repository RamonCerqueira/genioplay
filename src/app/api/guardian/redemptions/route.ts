import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { checkAndGrantBadges } from '@/lib/badges';

export async function GET() {
  const session = await getSession();
  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const redemptions = await prisma.redemption.findMany({
      where: {
        reward: { guardianId: session.user.id },
        status: 'PENDING'
      },
      include: {
        reward: true,
        student: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, redemptions });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar resgates' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { redemptionId, action } = await request.json(); // action: "APPROVED" | "REJECTED"

    const redemption = await prisma.redemption.findUnique({
      where: { id: redemptionId },
      include: { reward: true, student: { include: { wallet: true } } }
    });

    if (!redemption) {
      return NextResponse.json({ error: 'Resgate não encontrado' }, { status: 404 });
    }

    // Se for REJEITADO, devolve as moedas
    if (action === 'REJECTED' && redemption.status === 'PENDING') {
      await prisma.$transaction([
        prisma.redemption.update({
          where: { id: redemptionId },
          data: { status: 'REJECTED' }
        }),
        prisma.wallet.update({
          where: { studentId: redemption.studentId },
          data: { balance: { increment: redemption.reward.cost } }
        }),
        prisma.transaction.create({
          data: {
            walletId: redemption.student.wallet!.id,
            amount: redemption.reward.cost,
            type: 'REFUND_REDEEM'
          }
        })
      ]);
    } else {
      await prisma.redemption.update({
        where: { id: redemptionId },
        data: { status: action }
      });
    }

    if (action === 'APPROVED') {
       checkAndGrantBadges(redemption.studentId);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error processing redemption:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
