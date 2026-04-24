import prisma from './prisma';

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Básico',
    maxStudents: 1,
    deepAI: false,
    antiCheat: false,
    maxLessonsPerMonth: 3,
  },
  PREMIUM_PRO: {
    id: 'premium_pro',
    name: 'Premium Pro',
    maxStudents: 99,
    deepAI: true,
    antiCheat: true,
    maxLessonsPerMonth: 999,
  }
};

export async function getSubscriptionStatus(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  });

  if (!subscription || subscription.status !== 'PREMIUM') {
    return PLANS.FREE;
  }

  return PLANS.PREMIUM_PRO;
}

export async function checkFeatureAccess(userId: string, feature: keyof typeof PLANS.FREE) {
  const plan = await getSubscriptionStatus(userId);
  return plan[feature];
}
