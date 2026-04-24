import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { username, password, birthDate } = await request.json();

    // Validação simples
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return NextResponse.json({ error: 'Nome de usuário já existe' }, { status: 400 });

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    // Criação atômica do Estudante e da relação
    const student = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role: 'STUDENT',
        birthDate: new Date(birthDate),
        wallet: { create: { balance: 0 } },
        studentIn: {
          create: {
            guardianId: session.user.id
          }
        }
      }
    });

    return NextResponse.json({ success: true, studentId: student.id });
  } catch (error: any) {
    console.error('Error registering student:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
