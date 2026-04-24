import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const username = searchParams.get('username');
  const cpf = searchParams.get('cpf');
  const phone = searchParams.get('phone');

  try {
    if (email) {
      const exists = await prisma.user.findUnique({ where: { email } });
      return NextResponse.json({ exists: !!exists });
    }

    if (username) {
      const exists = await prisma.user.findUnique({ where: { username } });
      return NextResponse.json({ exists: !!exists });
    }

    if (cpf) {
      const exists = await prisma.user.findFirst({ where: { cpf } });
      return NextResponse.json({ exists: !!exists });
    }

    if (phone) {
      const exists = await prisma.user.findFirst({ where: { phone } });
      return NextResponse.json({ exists: !!exists });
    }

    return NextResponse.json({ error: 'Parâmetro inválido' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao validar' }, { status: 500 });
  }
}
