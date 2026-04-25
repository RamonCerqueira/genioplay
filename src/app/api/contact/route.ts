import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.EMAIL_FROM || 'GênioPlay <onboarding@resend.dev>';

    // Destinatário: Altere para o seu e-mail real aqui se desejar
    const toEmail = "ramonssa100@gmail.com";

    if (!resendApiKey) {
      console.error('RESEND_API_KEY não configurada');
      return NextResponse.json({ error: 'Servidor de e-mail não configurado' }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `Novo Contato: ${subject || 'Geral'}`,
      html: `
        <div style="font-family: sans-serif; padding: 40px; color: #1e293b; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; rounded-lg: 1rem; border: 1px solid #e2e8f0; border-radius: 20px;">
            <h2 style="color: #2563eb; margin-top: 0;">Novo contato recebido 🚀</h2>
            <p style="font-size: 14px; color: #64748b;">Um novo usuário enviou uma mensagem através do site GênioPlay.</p>
            
            <div style="margin: 24px 0; padding: 20px; background: #f1f5f9; border-radius: 12px;">
              <p style="margin: 5px 0;"><strong>Nome:</strong> ${name}</p>
              <p style="margin: 5px 0;"><strong>E-mail:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Assunto:</strong> ${subject}</p>
            </div>

            <p style="font-weight: bold; margin-bottom: 10px;">Mensagem:</p>
            <p style="line-height: 1.6; color: #334155; white-space: pre-wrap;">${message}</p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">Este é um e-mail automático do sistema GênioPlay.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend SDK error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
