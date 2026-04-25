import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { generateStudyContent } from '@/lib/ai-service';
import { getSubscriptionStatus } from '@/lib/subscription';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { studentIds, subject, topic, gradeLevel, persona } = await request.json();
    const plan = await getSubscriptionStatus(session.user.id);

    // 1. Validar Limite de Estudantes
    if (studentIds.length > 1 && !plan.deepAI) {
      return NextResponse.json({ 
        error: 'A atribuição multi-filho é exclusiva do Plano Premium Pro. Faça o upgrade agora!' 
      }, { status: 403 });
    }

    // 2. Validar Limite de Lições Mensais
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const lessonCount = await prisma.generatedLesson.count({
      where: {
        guardianId: session.user.id,
        createdAt: { gte: startOfMonth }
      }
    });

    if (lessonCount >= plan.maxLessonsPerMonth) {
      return NextResponse.json({ 
        error: `Você atingiu o limite de ${plan.maxLessonsPerMonth} lições do seu plano atual. Melhore sua conta para continuar!` 
      }, { status: 403 });
    }

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json({ error: 'Nenhum estudante selecionado' }, { status: 400 });
    }

    if (!gradeLevel) {
      return NextResponse.json({ error: 'A série/ano do aluno é obrigatória' }, { status: 400 });
    }

    // 3. Gera o conteúdo via IA
    const aiContent = await generateStudyContent({
      studentName: "Estudante",
      subject,
      topic,
      gradeLevel,
      persona
    });

    // 4. Persiste no Banco de Dados
    const results = await prisma.$transaction(async (tx) => {
      const subjectRecord = await tx.subject.upsert({
        where: { name: subject },
        update: {},
        create: { name: subject }
      });

      const topicRecord = await tx.topic.create({
        data: {
          subjectId: subjectRecord.id,
          name: topic,
          description: `Conteúdo para ${gradeLevel} - Persona: ${persona}`,
          flashcards: {
            create: aiContent.cards.map(c => ({ front: c.title, back: c.content }))
          },
          questions: {
            create: [
              ...aiContent.questions.map(q => ({
                text: q.text,
                difficulty: q.difficulty === 'EASY' ? 1 : q.difficulty === 'MEDIUM' ? 5 : 10,
                explanation: q.explanation,
                options: {
                  create: q.options.map((opt, i) => ({
                    text: opt,
                    isCorrect: i === q.correctIndex
                  }))
                }
              })),
              ...aiContent.bonusQuestions.map(q => ({
                text: q.text,
                difficulty: 10,
                explanation: q.explanation,
                options: {
                  create: q.options.map((opt, i) => ({
                    text: opt,
                    isCorrect: i === q.correctIndex
                  }))
                }
              }))
            ]
          }
        }
      });

      const lessons = await Promise.all(studentIds.map(sid => 
        tx.generatedLesson.create({
          data: {
            studentId: sid,
            topicId: topicRecord.id,
            guardianId: session.user.id
          }
        })
      ));

      return lessons;
    }, { timeout: 30000 });

    return NextResponse.json({ success: true, count: results.length, data: aiContent });
  } catch (error: any) {
    console.error('CRITICAL ERROR generating AI content:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erro interno na IA' 
    }, { status: 500 });
  }
}
