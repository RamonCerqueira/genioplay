import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Verificação de Segurança (Exemplo simplificado)
    // No mundo real, você validaria o Token/Assinatura enviado pelo Mercado Pago ou Efí
    const secret = request.headers.get('x-payment-token');
    // if (secret !== process.env.PAYMENT_WEBHOOK_SECRET) return new Response('Unauthorized', { status: 401 });

    // 2. Extrai dados da transação do Mercado Pago
    // O Mercado Pago envia o ID do recurso. Precisamos buscar os detalhes.
    const { action, data } = body;

    if (action === 'payment.created' || action === 'payment.updated') {
      const paymentId = data.id;
      
      // Chamada para a API do Mercado Pago para ver o status real
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}` }
      });
      const paymentData = await mpResponse.json();

      // 3. Se o pagamento foi aprovado
      if (paymentData.status === 'approved') {
        const userId = paymentData.external_reference; 

        // 4. ATIVAÇÃO AUTOMÁTICA
        await prisma.subscription.upsert({
          where: { userId },
          update: {
            status: 'PREMIUM',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            stripeId: paymentId.toString()
          },
          create: {
            userId,
            planId: 'premium_pro',
            status: 'PREMIUM',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            stripeId: paymentId.toString()
          }
        });

        console.log(`✅ Mercado Pago: Pagamento aprovado para o usuário: ${userId}`);

        // 5. Enviar e-mail de confirmação PRO
        try {
          const user = await prisma.user.findUnique({ where: { id: userId } });
          if (user?.email) {
            const proHtml = `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 50px; text-align: center;">
                  <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                    <span style="font-size: 40px;">⭐</span>
                  </div>
                  <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 900;">Você agora é PRO!</h1>
                </div>
                <div style="padding: 40px; color: #1e293b; line-height: 1.6; text-align: center;">
                  <h2 style="color: #4f46e5;">Parabéns, ${user.username}!</h2>
                  <p style="font-size: 18px; font-weight: bold;">Sua assinatura GênioPlay Pro foi ativada com sucesso.</p>
                  
                  <div style="text-align: left; background-color: #f8fafc; border-radius: 16px; padding: 24px; margin: 30px 0;">
                    <p style="margin: 0 0 10px 0;"><b>O que você liberou agora:</b></p>
                    <ul style="margin: 0; padding-left: 20px; color: #475569;">
                      <li>Acesso ilimitado para todos os seus filhos</li>
                      <li>Sistema Anti-Cheat (Monitoramento de Foco)</li>
                      <li>Relatórios de IA avançados e detalhados</li>
                      <li>Suporte prioritário da nossa equipe</li>
                    </ul>
                  </div>

                  <p>Estamos ansiosos para ver a evolução dos seus pequenos gênios!</p>

                  <div style="margin-top: 40px;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #4f46e5; color: white; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">Ir para o Painel Pro</a>
                  </div>
                </div>
              </div>
            `;

            const { sendEmail } = await import('@/lib/mail');
            await sendEmail({
              to: user.email,
              subject: '⭐ Seu GênioPlay Pro está ATIVO! Parabéns!',
              html: proHtml
            });
          }
        } catch (mailErr) {
          console.error('Erro ao enviar e-mail Pro:', mailErr);
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Evento recebido, mas sem ação necessária.' });
  } catch (error: any) {
    console.error('❌ Erro no Webhook de Pagamento:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
