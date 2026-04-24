import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        role: 'assistant', 
        content: 'Olá! Estou em modo de manutenção (API Key ausente), mas em breve poderei tirar todas as suas dúvidas!' 
      });
    }

    // Busca contexto do aluno (persona, nível, etc)
    const student = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    const prompt = `
      Você é o "Tutor Gênio", um assistente de estudos para alunos de 6 a 16 anos.
      Sua persona é encorajadora, divertida e usa muitos emojis.
      O aluno se chama ${student?.username}.
      
      MISSÃO:
      - Ajude o aluno a entender conceitos acadêmicos.
      - Se ele perguntar algo não educativo, tente sutilmente levar a conversa de volta para o aprendizado ou curiosidades científicas.
      - NUNCA dê a resposta de uma prova diretamente, mas explique COMO chegar lá.
      
      Pergunta do Aluno: "${message}"
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 }
      })
    });

    const result = await response.json();
    const reply = result.candidates[0].content.parts[0].text;

    // Salva no histórico para o pai ver depois (Opcional: Criar tabela ChatHistory)
    // await prisma.activityLog.create({ ... })

    return NextResponse.json({ role: 'assistant', content: reply });

  } catch (error) {
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
