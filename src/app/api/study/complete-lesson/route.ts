import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { lessonId, score, coinsEarned } = await request.json();

    const lesson = await prisma.generatedLesson.update({
      where: { id: lessonId, studentId: session.user.id },
      data: {
        completed: true,
        completedAt: new Date(),
        score: Number(score),
        coinsEarned: Number(coinsEarned)
      },
      include: { topic: { include: { subject: true } } }
    });

    return NextResponse.json({ success: true, lesson });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
