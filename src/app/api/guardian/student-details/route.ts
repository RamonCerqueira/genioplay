import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await getSession();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: 'ID não especificado' }, { status: 400 });
  }

  try {
    const student = await prisma.user.findUnique({
      where: { id },
      include: {
        wallet: true,
        studentIn: {
          where: { guardianId: session.user.id }
        }
      }
    });

    if (!student || student.studentIn.length === 0) {
      return NextResponse.json({ error: 'Estudante não encontrado' }, { status: 404 });
    }

    const lessons = await prisma.generatedLesson.findMany({
      where: { studentId: id },
      include: {
        topic: {
          include: { subject: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return NextResponse.json({ student, lessons });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
