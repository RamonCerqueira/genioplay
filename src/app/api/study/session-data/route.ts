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
        },
        student: true
      }
    });

    if (!studySession) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    const topic = studySession.topic;
    if (!topic) return NextResponse.json({ error: 'No topic linked to this session' }, { status: 404 });

    return NextResponse.json({
      success: true,
      studentId: studySession.studentId,
      studentName: studySession.student.username,
      topic: topic.name,
      subject: topic.subject.name,
      metadata: topic.metadata,
      flashcards: topic.flashcards.map(f => ({ id: f.id, title: f.front, content: f.back })),
      questions: topic.questions.filter(q => q.difficulty < 99).map(q => ({
        id: q.id,
        question: q.text,
        explanation: q.explanation,
        options: q.options.map(o => o.text),
        correct: q.options.findIndex(o => o.isCorrect)
      })),
      bonusQuestions: topic.questions.filter(q => q.difficulty === 99).map(q => ({
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
