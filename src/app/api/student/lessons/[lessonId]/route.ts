import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { lessonId: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const lesson = await prisma.generatedLesson.findUnique({
      where: { id: params.lessonId },
      include: {
        topic: {
          include: {
            subject: true,
            flashcards: true,
            questions: {
              include: {
                options: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ lesson });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
