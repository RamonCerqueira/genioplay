'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  TrendingUp, 
  Gift, 
  LogOut, 
  GraduationCap,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar({ 
  role, 
  subscriptionStatus = 'FREE' 
}: { 
  role: 'STUDENT' | 'GUARDIAN',
  subscriptionStatus?: string 
}) {
  const pathname = usePathname();

  const menuItems = role === 'GUARDIAN' ? [
    { icon: LayoutDashboard, label: 'Resumo', href: '/dashboard' },
    { icon: Users, label: 'Meus Filhos', href: '/dashboard/family' },
    { icon: TrendingUp, label: 'Relatórios', href: '/dashboard/reports' },
    { icon: Gift, label: 'Recompensas', href: '/dashboard/settings' },
    { icon: CreditCard, label: 'Assinatura', href: '/pricing' },
  ] : [
    { icon: LayoutDashboard, label: 'Missões', href: '/dashboard' },
    { icon: GraduationCap, label: 'Estudar', href: '/dashboard/study' },
    { icon: Gift, label: 'Loja', href: '/dashboard/rewards' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-50 p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-12">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20 text-white">
          <GraduationCap size={24} />
        </div>
        <span className="text-2xl font-black tracking-tighter text-slate-800 dark:text-white">
          Gênio<span className="text-blue-600">Play</span>
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group ${
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-2xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="font-bold text-sm tracking-wide">{item.label}</span>
                {isActive && <div className="absolute right-4 w-1.5 h-1.5 bg-blue-600 rounded-full" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
             <ShieldCheck size={20} />
          </div>
          <div className="flex-1 overflow-hidden">
             <p className="text-xs font-black text-slate-800 dark:text-white truncate">
                Plano {subscriptionStatus === 'PREMIUM' ? 'Pro' : 'Free'}
             </p>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {subscriptionStatus === 'PREMIUM' ? 'Assinatura Ativa' : 'Básico'}
             </p>
          </div>
        </div>
        
        <Link href="/logout">
          <div className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-300 group">
             <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
             <span className="font-bold text-sm">Sair da Conta</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
