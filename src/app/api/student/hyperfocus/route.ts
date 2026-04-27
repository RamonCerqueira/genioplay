import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const student = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { 
      hyperfocusAvailableUntil: true,
      hyperfocusActiveUntil: true
    }
  });

  return NextResponse.json({ success: true, ...student });
}

export async function POST() {
  const session = await getSession();
  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const student = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!student?.hyperfocusAvailableUntil || new Date(student.hyperfocusAvailableUntil) < new Date()) {
      return NextResponse.json({ error: 'O desafio expirou ou não está disponível.' }, { status: 400 });
    }

    if (student.hyperfocusActiveUntil) {
      return NextResponse.json({ error: 'O desafio já está em andamento.' }, { status: 400 });
    }

    // Inicia os 15 minutos de benefício
    const hyperfocusActiveUntil = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        hyperfocusActiveUntil,
        hyperfocusAvailableUntil: null // Remove a disponibilidade após iniciar
      }
    });

    return NextResponse.json({ success: true, hyperfocusActiveUntil });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
