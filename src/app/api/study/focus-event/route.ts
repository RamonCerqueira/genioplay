import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { sessionId, type, metadata } = await request.json();

    // Registra o evento de foco vinculado à sessão de estudo
    // No schema atual não temos um modelo FocusEvent, mas podemos salvar como uma atividade 
    // ou criar o modelo se necessário. Por enquanto, vamos logar no console e 
    // salvar em uma tabela de eventos se existir.
    
    // Como adicionei FocusEvent ao schema em turns anteriores:
    await prisma.focusEvent.create({
      data: {
        sessionId,
        type,
        metadata: metadata || {}
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
