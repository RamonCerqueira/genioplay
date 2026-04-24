import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id, username, email, birthDate, newPassword } = await request.json();

    // Verifica se o estudante pertence a este guardião
    const relationship = await prisma.familyMember.findFirst({
      where: {
        guardianId: session.user.id,
        studentId: id
      }
    });

    if (!relationship) {
      return NextResponse.json({ error: 'Estudante não encontrado ou não pertence a você' }, { status: 404 });
    }

    const updateData: any = {
      username,
      email,
      birthDate: new Date(birthDate)
    };

    if (newPassword) {
      updateData.passwordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
    }

    const student = await prisma.user.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, student });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
