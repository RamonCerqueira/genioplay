import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getSession();
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const goal = await prisma.epicGoal.findFirst({
      where: { 
        studentId: studentId!, 
        guardianId: session.user.id,
        status: 'ACTIVE'
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { studentId, prize, targetLessons, title, imageUrl } = await request.json();

    // Desativa qualquer meta ativa anterior
    await prisma.epicGoal.updateMany({
      where: { studentId, guardianId: session.user.id, status: 'ACTIVE' },
      data: { status: 'CANCELLED' }
    });

    const goal = await prisma.epicGoal.create({
      data: {
        studentId,
        guardianId: session.user.id,
        title: title || 'Passar de ano sem recuperação',
        prize,
        targetLessons: Number(targetLessons) || 100,
        imageUrl,
        status: 'ACTIVE'
      }
    });

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { goalId, status } = await request.json(); // ACHIEVED or FAILED

    const goal = await prisma.epicGoal.update({
      where: { id: goalId, guardianId: session.user.id },
      data: { status }
    });

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
