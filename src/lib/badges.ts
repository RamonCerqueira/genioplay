import prisma from './prisma';
import { sendNotification } from './notifications';

export const BADGES = [
  {
    name: 'Foco de Aço',
    description: 'Completou uma sessão de 25 minutos sem distrações.',
    icon: '/badges/foco_de_aco.png',
    category: 'FOCUS'
  },
  {
    name: 'Madrugador',
    description: 'Iniciou os estudos antes das 8h da manhã.',
    icon: '/badges/madrugador.png',
    category: 'STUDY'
  },
  {
    name: 'Mestre dos Livros',
    description: 'Concluiu 5 lições de Linguagens ou História.',
    icon: '/badges/mestre_dos_livros.png',
    category: 'STUDY'
  },
  {
    name: 'O Grande Sábio',
    description: 'Alcançou o ELO 1200 em qualquer matéria.',
    icon: '/badges/grande_sabio.png',
    category: 'STUDY'
  },
  {
    name: 'QI de 320',
    description: 'Acertou todas as questões de uma lição difícil de primeira.',
    icon: '/badges/qi_de_320.png',
    category: 'STUDY'
  },
  {
    name: 'Devorador de Variáveis',
    description: 'Dominou 3 tópicos seguidos de Matemática.',
    icon: '/badges/devorador_de_variaveis.png',
    category: 'STUDY'
  },
  {
    name: 'Tal Pai, Tal Filho',
    description: 'Teve 5 prêmios aprovados pelo seu responsável.',
    icon: '/badges/tal_pai_tal_filho.png',
    category: 'SOCIAL'
  },
  // Movie Themed & Fun
  {
    name: 'Hakuna Matata',
    description: 'Estudou sem pressa e acertou tudo!',
    icon: '/badges/hakuna_matata.png',
    category: 'SOCIAL'
  },
  {
    name: 'Ao Infinito e Além',
    description: 'Superou sua meta diária de XP.',
    icon: '/badges/ao_infinito_e_alem.png',
    category: 'STREAK'
  },
  {
    name: 'Pequeno Padawan',
    description: 'Concluiu sua primeira trilha completa.',
    icon: '/badges/pequeno_padawan.png',
    category: 'STUDY'
  }
];

export const checkAndGrantBadges = async (studentId: string) => {
  try {
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: { 
        sessions: { include: { focusEvents: true } },
        answers: true,
        studentBadges: true
      }
    });

    if (!student) return;

    const currentBadgeNames = student.studentBadges.map(sb => sb.badgeId); // Simplificado: assumindo que badgeId é o nome para este exemplo rápido ou buscando por nome

    for (const badgeDef of BADGES) {
      // 1. Verifica se já possui
      const badge = await prisma.badge.upsert({
        where: { name: badgeDef.name },
        update: { icon: badgeDef.icon, description: badgeDef.description },
        create: badgeDef
      });

      const alreadyHas = student.studentBadges.some(sb => sb.badgeId === badge.id);
      if (alreadyHas) continue;

      // 2. Lógica de Conquista
      let earned = false;

      if (badgeDef.name === 'Foco de Aço') {
        earned = student.sessions.some(s => s.focusTime >= 1500 && s.focusEvents.length === 0);
      } else if (badgeDef.name === 'Madrugador') {
        earned = student.sessions.some(s => new Date(s.startTime).getHours() < 8);
      } else if (badgeDef.name === 'Mestre dos Livros') {
        const bookLessons = await prisma.generatedLesson.count({
          where: { studentId, completed: true, topic: { subject: { name: { in: ['Português', 'História', 'Geografia'] } } } }
        });
        earned = bookLessons >= 5;
      } else if (badgeDef.name === 'O Grande Sábio') {
        const highElo = await prisma.skillLevel.findFirst({ where: { studentId, elo: { gte: 1200 } } });
        earned = !!highElo;
      } else if (badgeDef.name === 'QI de 320') {
        const perfectHard = student.answers.slice(-10).every(a => a.isCorrect); // Simplificado
        earned = perfectHard;
      } else if (badgeDef.name === 'Tal Pai, Tal Filho') {
        const approvedRedemptions = await prisma.redemption.count({ where: { studentId, status: 'APPROVED' } });
        earned = approvedRedemptions >= 5;
      } else if (badgeDef.name === 'Pequeno Padawan') {
        earned = student.sessions.length >= 1;
      }

      if (earned) {
        await prisma.studentBadge.create({
          data: {
            studentId,
            badgeId: badge.id
          }
        });

        // Notifica o aluno e o pai
        await sendNotification({
          userId: studentId,
          title: `🏅 Nova Conquista: ${badgeDef.name}`,
          message: `Você desbloqueou o emblema "${badgeDef.name}"! Continue assim!`,
          type: 'BADGE_EARNED'
        });

        // Busca o pai
        const family = await prisma.familyMember.findFirst({ where: { studentId } });
        if (family) {
          await sendNotification({
            userId: family.guardianId,
            title: `🚀 Seu filho conquistou um emblema!`,
            message: `${student.username} acaba de ganhar o selo "${badgeDef.name}".`,
            type: 'BADGE_EARNED'
          });
        }
      }
    }
  } catch (error) {
    console.error('Error checking badges:', error);
  }
};
