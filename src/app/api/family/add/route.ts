import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session || !session.user || session.user.role !== 'GUARDIAN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { username, password, avatar } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // Verificar se o username já existe
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: 'Este nome de usuário já existe' }, { status: 400 });
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    // Transação para criar o usuário e o vínculo familiar
    const result = await prisma.$transaction(async (tx) => {
      const student = await tx.user.create({
        data: {
          username,
          passwordHash,
          role: 'STUDENT',
          avatar: avatar || '🎓',
        }
      });

      await tx.familyMember.create({
        data: {
          guardianId: session.user.id,
          studentId: student.id
        }
      });

      // Criar carteira para gamificação
      await tx.wallet.create({
        data: {
          studentId: student.id,
          balance: 0
        }
      });

      return student;
    });

    return NextResponse.json({ success: true, student: result });
  } catch (error: any) {
    console.error('Add child error:', error);
    return NextResponse.json({ error: 'Erro ao cadastrar filho' }, { status: 500 });
  }
}
