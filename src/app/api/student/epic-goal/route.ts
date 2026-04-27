import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const goal = await prisma.epicGoal.findFirst({
      where: { 
        studentId: session.user.id,
        status: 'ACTIVE'
      }
    });

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
