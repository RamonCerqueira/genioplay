'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle2, AlertCircle, Star, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n: any) => !n.read).length);
      }
    } catch (err) {}
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchNotifications();
    } catch (err) {}
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'MISSION_COMPLETE': return <CheckCircle2 className="text-emerald-500" size={16} />;
      case 'FOCUS_ALERT': return <AlertCircle className="text-rose-500" size={16} />;
      case 'BADGE_EARNED': return <Star className="text-amber-500" size={16} fill="currentColor" />;
      default: return <Info className="text-blue-500" size={16} />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
      >
        <Bell size={24} className="text-slate-500 dark:text-slate-400 group-hover:text-blue-600 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-3xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">Notificações</h4>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
              </div>

              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center space-y-2">
                    <Bell className="mx-auto text-slate-200" size={32} />
                    <p className="text-xs font-bold text-slate-400">Tudo limpo por aqui!</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => markAsRead(n.id)}
                      className={`p-4 border-b border-slate-50 dark:border-slate-800 flex gap-4 cursor-pointer transition-colors ${n.read ? 'opacity-60' : 'bg-blue-50/30 dark:bg-blue-900/10 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'}`}
                    >
                      <div className="shrink-0 pt-1">{getIcon(n.type)}</div>
                      <div className="space-y-1">
                        <p className="text-xs font-black text-slate-800 dark:text-white leading-tight">{n.title}</p>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{n.message}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase">{new Date(n.createdAt).toLocaleTimeString()}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
