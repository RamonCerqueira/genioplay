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
      console.error('ERRO: GEMINI_API_KEY não configurada no .env');
      return NextResponse.json({ 
        role: 'assistant', 
        content: 'Olá! Meu cérebro está um pouco desligado agora porque não encontrei minha chave de acesso (API Key). Peça para o seu pai verificar as configurações do servidor! 🛠️🧠' 
      });
    }

    // Busca contexto do aluno
    const student = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    const prompt = `
      Você é o "Tutor Gênio", um assistente de estudos para alunos de 6 a 16 anos.
      Sua persona é encorajadora, divertida e usa muitos emojis.
      O aluno se chama ${student?.username}.
      
      REGRAS:
      - Ajude o aluno a entender conceitos acadêmicos de forma simples.
      - Se ele perguntar algo não educativo, tente sutilmente levar a conversa de volta para o aprendizado.
      - NUNCA dê a resposta de uma prova diretamente, explique o conceito.
      
      Pergunta do Aluno: "${message}"
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0.7,
          maxOutputTokens: 800 
        }
      })
    });

    const result = await response.json();

    if (result.error) {
      console.error('ERRO GEMINI API:', result.error);
      return NextResponse.json({ 
        role: 'assistant', 
        content: `Ops! O Google me disse algo estranho: "${result.error.message}". Vamos tentar de novo? 🧐` 
      });
    }

    if (!result.candidates || result.candidates.length === 0) {
      return NextResponse.json({ 
        role: 'assistant', 
        content: 'Humm, pensei tanto que me perdi! Pode repetir a pergunta? 😅' 
      });
    }

    const reply = result.candidates[0].content.parts[0].text;

    return NextResponse.json({ role: 'assistant', content: reply });

  } catch (error: any) {
    console.error('ERRO CRÍTICO NO CHAT:', error);
    return NextResponse.json({ error: 'Erro interno no servidor de IA' }, { status: 500 });
  }
}
