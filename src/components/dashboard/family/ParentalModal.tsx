'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, Lock, User, ShieldAlert } from 'lucide-react';

interface ParentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  onAction: (action: string) => void;
}

export const ParentalModal = ({ isOpen, onClose, studentName, onAction }: ParentalModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-3xl relative z-[101] overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-orange-500" />
            
            <div className="flex justify-between items-center mb-8">
              <div>
                 <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <ShieldAlert className="text-rose-500" size={24} />
                    Controle Parental
                 </h2>
                 <p className="text-sm font-bold text-slate-500 mt-1">Gestão rápida para {studentName}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
               <button 
                onClick={() => onAction('coins')}
                className="w-full p-5 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 flex items-center gap-5 hover:scale-[1.02] transition-all text-left group"
               >
                  <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-orange-500 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors">
                     <Coins size={28} />
                  </div>
                  <div>
                     <p className="font-black text-slate-800 dark:text-white">Dar 50 Moedas</p>
                     <p className="text-xs font-bold text-slate-500">Recompensa por bom comportamento</p>
                  </div>
               </button>

               <button 
                onClick={() => onAction('password')}
                className="w-full p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 flex items-center gap-5 hover:scale-[1.02] transition-all text-left group"
               >
                  <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                     <Lock size={28} />
                  </div>
                  <div>
                     <p className="font-black text-slate-800 dark:text-white">Resetar Senha</p>
                     <p className="text-xs font-bold text-slate-500">Mudar as credenciais de acesso</p>
                  </div>
               </button>

               <button 
                onClick={() => onAction('edit')}
                className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 flex items-center gap-5 hover:scale-[1.02] transition-all text-left group"
               >
                  <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 shadow-sm group-hover:bg-slate-800 group-hover:text-white transition-colors">
                     <User size={28} />
                  </div>
                  <div>
                     <p className="font-black text-slate-800 dark:text-white">Editar Perfil</p>
                     <p className="text-xs font-bold text-slate-500">Mudar avatar, nome ou e-mail</p>
                  </div>
               </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
               <button 
                className="w-full py-4 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-colors"
                onClick={() => onAction('unlink')}
               >
                 Desvincular Filho
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
