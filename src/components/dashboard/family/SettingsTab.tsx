'use client';

import React from 'react';
import { User, Mail, Calendar, Lock, Loader2 } from 'lucide-react';

interface SettingsTabProps {
  formData: any;
  setFormData: (data: any) => void;
  handleUpdate: () => void;
  isSaving: boolean;
}

export const SettingsTab = ({ formData, setFormData, handleUpdate, isSaving }: SettingsTabProps) => {
  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="premium-card p-10 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50 space-y-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">Editar Cadastro</h2>
          <p className="text-slate-500 font-bold mt-1">Atualize as informações de acesso e perfil.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Filho</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                className="input-field pl-12 h-14" 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail de Acesso</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                className="input-field pl-12 h-14" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data de Nascimento</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="date" 
                  className="input-field pl-12 h-14" 
                  value={formData.birthDate}
                  onChange={e => setFormData({...formData, birthDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nova Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="input-field pl-12 h-14" 
                  value={formData.newPassword}
                  onChange={e => setFormData({...formData, newPassword: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button 
              onClick={handleUpdate}
              disabled={isSaving}
              className="btn-primary w-full py-5 text-lg shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3"
            >
              {isSaving ? <Loader2 className="animate-spin" size={24} /> : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
