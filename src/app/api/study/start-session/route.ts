import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const student = await prisma.user.findUnique({ where: { id: session.user.id } });
    let hyperfocusBonus = false;

    if (student?.hyperfocusAvailableUntil && new Date(student.hyperfocusAvailableUntil) > new Date()) {
      // Ativa o bônus real por 15 minutos
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          hyperfocusActiveUntil: new Date(Date.now() + 15 * 60 * 1000),
          hyperfocusAvailableUntil: null // Consome a disponibilidade
        }
      });
      hyperfocusBonus = true;
    }

    // Cria uma nova sessão de estudo no banco de dados
    const studySession = await prisma.studySession.create({
      data: {
        studentId: session.user.id,
        status: 'IN_PROGRESS',
        startTime: new Date()
      }
    });

    return NextResponse.json({ 
      sessionId: studySession.id,
      hyperfocusBonus
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
