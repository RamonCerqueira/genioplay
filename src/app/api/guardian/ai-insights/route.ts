import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const children = await prisma.user.findMany({
      where: { 
        studentIn: { 
          some: { guardianId: session.user.id } 
        } 
      },
      include: {
        skillLevels: true,
        generatedLessons: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { topic: { include: { subject: true } } }
        }
      }
    });

    // Mock de Insights baseados em dados reais (Em prod isso seria processado por uma LLM)
    const insights = children.map(child => {
      const topSkill = child.skillLevels.sort((a, b) => b.elo - a.elo)[0];
      const lowSkill = child.skillLevels.sort((a, b) => a.elo - b.elo)[0];
      const recentAvg = child.generatedLessons.length > 0 
        ? child.generatedLessons.reduce((acc, l) => acc + (l.score || 0), 0) / child.generatedLessons.length 
        : 0;

      let message = '';
      let type = 'POSITIVE';
      let action = '';

      if (recentAvg >= 90) {
        message = `${child.username} está em um ritmo lendário! A média das últimas lições é de ${recentAvg.toFixed(0)}%.`;
        action = "Que tal definir uma Meta Épica hoje?";
      } else if (lowSkill && lowSkill.elo < 1000) {
        message = `${child.username} está encontrando desafios em ${lowSkill.subjectName}.`;
        type = 'WARNING';
        action = `Ative um Desafio de Hyperfocus em ${lowSkill.subjectName}.`;
      } else {
        message = `${child.username} mantém a consistência. Ótimo momento para revisar ${topSkill?.subjectName || 'Matemática'}.`;
        type = 'NEUTRAL';
        action = "Dê uma olhada no Boletim Gênio.";
      }

      return {
        childName: child.username,
        message,
        type,
        action,
        childAvatar: child.avatar
      };
    });

    // Simulação de Nível de Mentor
    const mentorLevel = {
      level: 5,
      xp: 750,
      nextLevelXp: 1000,
      title: 'Mentor Estratégico'
    };

    return NextResponse.json({ success: true, insights, mentorLevel });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
  }
}
