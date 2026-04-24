import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, cost, description } = await request.json();

    if (!title || !cost) {
      return NextResponse.json({ error: 'Título e custo são obrigatórios' }, { status: 400 });
    }

    const reward = await prisma.reward.create({
      data: {
        guardianId: session.user.id,
        title,
        cost: parseInt(cost.toString()),
        description,
        isActive: true
      }
    });

    return NextResponse.json({ success: true, reward });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao criar recompensa' }, { status: 500 });
  }
}
