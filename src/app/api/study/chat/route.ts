import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { chatWithAI } from '@/lib/ai-service';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { message, topic, subject, history } = await request.json();

    const formattedHistory = history.map((h: any) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));

    const systemInstruction = `Você é o GênioPlay Tutor, um assistente educacional de elite, divertido e paciente. 
                  Você está ajudando um aluno com a lição de ${subject}: ${topic}.
                  Responda de forma simples, motivadora e use muitos emojis. 
                  Explique o "porquê" das coisas.
                  Se o aluno perguntar algo fora do tópico, tente trazê-lo de volta gentilmente.`;

    const text = await chatWithAI({
      prompt: message,
      history: formattedHistory,
      systemInstruction
    });

    return NextResponse.json({ success: true, text });

  } catch (error: any) {
    console.error('Study Chat Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
