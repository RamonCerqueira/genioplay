import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const config = await prisma.systemConfig.upsert({
      where: { id: 'global' },
      update: {},
      create: { id: 'global' }
    });

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    const config = await prisma.systemConfig.upsert({
      where: { id: 'global' },
      update: {
        paymentGateway: data.paymentGateway,
        mpAccessToken: data.mpAccessToken,
        mpPublicKey: data.mpPublicKey,
        stripeSecretKey: data.stripeSecretKey,
        stripePublicKey: data.stripePublicKey
      },
      create: {
        id: 'global',
        paymentGateway: data.paymentGateway,
        mpAccessToken: data.mpAccessToken,
        mpPublicKey: data.mpPublicKey,
        stripeSecretKey: data.stripeSecretKey,
        stripePublicKey: data.stripePublicKey
      }
    });

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
