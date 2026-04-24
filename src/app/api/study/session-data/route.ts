import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('id');

  if (!sessionId) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  try {
    const studySession = await prisma.studySession.findUnique({
      where: { id: sessionId },
      include: {
        student: {
          include: {
            generatedLessons: {
              take: 1,
              orderBy: { createdAt: 'desc' },
              include: {
                topic: {
                  include: {
                    flashcards: true,
                    questions: {
                      include: {
                        options: true
                      }
                    },
                    subject: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!studySession) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    const lesson = studySession.student.generatedLessons[0];
    if (!lesson) return NextResponse.json({ error: 'No lessons found for this student' }, { status: 404 });

    return NextResponse.json({
      success: true,
      studentId: studySession.studentId,
      studentName: studySession.student.username,
      topic: lesson.topic.name,
      subject: lesson.topic.subject.name,
      flashcards: lesson.topic.flashcards.map(f => ({ id: f.id, title: f.front, content: f.back })),
      questions: lesson.topic.questions.map(q => ({
        id: q.id,
        question: q.text,
        explanation: q.explanation,
        options: q.options.map(o => o.text),
        correct: q.options.findIndex(o => o.isCorrect)
      }))
    });
  } catch (error) {
    console.error('Session data error:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
