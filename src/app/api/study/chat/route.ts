import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { message, topic, subject, history } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: `Você é o GênioPlay Tutor, um assistente educacional divertido e paciente. 
                  Você está ajudando um aluno com a lição de ${subject}: ${topic}.
                  Responda de forma simples, motivadora e use emojis. 
                  Se o aluno perguntar algo fora do tópico, tente trazê-lo de volta gentilmente.`
        },
        {
          role: 'model',
          parts: 'Olá! Sou o seu GênioPlay Tutor. Estou aqui para te ajudar a dominar esse assunto e ganhar muitas moedas! O que você gostaria de saber sobre esse tema? 🚀'
        },
        ...history
      ]
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, text });
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({ success: false, error: 'Erro ao conversar com a IA' }, { status: 500 });
  }
}
