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
    const { isBlocked } = await request.json();
    const userId = params.id;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isBlocked }
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Toggle user status error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar status do usuário' }, { status: 500 });
  }
}
