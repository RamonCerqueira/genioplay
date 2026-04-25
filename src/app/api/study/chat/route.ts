import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { message, topic, subject, history } = await request.json();

    // 1. Busca Chave Híbrida
    let apiKey = process.env.GEMINI_API_KEY;
    try {
      const config = await prisma.systemConfig.findUnique({ where: { id: 'global' } });
      if (config?.geminiApiKey) apiKey = config.geminiApiKey;
    } catch (e) {}

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'IA Temporariamente offline (Chave não encontrada)' });
    }

    // 2. Formata histórico para o padrão da API REST
    const formattedHistory = history.map((h: any) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));

    // 3. Chamada via REST v1beta
    const promptContext = `Você é o GênioPlay Tutor, um assistente educacional de elite, divertido e paciente. 
                  Você está ajudando um aluno com a lição de ${subject}: ${topic}.
                  Responda de forma simples, motivadora e use muitos emojis. 
                  Explique o "porquê" das coisas.
                  Se o aluno perguntar algo fora do tópico, tente trazê-lo de volta gentilmente.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: promptContext }] },
          { role: "model", parts: [{ text: "Olá! Sou o seu GênioPlay Tutor. Estou aqui para te ajudar a dominar esse assunto e ganhar muitas moedas! 🚀" }] },
          ...formattedHistory,
          { role: "user", parts: [{ text: message }] }
        ]
      })
    });

    const result = await response.json();
    
    if (result.error) {
       throw new Error(result.error.message);
    }

    const text = result.candidates[0].content.parts[0].text;
    return NextResponse.json({ success: true, text });

  } catch (error: any) {
    console.error('Study Chat REST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
