import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { status } = await request.json(); // ex: 'FREE' ou 'PREMIUM'
    const userId = params.id;

    const subscription = await prisma.subscription.upsert({
      where: { userId },
      update: { status },
      create: {
        userId,
        planId: 'basic_free',
        status: 'FREE'
      }
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error: any) {
    console.error('Change plan error:', error);
    return NextResponse.json({ error: 'Erro ao alterar plano' }, { status: 500 });
  }
}
