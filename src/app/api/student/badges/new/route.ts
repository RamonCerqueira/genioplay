import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Buscar primeira notificação não lida do tipo BADGE_EARNED
    const notification = await prisma.notification.findFirst({
      where: {
        userId: session.user.id,
        type: 'BADGE_EARNED',
        isRead: false
      },
      orderBy: { createdAt: 'asc' }
    });

    if (!notification) {
      return NextResponse.json({ badge: null });
    }

    // Extrair nome da badge do título da notificação (ex: "🏅 Nova Conquista: Foco de Aço")
    const badgeName = notification.title.replace('🏅 Nova Conquista: ', '');

    return NextResponse.json({ 
      badge: {
        id: notification.id,
        badgeName,
        badgeMessage: notification.message
      } 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { notificationId } = await request.json();

    if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
