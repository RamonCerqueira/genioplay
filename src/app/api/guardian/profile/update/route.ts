import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { username } = await request.json();

    if (!username) return NextResponse.json({ error: 'Nome de usuário é obrigatório' }, { status: 400 });

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { username }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Este nome de usuário já está em uso' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Erro ao atualizar perfil' }, { status: 500 });
  }
}
