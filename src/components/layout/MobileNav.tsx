'use client'

import React from 'react';
import { LucideIcon, LayoutDashboard, BookOpen, Gift, Users, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { motion } from 'framer-motion';

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

const NavItem = ({ href, icon: Icon, label, active }: NavItemProps) => (
  <Link
    href={href}
    className={`flex flex-col items-center justify-center gap-1.5 p-2 transition-all duration-300 relative ${active ? 'text-blue-600' : 'text-slate-400'
      }`}
  >
    <motion.div 
      whileTap={{ scale: 0.9 }}
      className={`relative ${active ? 'scale-110' : ''} transition-transform duration-300`}
    >
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      {active && (
        <motion.span 
          layoutId="mobile-dot"
          className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" 
        />
      )}
    </motion.div>
    <span className={`text-[8px] font-black uppercase tracking-wider ${active ? 'opacity-100' : 'opacity-60'}`}>
      {label}
    </span>
  </Link>
);

export default function MobileNav({ role }: { role: 'STUDENT' | 'GUARDIAN' | 'ADMIN' }) {
  const pathname = usePathname();
  const currentRole = role || 'GUARDIAN';

  return (
    <motion.nav 
      initial={{ y: 100, x: '-50%', opacity: 0 }}
      animate={{ y: 0, x: '-50%', opacity: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl px-6 py-3 flex justify-between items-center w-[92%] max-w-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 md:hidden"
    >
      <NavItem href="/dashboard" icon={LayoutDashboard} label="Início" active={pathname === '/dashboard'} />
      {currentRole === 'STUDENT' ? (
        <>
          <NavItem href="/dashboard/study" icon={BookOpen} label="Estudar" active={pathname.includes('/study')} />
          <NavItem href="/dashboard/rewards" icon={Gift} label="Loja" active={pathname.includes('/rewards')} />
        </>
      ) : (
        <>
          <NavItem href="/dashboard/family" icon={Users} label="Família" active={pathname.includes('/family')} />
          <NavItem href="/dashboard/settings" icon={Gift} label="Metas" active={pathname.includes('/settings')} />
        </>
      )}

      <div className="h-8 w-px bg-slate-200/50 dark:bg-slate-700/50 mx-1" />

      <div className="flex flex-col items-center gap-1 scale-90">
        <ThemeToggle />
        <span className="text-[7px] font-black text-slate-400 uppercase">Tema</span>
      </div>

      <NavItem href="/logout" icon={LogOut} label="Sair" />
    </motion.nav>
  );
}

