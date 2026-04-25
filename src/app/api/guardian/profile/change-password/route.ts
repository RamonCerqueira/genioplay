import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar senha atual
    const currentHash = crypto.createHash('sha256').update(currentPassword).digest('hex');
    if (currentHash !== user.passwordHash) {
      return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 });
    }

    // Atualizar para a nova senha
    const newHash = crypto.createHash('sha256').update(newPassword).digest('hex');
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash: newHash }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Erro ao alterar senha' }, { status: 500 });
  }
}
