'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, BookOpen, Medal, AlertCircle, X, Sparkles } from 'lucide-react';
import { z } from 'zod';

// Validação com Zod para garantir consistência
const NotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.enum(['SUCCESS', 'INFO', 'WARNING', 'ACHIEVEMENT']),
  duration: z.number().default(4000),
});

type Notification = z.infer<typeof NotificationSchema>;

interface NotificationContextType {
  notify: (data: Omit<Notification, 'id' | 'duration'> & { duration?: number }) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((data: Omit<Notification, 'id' | 'duration'> & { duration?: number }) => {
    const id = Math.random().toString(36).substring(7);
    const newNotification = NotificationSchema.parse({ ...data, id });
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, newNotification.duration);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-0 left-0 right-0 pointer-events-none z-[9999] flex flex-col items-center p-6 gap-4">
        <AnimatePresence>
            {notifications.map((n) => (
              <EducationalToast key={n.id} notification={n} onClose={() => setNotifications(prev => prev.filter(item => item.id !== n.id))} />
            ))}
          </AnimatePresence>
        </div>
    </NotificationContext.Provider>
  );
}

function EducationalToast({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  const icons = {
    SUCCESS: <CheckIcon />,
    INFO: <BookOpen className="text-blue-500" size={28} />,
    WARNING: <AlertCircle className="text-orange-500" size={28} />,
    ACHIEVEMENT: <Medal className="text-yellow-500" size={32} />,
  };

  const bgColors = {
    SUCCESS: 'bg-emerald-50/90 dark:bg-emerald-900/40 border-emerald-200/50',
    INFO: 'bg-blue-50/90 dark:bg-blue-900/40 border-blue-200/50',
    WARNING: 'bg-orange-50/90 dark:bg-orange-900/40 border-orange-200/50',
    ACHIEVEMENT: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/40 dark:to-orange-900/40 border-yellow-200/50',
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
      className={`pointer-events-auto relative min-w-[320px] max-w-md p-6 rounded-[2.5rem] border backdrop-blur-xl shadow-2xl ${bgColors[notification.type]} flex items-center gap-5`}
    >
      <div className="flex-shrink-0 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm">
        {icons[notification.type]}
      </div>
      
      <div className="flex-1 space-y-1 pr-4">
        <h4 className="font-black text-slate-800 dark:text-white leading-tight">{notification.title}</h4>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{notification.message}</p>
      </div>

      <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
        <X size={16} />
      </button>

      {/* Barra de Progresso do Tempo */}
      <motion.div 
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: notification.duration / 1000, ease: 'linear' }}
        className="absolute bottom-0 left-8 right-8 h-1 bg-slate-200/50 dark:bg-slate-700/50 rounded-full"
      />
    </motion.div>
  );
}

function CheckIcon() {
  return (
    <div className="relative">
      <GraduationCap className="text-emerald-600" size={28} />
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5"
      >
        <Sparkles size={10} />
      </motion.div>
    </div>
  );
}

export const useNotify = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotify must be used within a NotificationProvider');
  return context.notify;
};
