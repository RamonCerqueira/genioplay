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
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // 2. Calcula métricas financeiras (Simulado com base nas assinaturas ativas)
    const activeSubs = await prisma.subscription.count({
      where: { status: 'PREMIUM' }
    });

    // Simulação de MRR: Assinantes * Valor Médio (R$ 47.90)
    const mrr = activeSubs * 47.90;

    return NextResponse.json({
      users,
      stats: {
        mrr,
        activeSubs,
        churnRate: '2.1%', // Cálculo de churn exigiria histórico de cancelamentos
        pendingRequests: 0
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
