import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { login } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        wallet: true,
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'E-mail não encontrado' }, { status: 404 });
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    if (user.passwordHash !== passwordHash) {
      return NextResponse.json({ success: false, error: 'Senha incorreta' }, { status: 401 });
    }

    await login(user);

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        balance: user.wallet?.balance || 0
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
