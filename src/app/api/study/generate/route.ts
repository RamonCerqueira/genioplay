import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { generateStudyContent } from '@/lib/ai-service';
import { getSubscriptionStatus } from '@/lib/subscription';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const isStudent = session.user.role === 'STUDENT';
  const isGuardian = session.user.role === 'GUARDIAN';

  if (!isStudent && !isGuardian) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }

  try {
    let { studentIds, subject, topic, gradeLevel, persona, visualMode, previousAnswers, gabarito } = await request.json();
    
    let guardianId = session.user.id;

    if (isStudent) {
      const family = await prisma.familyMember.findFirst({
        where: { studentId: session.user.id }
      });
      if (!family) return NextResponse.json({ error: 'Vínculo familiar não encontrado' }, { status: 400 });
      
      guardianId = family.guardianId;
      studentIds = [session.user.id];
      
      const student = await prisma.user.findUnique({ where: { id: session.user.id } });
      gradeLevel = gradeLevel || student?.gradeLevel;
    }

    const plan = await getSubscriptionStatus(guardianId);

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
        guardianId: guardianId,
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
      studentName: session.user.username || "Estudante",
      subject,
      topic,
      gradeLevel,
      persona,
      visualMode,
      previousAnswers,
      gabarito
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
          description: aiContent.summary,
          metadata: aiContent.metadata || {},
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
            guardianId: guardianId
          }
        })
      ));

      return lessons;
    }, { timeout: 30000 });

    return NextResponse.json({ 
      success: true, 
      lessonId: results[0]?.id,
      count: results.length, 
      data: aiContent 
    });
  } catch (error: any) {
    console.error('CRITICAL ERROR generating AI content:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erro interno na IA' 
    }, { status: 500 });
  }
}
