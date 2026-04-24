import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Cria uma nova sessão de estudo no banco de dados
    const studySession = await prisma.studySession.create({
      data: {
        studentId: session.user.id,
        status: 'IN_PROGRESS',
        startTime: new Date()
      }
    });

    return NextResponse.json({ sessionId: studySession.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
