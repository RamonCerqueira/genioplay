import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getSession();
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  if (!studentId) {
    return NextResponse.json({ error: 'Estudante não especificado' }, { status: 400 });
  }

  try {
    const lessons = await prisma.generatedLesson.findMany({
      where: {
        studentId,
        guardianId: session.user.id
      },
      include: {
        topic: {
          include: {
            subject: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ lessons });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
