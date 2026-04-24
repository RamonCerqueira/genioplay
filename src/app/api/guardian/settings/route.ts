import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        username: true,
        email: true,
      }
    });

    const rewards = await prisma.reward.findMany({
      where: { guardianId: session.user.id },
      orderBy: { cost: 'asc' }
    });

    return NextResponse.json({
      success: true,
      profile: user,
      rewards: rewards
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
