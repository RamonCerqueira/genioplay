
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const families = await prisma.familyMember.findMany({
    include: {
      guardian: { select: { username: true, id: true } },
      student: { select: { username: true, id: true } }
    }
  });

  console.log('--- FAMÍLIAS CADASTRADAS ---');
  console.dir(families, { depth: null });

  const rewards = await prisma.reward.findMany({
    include: {
      guardian: { select: { username: true } }
    }
  });

  console.log('\n--- RECOMPENSAS NO BANCO ---');
  console.dir(rewards, { depth: null });
}

main().catch(console.error).finally(() => prisma.$disconnect());
