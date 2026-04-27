import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { getSession } from '@/lib/auth';

// Inicializa o Mercado Pago com o seu Access Token
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '' 
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const { amount, price, description, planId } = await request.json();
    const finalAmount = Number(price || amount);

    if (!finalAmount) {
      return NextResponse.json({ error: 'Valor inválido' }, { status: 400 });
    }

    const preference = new Preference(client);

    const body = {
      items: [
        {
          id: planId || 'premium_pro',
          title: description || 'Assinatura GênioPlay Premium Pro',
          quantity: 1,
          unit_price: finalAmount,
          currency_id: 'BRL',
        }
      ],
      payer: {
        email: session.user.email || `${session.user.username}@genioplay.com.br`,
      },
      external_reference: session.user.id,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=pending`,
      },
      auto_return: 'approved' as const,
    };

    const response = await preference.create({ body });

    return NextResponse.json({
      init_point: response.init_point,
      preferenceId: response.id
    });
  } catch (error: any) {
    console.error('Erro Mercado Pago (Preference):', error);
    return NextResponse.json({ error: error.message || 'Erro ao gerar link de pagamento' }, { status: 500 });
  }
}
