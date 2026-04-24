'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function HeroAnimation() {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px]"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[300px] h-[300px] bg-orange-400/10 rounded-full blur-[80px] -bottom-10 -right-10"
      />

      {/* Floating Glassmorphic Cards */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute z-20 w-64 h-40 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 rounded-3xl shadow-2xl p-6 flex flex-col justify-between"
        style={{ left: '15%', top: '20%' }}
      >
        <div className="flex gap-2">
           <div className="w-8 h-2 bg-blue-500 rounded-full" />
           <div className="w-12 h-2 bg-blue-200 dark:bg-blue-900 rounded-full" />
        </div>
        <div className="space-y-2">
           <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-lg" />
           <div className="w-4/5 h-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg" />
        </div>
        <div className="flex justify-end">
           <div className="w-8 h-8 rounded-full bg-blue-600 shadow-lg shadow-blue-500/40" />
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute z-10 w-56 h-32 bg-white/20 dark:bg-slate-800/20 backdrop-blur-md border border-white/30 dark:border-slate-700/30 rounded-3xl shadow-xl p-5"
        style={{ right: '10%', bottom: '25%' }}
      >
        <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-orange-500/30">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        </div>
        <div className="h-2 w-20 bg-orange-100 dark:bg-orange-900/50 rounded-full" />
      </motion.div>

      {/* Abstract Neural Nodes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{ 
              duration: 3 + Math.random() * 2, 
              repeat: Infinity, 
              delay: i * 0.5 
            }}
            className="absolute w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
          />
        ))}
      </div>

      {/* Center Piece: The Brain Core */}
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="relative z-30 w-48 h-48 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[3rem] shadow-2xl shadow-blue-500/40 flex items-center justify-center group"
      >
        <div className="absolute inset-0 rounded-[3rem] bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-2xl">
          <path d="M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728-1.414-1.414M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636l-1.414 1.414M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>

        {/* Orbiting particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-20px] border border-blue-200/30 rounded-full pointer-events-none"
            style={{ transform: `rotate(${i * 45}deg)` }}
          />
        ))}
      </motion.div>
    </div>
  );
}
