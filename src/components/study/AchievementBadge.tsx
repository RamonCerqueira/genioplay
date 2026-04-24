'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface BadgeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  unlocked: boolean;
  color: string;
}

export default function AchievementBadge({ icon: Icon, title, description, unlocked, color }: BadgeProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={`relative group p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 ${
        unlocked 
          ? `bg-white border-${color}-100 shadow-lg shadow-${color}-500/10` 
          : 'bg-slate-50 border-slate-100 grayscale opacity-40'
      }`}
    >
      <div className={`p-3 rounded-xl ${unlocked ? `bg-${color}-100 text-${color}-600` : 'bg-slate-200 text-slate-400'}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest ${unlocked ? `text-${color}-600` : 'text-slate-400'}`}>
          {unlocked ? 'Conquistado' : 'Bloqueado'}
        </p>
        <h4 className="text-sm font-black text-slate-800">{title}</h4>
      </div>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 p-3 bg-slate-800 text-white rounded-xl text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-2xl">
        {description}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
      </div>
    </motion.div>
  );
}
