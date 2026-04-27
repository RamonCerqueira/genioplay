import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { code } = await request.json();
    const userId = session.user.id;

    // 1. Busca o padrinho pelo código
    const referrer = await prisma.user.findFirst({
      where: { 
        referralCode: {
          contains: code.trim(),
          mode: 'insensitive'
        }
      }
    });

    if (!referrer) {
      return NextResponse.json({ success: false, error: 'Código de indicação inválido.' });
    }

    if (referrer.id === userId) {
      return NextResponse.json({ success: false, error: 'Você não pode indicar a si mesmo.' });
    }

    // 2. Verifica se o usuário já foi indicado
    const existingReferral = await prisma.referral.findUnique({
      where: { referredId: userId }
    });

    if (existingReferral) {
      return NextResponse.json({ success: false, error: 'Você já ativou um código de indicação anteriormente.' });
    }

    // 3. Cria a relação de indicação
    await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredId: userId,
        rewarded: true
      }
    });

    // 4. Concede benefícios (15 dias para o indicado, 30 dias para o padrinho)
    const addDays = (date: Date | null, days: number) => {
      const result = date ? new Date(date) : new Date();
      result.setDate(result.getDate() + days);
      return result;
    };

    // Atualiza/Cria assinatura do indicado
    const referredSub = await prisma.subscription.findUnique({ where: { userId } });
    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        planId: 'referral_bonus',
        status: 'PREMIUM',
        currentPeriodEnd: addDays(null, 15)
      },
      update: {
        status: 'PREMIUM',
        currentPeriodEnd: addDays(referredSub?.currentPeriodEnd || null, 15)
      }
    });

    // Atualiza/Cria assinatura do padrinho
    const referrerSub = await prisma.subscription.findUnique({ where: { userId: referrer.id } });
    await prisma.subscription.upsert({
      where: { userId: referrer.id },
      create: {
        userId: referrer.id,
        planId: 'referral_bonus',
        status: 'PREMIUM',
        currentPeriodEnd: addDays(null, 30)
      },
      update: {
        status: 'PREMIUM',
        currentPeriodEnd: addDays(referrerSub?.currentPeriodEnd || null, 30)
      }
    });

    // 5. Notifica o padrinho
    await prisma.notification.create({
      data: {
        userId: referrer.id,
        title: 'Nova Indicação Ativa! 🎉',
        message: `O usuário ${session.user.username} ativou seu código. Você ganhou +30 dias de Premium!`,
        type: 'MISSION_COMPLETE'
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Código ativado com sucesso! Você ganhou 15 dias de Premium Pro.' 
    });

  } catch (error: any) {
    console.error('Referral activation error:', error);
    return NextResponse.json({ success: false, error: 'Erro ao processar ativação.' }, { status: 500 });
  }
}
