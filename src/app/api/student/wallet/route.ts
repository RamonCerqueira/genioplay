import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const wallet = await prisma.wallet.findUnique({ where: { studentId: session.user.id } });
  return NextResponse.json({ balance: wallet?.balance || 0 });
}
