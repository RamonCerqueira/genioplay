import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendEmail } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Por segurança, não confirmamos se o e-mail existe ou não
      return NextResponse.json({ success: true });
    }

    // Gerar token seguro de 32 bytes
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora de expiração

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpires: expires
      }
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/${token}`;

    // Enviar e-mail usando o utilitário centralizado
    await sendEmail({
      to: email,
      subject: 'Recuperação de Senha - GênioPlay',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden;">
          <div style="background-color: #4F46E5; padding: 40px; text-align: center;">
            <h2 style="color: white; margin: 0;">Recuperação de Senha</h2>
          </div>
          <div style="padding: 40px; color: #1e293b;">
            <p>Olá,</p>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta no GênioPlay.</p>
            <p>Clique no botão abaixo para escolher uma nova senha. Este link expira em 1 hora.</p>
            <div style="margin: 32px 0; text-align: center;">
              <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">Redefinir Minha Senha</a>
            </div>
            <p style="font-size: 14px; color: #64748b;">Se você não solicitou isso, pode ignorar este e-mail com segurança.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
            <p style="color: #64748b; font-size: 12px; text-align: center;">Equipe GênioPlay</p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ success: false, error: 'Ocorreu um erro. Tente novamente.' }, { status: 500 });
  }
}
