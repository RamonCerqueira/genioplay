import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const data = await request.json();
    const userId = session.user.id;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: data.username,
        cpf: data.cpf,
        phone: data.phone,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        cep: data.cep,
        address: data.address,
        city: data.city,
        state: data.state,
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 });
  }
}
