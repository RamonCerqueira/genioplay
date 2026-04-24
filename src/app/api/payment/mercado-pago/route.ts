import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { getSession } from '@/lib/auth';

// Inicializa o Mercado Pago com o seu Access Token
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '' 
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const { amount, description } = await request.json();

    const payment = new Payment(client);

    const body = {
      transaction_amount: Number(amount),
      description: description || 'Assinatura EduTrack Premium',
      payment_method_id: 'pix',
      payer: {
        email: session.user.email || `${session.user.username}@edutrack.com`,
      },
      // Referência externa para o nosso Webhook identificar o usuário
      external_reference: session.user.id,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
    };

    const response = await payment.create({ body });
    const transactionData = (response as any).point_of_interaction?.transaction_data;

    return NextResponse.json({
      qrCodeBase64: transactionData?.qr_code_base64,
      copyPaste: transactionData?.qr_code,
      paymentId: response.id
    });
  } catch (error: any) {
    console.error('Erro Mercado Pago:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
