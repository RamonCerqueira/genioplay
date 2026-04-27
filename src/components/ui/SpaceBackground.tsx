'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function SpaceBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Nebulosas em Movimento Orgânico */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, -50, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[120px]"
      />

      {/* Camada 1: Estrelas Lentas (Fundo) */}
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={`star-l-${i}`}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            opacity: Math.random() 
          }}
          animate={{ 
            y: ['-10%', '110%'],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ 
            duration: 40 + Math.random() * 60, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        />
      ))}

      {/* Camada 2: Estrelas Médias (Meio) */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={`star-m-${i}`}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            opacity: Math.random() 
          }}
          animate={{ 
            y: ['-10%', '110%'],
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.8, 1]
          }}
          transition={{ 
            duration: 20 + Math.random() * 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute w-[3px] h-[3px] bg-blue-300 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.9)]"
        />
      ))}

      {/* Estrelas Cadentes (Shooting Stars) */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`shooting-${i}`}
          initial={{ x: '-10%', y: Math.random() * 50 + '%', opacity: 0, scaleX: 1 }}
          animate={{ 
            x: ['0%', '150%'],
            y: [null, (Math.random() * 100) + '%'],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            repeatDelay: 5 + Math.random() * 10,
            delay: i * 4,
            ease: "easeIn"
          }}
          className="absolute w-[100px] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent rotate-[-35deg] z-10"
        />
      ))}

      {/* Overlay de Vinheta */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_90%)]" />
    </div>
  );
}
