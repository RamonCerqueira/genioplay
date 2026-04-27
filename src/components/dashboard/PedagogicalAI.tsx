'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, TrendingUp, AlertCircle, Lightbulb, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PedagogicalAI({ studentId }: { studentId: string }) {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      setLoading(true);
      fetch(`/api/guardian/pedagogical-insights?studentId=${studentId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setInsights(data.insights);
          setLoading(false);
        });
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="premium-card p-8 flex flex-col items-center justify-center space-y-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-dashed border-2">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="text-sm font-black text-slate-500 uppercase tracking-widest">IA analisando desempenho...</p>
      </div>
    );
  }

  const strength = insights.find(i => i.category === 'STRENGTH')?.text;
  const weakness = insights.find(i => i.category === 'WEAKNESS')?.text;
  const suggestion = insights.find(i => i.category === 'SUGGESTION')?.text;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Brain size={20} />
        </div>
        <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Análise do Mentor IA</h3>
      </div>

      <div className="grid gap-4">
        {strength && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-2xl flex gap-4"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm"><TrendingUp size={16} /></div>
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Ponto Forte</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{strength}</p>
            </div>
          </motion.div>
        )}

        {weakness && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl flex gap-4"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm"><AlertCircle size={16} /></div>
            <div>
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Precisa de Atenção</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{weakness}</p>
            </div>
          </motion.div>
        )}

        {suggestion && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl flex gap-4"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm"><Lightbulb size={16} /></div>
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Sugestão do Tutor</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{suggestion}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
