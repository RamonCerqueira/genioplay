import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

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

    const redemption = await prisma.redemption.update({
      where: { id: redemptionId },
      data: { status: action }
    });

    return NextResponse.json({ success: true, redemption });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao processar resgate' }, { status: 500 });
  }
}
