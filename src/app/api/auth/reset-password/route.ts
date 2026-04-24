import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() } // Deve estar no futuro
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Link inválido ou expirado.' }, { status: 400 });
    }

    // Hash da nova senha
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpires: null
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ success: false, error: 'Ocorreu um erro. Tente novamente.' }, { status: 500 });
  }
}
