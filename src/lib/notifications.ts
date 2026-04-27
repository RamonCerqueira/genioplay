import prisma from './prisma';

export type NotificationType = 'MISSION_COMPLETE' | 'FOCUS_ALERT' | 'BADGE_EARNED' | 'PAYMENT' | 'SYSTEM';

export const sendNotification = async (params: {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
}) => {
  try {
    return await prisma.notification.create({
      data: {
        userId: params.userId,
        title: params.title,
        message: params.message,
        type: params.type,
      }
    });
    // Aqui poderíamos adicionar lógica de WebPush futuramente
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
