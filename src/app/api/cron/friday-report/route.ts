import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  // Proteção simples por API Key ou verificação de Cron do Vercel
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Iniciando rotina de sexta-feira...');

  // 1. Busca dados de uso da semana
  const guardians = await prisma.user.findMany({
    where: { role: 'GUARDIAN' },
    include: {
      guardianOf: {
        include: {
          student: {
            include: {
              sessions: {
                where: {
                  startTime: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 7))
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  // 2. Envia para o n8n via Webhook
  const n8nWebhookUrl = process.env.N8N_REPORT_WEBHOOK_URL;
  
  if (n8nWebhookUrl) {
    try {
      await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week: new Date().toLocaleDateString(),
          data: guardians
        })
      });
      console.log('Dados enviados ao n8n com sucesso.');
    } catch (error) {
      console.error('Erro ao chamar n8n:', error);
    }
  }

  return NextResponse.json({ success: true, processed: guardians.length });
}
