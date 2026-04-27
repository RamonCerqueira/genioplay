import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { sendNotification } from '@/lib/notifications';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { studentId } = await request.json();

    // 1. Verificar Assinatura Premium
    const sub = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    });

    if (!sub || sub.status !== 'PREMIUM') {
      return NextResponse.json({ 
        error: 'Recurso exclusivo para membros Premium.', 
        code: 'PREMIUM_REQUIRED' 
      }, { status: 403 });
    }

    // 2. Ativar Janela de Hyperfocus (60 minutos para iniciar)
    const hyperfocusAvailableUntil = new Date(Date.now() + 60 * 60 * 1000);
    
    await prisma.user.update({
      where: { id: studentId },
      data: { 
        hyperfocusAvailableUntil,
        hyperfocusActiveUntil: null // Reseta se houver um anterior
      }
    });

    // 3. Enviar Notificação Especial
    await sendNotification({
      userId: studentId,
      title: "⚡ NOVO DESAFIO DISPONÍVEL!",
      message: "Seu responsável enviou um Desafio Relâmpago! Você tem 1 hora para iniciar e ganhar XP em DOBRO por 15 minutos!",
      type: "FOCUS_ALERT"
    });

    return NextResponse.json({ success: true, hyperfocusAvailableUntil });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
