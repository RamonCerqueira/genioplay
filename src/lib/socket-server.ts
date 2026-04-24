import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import redisClient from './redis';

let io: Server;

export const initSocketServer = (server: any) => {
  const pubClient = redisClient.duplicate();
  const subClient = redisClient.duplicate();

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.adapter(createAdapter(pubClient, subClient));

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Evento quando o aluno clica no Play
    socket.on('student-start-study', (data: { studentId: string, guardianId: string, subject: string }) => {
      // Notifica o pai instantaneamente
      io.to(`guardian:${data.guardianId}`).emit('notification', {
        type: 'STUDY_START',
        message: `Seu filho começou a estudar ${data.subject}!`,
        studentId: data.studentId
      });
    });

    // Evento de perda de foco (Anti-Cheat)
    socket.on('student-focus-lost', (data: { studentId: string, guardianId: string }) => {
      io.to(`guardian:${data.guardianId}`).emit('notification', {
        type: 'FOCUS_ALERT',
        message: 'Alerta! O aluno saiu da aba de estudos.',
        studentId: data.studentId,
        critical: true
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
