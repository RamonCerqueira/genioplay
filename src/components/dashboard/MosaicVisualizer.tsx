'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MosaicVisualizerProps {
  imageUrl: string;
  totalPieces: number;
  unlockedPieces: number;
}

export function MosaicVisualizer({ imageUrl, totalPieces, unlockedPieces }: MosaicVisualizerProps) {
  // Calculamos as dimensões do grid (ex: 100 peças = 10x10)
  const gridSize = Math.ceil(Math.sqrt(totalPieces));
  const pieces = Array.from({ length: totalPieces });

  return (
    <div 
      className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-2xl"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
      }}
    >
      {/* Imagem de Fundo (Blur) */}
      <div 
        className="absolute inset-0 z-0 opacity-20 blur-xl scale-110"
        style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' }}
      />

      {pieces.map((_, i) => {
        const isUnlocked = i < unlockedPieces;
        
        // Calculamos a posição da imagem para cada "peça"
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const xPos = (col / (gridSize - 1)) * 100;
        const yPos = (row / (gridSize - 1)) * 100;

        return (
          <div key={i} className="relative border-[0.5px] border-white/10 overflow-hidden">
            <motion.div
              initial={false}
              animate={{ 
                opacity: isUnlocked ? 1 : 0,
                scale: isUnlocked ? 1 : 1.2,
                filter: isUnlocked ? 'grayscale(0%)' : 'grayscale(100%) blur(10px)',
              }}
              transition={{ duration: 0.8, delay: isUnlocked ? (i % 10) * 0.05 : 0 }}
              className="w-full h-full"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${gridSize * 100}%`,
                backgroundPosition: `${xPos}% ${yPos}%`,
              }}
            />
            {!isUnlocked && (
              <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                 <div className="w-1 h-1 bg-white/20 rounded-full" />
              </div>
            )}
          </div>
        );
      })}

      {/* Overlay de Progresso */}
      <div className="absolute bottom-6 right-6 z-10">
         <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/20">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest text-center">Peças Coletadas</p>
            <p className="text-xl font-black text-slate-800 dark:text-white text-center">
               {unlockedPieces} <span className="text-slate-400">/ {totalPieces}</span>
            </p>
         </div>
      </div>
    </div>
  );
}
