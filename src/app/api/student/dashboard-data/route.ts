import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // 1. Busca lições pendentes do aluno
    const lessons = await prisma.generatedLesson.findMany({
      where: {
        studentId: session.user.id,
        // Poderia filtrar por lições não concluídas se tivéssemos um campo de status na GeneratedLesson
      },
      include: {
        topic: {
          include: {
            subject: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 2. Busca saldo da carteira
    const wallet = await prisma.wallet.findUnique({
      where: { studentId: session.user.id }
    });

    return NextResponse.json({
      lessons,
      balance: wallet?.balance || 0
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
