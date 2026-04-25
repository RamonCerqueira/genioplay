import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const data = await request.json();
    const { id, username, email, birthDate, gradeLevel, avatar, password } = data;

    if (!id) return NextResponse.json({ error: 'ID do filho é obrigatório' }, { status: 400 });

    const updateData: any = {
      username,
      email,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      gradeLevel,
      avatar,
    };

    // Se o pai digitou uma nova senha, atualiza o hash
    if (password) {
      updateData.passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    }

    const updatedChild = await prisma.user.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, child: updatedChild });
  } catch (error: any) {
    console.error('Update family member error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar dados do filho' }, { status: 500 });
  }
}
