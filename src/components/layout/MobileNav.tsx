'use client'

import React from 'react';
import { LucideIcon, LayoutDashboard, BookOpen, Gift, Users, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

const NavItem = ({ href, icon: Icon, label, active }: NavItemProps) => (
  <Link
    href={href}
    className={`flex flex-col items-center justify-center gap-1.5 p-2 transition-all duration-300 relative group ${active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
      }`}
  >
    <div className={`relative ${active ? 'scale-110' : 'group-hover:scale-105'} transition-transform duration-300`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      {active && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border-2 border-white animate-pulse" />
      )}
    </div>
    <span className={`text-[9px] font-bold uppercase tracking-tighter ${active ? 'opacity-100' : 'opacity-70'}`}>
      {label}
    </span>
    {active && (
      <div className="absolute -bottom-1 w-8 h-1 bg-blue-600 rounded-full blur-[2px]" />
    )}
  </Link>
);

export default function MobileNav({ role }: { role: 'STUDENT' | 'GUARDIAN' | 'ADMIN' }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-card px-6 py-3 flex justify-between items-center w-[90%] max-w-md shadow-2xl shadow-blue-900/10 border-white/80 md:hidden">
      <NavItem href="/dashboard" icon={LayoutDashboard} label="Início" active={pathname === '/dashboard'} />
      {role === 'STUDENT' ? (
        <>
          <NavItem href="/dashboard/study" icon={BookOpen} label="Estudar" active={pathname === '/dashboard/study'} />
          <NavItem href="/dashboard/rewards" icon={Gift} label="Loja" active={pathname === '/dashboard/rewards'} />
        </>
      ) : (
        <>
          <NavItem href="/dashboard/family" icon={Users} label="Filhos" active={pathname === '/dashboard/family'} />
          <NavItem href="/dashboard/settings" icon={Gift} label="Prêmios" active={pathname === '/dashboard/settings'} />
        </>
      )}
      <NavItem href="/logout" icon={LogOut} label="Sair" />
    </nav>
  );
}

