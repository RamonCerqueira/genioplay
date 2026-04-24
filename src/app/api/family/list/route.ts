import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (!session || !session.user || session.user.role !== 'GUARDIAN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const familyMembers = await prisma.familyMember.findMany({
      where: { guardianId: session.user.id },
      include: {
        student: {
          select: {
            id: true,
            username: true,
            avatar: true,
            createdAt: true
          }
        }
      }
    });

    const children = familyMembers.map(m => m.student);

    return NextResponse.json({ success: true, children });
  } catch (error) {
    console.error('List family error:', error);
    return NextResponse.json({ error: 'Erro ao carregar família' }, { status: 500 });
  }
}
