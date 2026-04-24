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
  CreditCard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ 
  role, 
  subscriptionStatus = 'FREE' 
}: { 
  role: 'STUDENT' | 'GUARDIAN',
  subscriptionStatus?: string 
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const menuItems = role === 'GUARDIAN' ? [
    { icon: LayoutDashboard, label: 'Resumo', href: '/dashboard' },
    { icon: Users, label: 'Família', href: '/dashboard/family' },
    { icon: TrendingUp, label: 'Relatórios', href: '/dashboard/reports' },
    { icon: Gift, label: 'Recompensas', href: '/dashboard/settings' },
    { icon: CreditCard, label: 'Assinatura', href: '/pricing' },
  ] : [
    { icon: LayoutDashboard, label: 'Missões', href: '/dashboard' },
    { icon: GraduationCap, label: 'Estudar', href: '/dashboard/study' },
    { icon: Gift, label: 'Loja', href: '/dashboard/rewards' },
  ];

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? 100 : 300 }}
      className="hidden md:flex flex-col h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-50 p-6 transition-all duration-500 ease-in-out"
    >
      {/* Decorative Blur */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full p-1.5 shadow-md text-slate-400 hover:text-blue-600 transition-colors z-50"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-3 px-2 mb-12 ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-2xl shadow-xl shadow-blue-500/30 text-white transform hover:rotate-6 transition-transform">
          <GraduationCap size={isCollapsed ? 28 : 24} />
        </div>
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-black tracking-tighter text-slate-800 dark:text-white"
          >
            Gênio<span className="text-blue-600">Play</span>
          </motion.span>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4 px-4'} py-3.5 rounded-2xl transition-all duration-300 relative group ${
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-2xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-black text-sm tracking-wide"
                  >
                    {item.label}
                  </motion.span>
                )}

                {isActive && !isCollapsed && (
                  <motion.div 
                    layoutId="active-dot"
                    className="absolute right-4 w-1.5 h-1.5 bg-blue-600 rounded-full shadow-lg shadow-blue-500/50" 
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile/Plan */}
      <div className="mt-auto space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800 relative">
        <div className={`bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-4 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} group hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer`}>
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-blue-600 shrink-0 group-hover:rotate-12 transition-transform">
             <ShieldCheck size={20} />
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
               <p className="text-sm font-black text-slate-800 dark:text-white truncate">
                  Plano {subscriptionStatus === 'PREMIUM' ? 'Pro' : 'Free'}
               </p>
            </div>
          )}
        </div>
        
        <Link href="/logout">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4 px-4'} py-3.5 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-300 group`}>
             <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
             {!isCollapsed && <span className="font-black text-sm uppercase tracking-widest">Sair</span>}
          </div>
        </Link>
      </div>
    </motion.aside>
  );
}
