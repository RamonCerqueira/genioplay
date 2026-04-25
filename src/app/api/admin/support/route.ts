import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const tickets = await prisma.supportTicket.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, tickets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
