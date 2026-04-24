import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const family = await prisma.familyMember.findFirst({
    where: { studentId: session.user.id }
  });

  const rewards = await prisma.reward.findMany({
    where: { guardianId: family?.guardianId, isActive: true }
  });

  return NextResponse.json({ rewards });
}
