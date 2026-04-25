import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

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
            email: true,
            avatar: true,
            gradeLevel: true,
            birthDate: true,
            createdAt: true,
            wallet: {
              select: { balance: true }
            },
            skillLevels: {
              select: { subjectName: true, elo: true }
            },
            sessions: {
              where: { status: 'COMPLETED' },
              take: 5,
              orderBy: { startTime: 'desc' },
              select: { id: true, startTime: true, pomodorosDone: true }
            }
          }
        }
      }
    });

    const children = familyMembers.map(m => ({
      ...m.student,
      walletBalance: m.student.wallet?.balance || 0,
      skills: m.student.skillLevels || []
    }));

    return NextResponse.json({ success: true, children });
  } catch (error) {
    console.error('List family error:', error);
    return NextResponse.json({ error: 'Erro ao carregar família' }, { status: 500 });
  }
}
