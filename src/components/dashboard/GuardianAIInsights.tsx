'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, ArrowRight, ShieldCheck, Target, Zap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function GuardianAIInsights() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/guardian/ai-insights')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="premium-card p-12 bg-white dark:bg-slate-900 border-none shadow-xl flex items-center justify-center">
       <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  if (!data?.insights?.length) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <Brain className="text-blue-600" size={28} /> Insights do Mentor IA
        </h2>
        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.mentorLevel.title}</p>
              <p className="text-xs font-black text-slate-800 dark:text-white">Nível {data.mentorLevel.level}</p>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 shadow-inner border border-amber-200/50">
              <ShieldCheck size={24} />
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {data.insights.map((insight: any, i: number) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl group hover:border-blue-300 transition-all"
          >
             <div className="p-6 flex items-start gap-5">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0">
                   {insight.childAvatar}
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">IA Insight • {insight.childName}</span>
                      <Sparkles size={12} className="text-amber-500 animate-pulse" />
                   </div>
                   <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      "{insight.message}"
                   </p>
                </div>
             </div>
             <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between group-hover:bg-blue-600 transition-all">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors">
                   <Zap size={14} fill="currentColor" />
                   <span className="text-[10px] font-black uppercase tracking-widest">{insight.action}</span>
                </div>
                <ArrowRight size={16} className="text-blue-600 dark:text-blue-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
