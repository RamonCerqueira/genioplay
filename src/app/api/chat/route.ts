import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { chatWithAI } from '@/lib/ai-service';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { message } = await req.json();

    const student = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    const systemInstruction = `
      Você é o "Tutor Gênio", um assistente de estudos de elite para alunos de 6 a 16 anos.
      Sua persona é encorajadora, divertida e usa muitos emojis.
      O aluno se chama ${student?.username} e está no ${student?.gradeLevel || 'Ensino Fundamental'}.
      
      REGRAS:
      - Ajude o aluno a entender conceitos acadêmicos de forma simples e profunda.
      - Use analogias do dia a dia.
      - Se ele perguntar algo não educativo, leve a conversa de volta para o aprendizado.
      - NUNCA dê a resposta de uma prova diretamente, explique o conceito.
    `;

    const reply = await chatWithAI({
      prompt: message,
      systemInstruction
    });

    return NextResponse.json({ role: 'assistant', content: reply });

  } catch (error: any) {
    console.error('ERRO NO CHAT:', error);
    return NextResponse.json({
      role: 'assistant',
      content: `Ops! Tive um pequeno curto-circuito: "${error.message}". Vamos tentar de novo? 🧐`
    });
  }
}
