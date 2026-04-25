import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Resend } from 'resend';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { subject, message } = await req.json();

    const ticket = await prisma.$transaction(async (tx) => {
      // 1. Gera número sequencial #GenX
      const count = await tx.supportTicket.count();
      const ticketNumber = `#Gen${count + 1}`;

      // 2. Cria o ticket
      const newTicket = await tx.supportTicket.create({
        data: {
          ticketNumber,
          subject,
          userId: session.user.id,
          messages: {
            create: {
              text: message,
              senderId: session.user.id,
              isFromAdmin: false
            }
          }
        }
      });

      return newTicket;
    });

    // 3. Envia e-mail de confirmação para o usuário
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && session.user.email) {
      const resend = new Resend(resendApiKey);
      const fromEmail = process.env.EMAIL_FROM || 'GênioPlay <onboarding@resend.dev>';

      await resend.emails.send({
        from: fromEmail,
        to: [session.user.email],
        subject: `Chamado Aberto: ${ticket.ticketNumber}`,
        html: `
          <div style="font-family: sans-serif; padding: 40px; color: #1e293b; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 20px; border: 1px solid #e2e8f0;">
              <h2 style="color: #2563eb;">Olá, ${session.user.username}!</h2>
              <p>Recebemos o seu pedido de suporte. Nossa equipe já está analisando o seu caso.</p>
              
              <div style="margin: 24px 0; padding: 20px; background: #eff6ff; border-radius: 12px; text-align: center;">
                <p style="font-size: 14px; color: #3b82f6; margin-bottom: 5px; font-weight: bold;">NÚMERO DO TICKET:</p>
                <p style="font-size: 32px; font-weight: 900; color: #1e3a8a; margin: 0;">${ticket.ticketNumber}</p>
              </div>

              <p><strong>Assunto:</strong> ${subject}</p>
              <p style="font-size: 14px; color: #64748b; line-height: 1.6;">Você receberá uma notificação por e-mail assim que tivermos uma resposta. Você também pode acompanhar o status na aba "Ajuda" do seu painel.</p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
              <p style="font-size: 12px; color: #94a3b8; text-align: center;">GênioPlay - Onde o suporte também é de elite.</p>
            </div>
          </div>
        `
      });
    }

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    console.error('Create ticket error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
