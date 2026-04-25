import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const family = await prisma.familyMember.findMany({
      where: { guardianId: session.user.id },
      include: {
        student: {
          select: {
            id: true,
            username: true,
            gradeLevel: true,
          }
        }
      }
    });

    const students = family.map(f => f.student);

    return NextResponse.json({ students });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
