import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { login } from '@/lib/auth';
import crypto from 'crypto';
import { sendEmail } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const { username, password, role, email, ref, birthDate, cpf, phone, cep, address, city, state } = await request.json();

    // Em produção: usar bcrypt.hash
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        role: role || 'STUDENT',
        birthDate: birthDate ? new Date(birthDate) : undefined,
        cpf,
        phone,
        cep,
        address,
        city,
        state,
        // Se for estudante, cria a carteira
        wallet: (role === 'STUDENT' || !role) ? { create: { balance: 0 } } : undefined,
        // Se houver um 'ref' (ID do pai), cria a relação de família
        studentIn: (ref && (role === 'STUDENT' || !role)) ? {
          create: {
            guardianId: ref
          }
        } : undefined
      },
    });

    // Lógica de indicação (Growth)
    if (ref && role === 'GUARDIAN') {
      const referrer = await prisma.user.findUnique({ where: { referralCode: ref } });
      if (referrer) {
        await prisma.referral.create({
          data: {
            referrerId: referrer.id,
            referredId: user.id,
          }
        });
      }
    }

    await login(user);

    // Enviar e-mail de boas-vindas divertido
    if (user.email && user.role === 'GUARDIAN') {
      const welcomeHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0;">
          <div style="background-color: #2563eb; padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Bem-vindo ao GênioPlay! 🚀</h1>
          </div>
          <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
            <h2 style="color: #2563eb;">Olá, ${user.username}!</h2>
            <p style="font-size: 16px;">Estamos muito felizes em ter você conosco. Prepare-se para transformar a educação dos seus filhos em uma jornada épica de aprendizado e diversão!</p>
            
            <div style="background-color: white; border-radius: 16px; padding: 24px; margin: 30px 0; border: 1px solid #e2e8f0;">
              <h3 style="margin-top: 0; color: #1e293b;">Seu guia rápido de início:</h3>
              
              <div style="margin-bottom: 20px;">
                <b style="color: #2563eb; font-size: 18px;">1. Cadastre os Pequenos 🎓</b>
                <p style="margin: 4px 0 0 0;">Vá na aba "Meus Filhos" e crie os perfis deles. Eles vão ganhar um avatar e login próprios!</p>
              </div>
              
              <div style="margin-bottom: 20px;">
                <b style="color: #2563eb; font-size: 18px;">2. Gere o Primeiro Conteúdo 🧠</b>
                <p style="margin: 4px 0 0 0;">Escolha um assunto (ex: Frações) e deixe nossa IA criar uma aula personalizada e divertida.</p>
              </div>
              
              <div>
                <b style="color: #2563eb; font-size: 18px;">3. Gamifique o Estudo 🏆</b>
                <p style="margin: 4px 0 0 0;">Eles ganham moedas estudando! Combine recompensas reais com eles (ex: 30min de videogame) para mantê-los motivados.</p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 40px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #2563eb; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">Acessar Meu Painel</a>
            </div>
            
            <p style="margin-top: 40px; font-size: 14px; color: #64748b; text-align: center;">
              Qualquer dúvida, estamos aqui para ajudar.<br>
              Equipe GênioPlay
            </p>
          </div>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject: 'Bem-vindo ao GênioPlay! 🚀 (Seu guia de início)',
        html: welcomeHtml
      });
    }

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Mensagem amigável para o usuário
    let friendlyMessage = 'Ocorreu um erro inesperado. Por favor, tente novamente em alguns instantes.';
    
    if (error.code === 'P2002') {
      friendlyMessage = 'Este e-mail ou nome de usuário já está sendo utilizado.';
    } else if (error.message.includes('Can\'t reach database')) {
      friendlyMessage = 'Estamos com uma instabilidade momentânea na conexão. Tente novamente em 1 minuto.';
    }

    return NextResponse.json({ success: false, error: friendlyMessage }, { status: 400 });
  }
}
