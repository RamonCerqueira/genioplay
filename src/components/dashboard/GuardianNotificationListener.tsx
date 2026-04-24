'use client';

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function GuardianNotificationListener({ guardianId }: { guardianId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const socket = io();
    
    socket.emit('join-room', `guardian:${guardianId}`);

    socket.on('notification', (data) => {
      setNotifications(prev => [data, ...prev].slice(0, 5));
      // Play a subtle sound or vibration if needed
    });

    return () => {
      socket.disconnect();
    };
  }, [guardianId]);

  return (
    <div className="fixed top-24 right-6 z-[100] w-80 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`pointer-events-auto premium-card p-4 mb-4 border-none shadow-2xl flex items-start gap-3 ${
              notif.critical ? 'bg-red-600 text-white' : 'bg-white text-slate-800'
            }`}
          >
            <div className={`p-2 rounded-xl ${notif.critical ? 'bg-white/20' : 'bg-blue-100 text-blue-600'}`}>
              {notif.critical ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-widest ${notif.critical ? 'text-white/80' : 'text-slate-400'}`}>
                {notif.type}
              </p>
              <p className="text-sm font-bold leading-tight">{notif.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
