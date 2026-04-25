'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Star, ChevronRight, Play, Trophy, Rocket, Castle, CircleDot } from 'lucide-react';

interface Phase {
  id: number;
  nome: string;
  descricao: string;
  dificuldade: number;
  status: 'disponivel' | 'bloqueado' | 'concluido';
  posicao: { x: number, y: number, z: number };
  conexoes: number[];
  tipo_visual: 'ilha' | 'planeta' | 'plataforma' | 'castelo';
  cor: string;
  teste: any[];
}

interface BoardPlayerProps {
  trilha: {
    modo: string;
    fases: Phase[];
  };
  onStartPhase: (phase: Phase) => void;
}

export const BoardPlayer = ({ trilha, onStartPhase }: BoardPlayerProps) => {
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'castelo': return <Castle size={32} />;
      case 'planeta': return <Rocket size={32} />;
      case 'ilha': return <CircleDot size={32} />;
      default: return <Star size={32} />;
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-950 rounded-[3rem] overflow-hidden border-4 border-slate-900 shadow-2xl group">
      {/* Background Decorativo (Espaço/Névoa) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Grid de Perspectiva */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <div className="w-[200%] h-[200%] border-[1px] border-slate-500 rounded-full rotate-x-60" 
             style={{ transform: 'perspective(1000px) rotateX(60deg)' }} />
      </div>

      {/* Container do Tabuleiro com Scroll Suave */}
      <div className="relative w-full h-full overflow-auto p-20 scrollbar-hide">
        <div className="relative min-w-[800px] min-h-[500px]">
          
          {/* Conexões (Linhas entre as fases) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {trilha.fases.map(phase => 
              phase.conexoes.map(connId => {
                const target = trilha.fases.find(f => f.id === connId);
                if (!target) return null;
                
                // Cálculo de posição 2D baseada na 3D (Simples)
                const x1 = 400 + (phase.posicao.x * 200);
                const y1 = 250 + (phase.posicao.y * 100);
                const x2 = 400 + (target.posicao.x * 200);
                const y2 = 250 + (target.posicao.y * 100);

                return (
                  <motion.line
                    key={`${phase.id}-${connId}`}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={phase.status === 'concluido' ? phase.cor : '#1e293b'}
                    strokeWidth="4"
                    strokeDasharray="8 8"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                  />
                );
              })
            )}
          </svg>

          {/* Fases (Objetos 3D-ish) */}
          {trilha.fases.map((phase) => {
            const posX = 400 + (phase.posicao.x * 200);
            const posY = 250 + (phase.posicao.y * 100);
            const isLocked = phase.status === 'bloqueado';

            return (
              <motion.div
                key={phase.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: phase.id * 0.2 }}
                style={{ left: posX, top: posY }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={() => !isLocked && setSelectedPhase(phase)}
                    className={`
                      w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 relative group
                      ${isLocked 
                        ? 'bg-slate-800 text-slate-600 grayscale cursor-not-allowed' 
                        : 'hover:scale-125 hover:-translate-y-4 cursor-pointer active:scale-95'
                      }
                    `}
                    style={{ 
                        backgroundColor: !isLocked ? phase.cor : undefined,
                        boxShadow: !isLocked ? `0 20px 40px ${phase.cor}44` : undefined
                    }}
                  >
                    {!isLocked && (
                      <div className="absolute -inset-2 bg-white/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    
                    {isLocked ? <Lock size={24} /> : getIcon(phase.tipo_visual)}

                    {/* Badge de Dificuldade */}
                    {!isLocked && (
                      <div className="absolute -top-2 -right-2 bg-white text-slate-900 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">
                        LV{phase.dificuldade}
                      </div>
                    )}
                  </button>
                  
                  <div className="text-center">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isLocked ? 'text-slate-700' : 'text-white'}`}>
                      {phase.nome}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal de Detalhes da Fase */}
      <AnimatePresence>
        {selectedPhase && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-x-8 bottom-8 bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-2xl z-50 border border-slate-100 dark:border-slate-800"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Missão {selectedPhase.id}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <Star key={i} size={12} className={i < selectedPhase.dificuldade ? "text-amber-500 fill-amber-500" : "text-slate-200"} />
                    ))}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                  {selectedPhase.nome}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedPhase(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Fechar
              </button>
            </div>

            <p className="text-slate-500 dark:text-slate-400 font-bold mb-8 leading-relaxed">
              {selectedPhase.descricao}
            </p>

            <button
              onClick={() => onStartPhase(selectedPhase)}
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-lg shadow-xl shadow-blue-500/30 transition-all hover:gap-6"
            >
              INICIAR DESAFIO
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD (Heads-up Display) */}
      <div className="absolute top-8 left-8 flex items-center gap-4 pointer-events-none">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl flex items-center gap-4">
           <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Trophy size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Seu Progresso</p>
              <p className="text-white font-black">Mestre do Tabuleiro</p>
           </div>
        </div>
      </div>
    </div>
  );
};
