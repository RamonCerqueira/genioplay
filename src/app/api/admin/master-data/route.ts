import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();

  // Segurança Máxima: Apenas usuários com role 'ADMIN' podem acessar
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acesso negado. Apenas AdmMaster permitido.' }, { status: 403 });
  }

  try {
    // 1. Busca todos os usuários (Poderia ter paginação)
    const users = await prisma.user.findMany({
      include: { subscription: true },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    // 2. Calcula métricas financeiras (Simulado com base nas assinaturas ativas)
    const activeSubs = await prisma.subscription.count({
      where: { status: 'PREMIUM' }
    });

    // Simulação de MRR: Assinantes * Valor Médio (R$ 47.90)
    const mrr = activeSubs * 47.90;

    // 3. Busca estatísticas de indicações
    const referralStats = await prisma.user.findMany({
      where: {
        referrals: { some: {} }
      },
      select: {
        id: true,
        username: true,
        referralCode: true,
        referrals: {
          include: {
            referred: {
              select: {
                username: true,
                createdAt: true,
                subscription: { select: { status: true } }
              }
            }
          }
        }
      },
      take: 20
    });

    const totalReferrals = await prisma.referral.count();

    return NextResponse.json({
      users,
      referralStats,
      stats: {
        mrr,
        activeSubs,
        totalReferrals,
        churnRate: '2.1%',
        pendingRequests: 0
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
