import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  try {
    // Verifica se a recompensa pertence ao guardian logado
    const reward = await prisma.reward.findUnique({ where: { id } });
    if (!reward || reward.guardianId !== session.user.id) {
      return NextResponse.json({ error: 'Reward not found or unauthorized' }, { status: 404 });
    }

    await prisma.reward.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao deletar recompensa' }, { status: 500 });
  }
}
