import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import redisClient from '@/lib/redis';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId, focusLostSeconds, isPaused } = await request.json();

  const redisKey = `session:${sessionId}`;

  // Atualiza dados no Redis de forma atômica
  if (!isPaused) {
    await redisClient.hIncrBy(redisKey, 'focusTime', 20); // Incrementa 20s (intervalo do heartbeat)
  }
  
  if (focusLostSeconds > 0) {
    await redisClient.hIncrBy(redisKey, 'focusLostTime', focusLostSeconds);
  }

  // Define um TTL para a chave caso o usuário esqueça de fechar
  await redisClient.expire(redisKey, 3600);

  return NextResponse.json({ success: true });
}
