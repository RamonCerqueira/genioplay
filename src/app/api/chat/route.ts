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
    
    // 1. Busca Chave Híbrida
    let apiKey = process.env.GEMINI_API_KEY;
    try {
      const config = await prisma.systemConfig.findUnique({ where: { id: 'global' } });
      if (config?.geminiApiKey) apiKey = config.geminiApiKey;
    } catch (e) {}

    if (!apiKey) {
      return NextResponse.json({ 
        role: 'assistant', 
        content: 'Olá! Meu cérebro está um pouco desligado agora porque não encontrei minha chave de acesso (API Key). 🛠️🧠' 
      });
    }

    // 2. Busca Contexto do Aluno
    const student = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    // 3. Chamada via REST v1beta (Blindado contra SDK old)
    const prompt = `
      Você é o "Tutor Gênio", um assistente de estudos de elite para alunos de 6 a 16 anos.
      Sua persona é encorajadora, divertida e usa muitos emojis.
      O aluno se chama ${student?.username} e está no ${student?.gradeLevel || 'Ensino Fundamental'}.
      
      REGRAS:
      - Ajude o aluno a entender conceitos acadêmicos de forma simples e profunda.
      - Use analogias do dia a dia.
      - Se ele perguntar algo não educativo, leve a conversa de volta para o aprendizado.
      - NUNCA dê a resposta de uma prova diretamente, explique o conceito.
      
      Pergunta do Aluno: "${message}"
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      })
    });

    const result = await response.json();
    
    if (result.error) {
       throw new Error(result.error.message);
    }

    const reply = result.candidates[0].content.parts[0].text;
    return NextResponse.json({ role: 'assistant', content: reply });

  } catch (error: any) {
    console.error('ERRO NO CHAT REST:', error);
    return NextResponse.json({ 
      role: 'assistant', 
      content: `Ops! Tive um pequeno curto-circuito na minha conexão com o Google: "${error.message}". Vamos tentar de novo? 🧐` 
    });
  }
}
