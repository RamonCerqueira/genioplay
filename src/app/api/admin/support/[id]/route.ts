import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Resend } from 'resend';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { text, status } = await request.json();
    const ticketId = params.id;

    if (!text) {
      return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 });
    }

    // 1. Busca dados do ticket e do usuário (pai) para o e-mail
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: { user: true }
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket não encontrado' }, { status: 404 });
    }

    const message = await prisma.$transaction(async (tx) => {
      // 2. Adiciona a mensagem do admin
      const newMessage = await tx.supportMessage.create({
        data: {
          ticketId,
          senderId: session.user.id,
          text,
          isFromAdmin: true
        }
      });

      // 3. Atualiza o status do ticket
      await tx.supportTicket.update({
        where: { id: ticketId },
        data: { 
          status: status || 'IN_PROGRESS',
          updatedAt: new Date()
        }
      });

      return newMessage;
    });

    // 4. Envia e-mail para o pai usando Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && ticket.user.email) {
      const resend = new Resend(resendApiKey);
      const fromEmail = process.env.EMAIL_FROM || 'GênioPlay <onboarding@resend.dev>';

      await resend.emails.send({
        from: fromEmail,
        to: [ticket.user.email],
        subject: `[${ticket.ticketNumber}] Resposta ao seu chamado: ${ticket.subject}`,
        html: `
          <div style="font-family: sans-serif; padding: 30px; color: #1e293b;">
            <h2 style="color: #2563eb;">Olá, ${ticket.user.username}!</h2>
            <p>Você recebeu uma nova resposta da nossa equipe de suporte para o chamado <strong>${ticket.ticketNumber}</strong>.</p>
            
            <div style="margin: 25px 0; padding: 20px; background: #f8fafc; border-left: 4px solid #2563eb; border-radius: 8px;">
              <p style="font-size: 14px; color: #64748b; margin-bottom: 10px;">RESPOSTA DO SUPORTE:</p>
              <p style="line-height: 1.6; color: #334155;">${text}</p>
            </div>

            <p style="font-size: 14px;">Você também pode visualizar todo o histórico de conversas diretamente no seu painel na aba <strong>Ajuda</strong>.</p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">GênioPlay - Transformando aprendizado em diversão.</p>
          </div>
        `
      });
    }

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    console.error('Response support error:', error);
    return NextResponse.json({ error: 'Erro ao responder chamado' }, { status: 500 });
  }
}
