'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex items-center w-14 h-7 p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors duration-500 focus:outline-none"
      aria-label="Alternar tema"
    >
      {/* Background Icons */}
      <div className="absolute inset-0 flex justify-between items-center px-1.5 pointer-events-none">
        <Sun size={12} className={`${isDark ? 'text-slate-500' : 'text-amber-500'} transition-colors duration-300`} />
        <Moon size={12} className={`${isDark ? 'text-blue-400' : 'text-slate-400'} transition-colors duration-300`} />
      </div>

      {/* Sliding Circle */}
      <motion.div
        animate={{
          x: isDark ? 28 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        className="z-10 w-5 h-5 bg-white dark:bg-slate-900 rounded-full shadow-sm flex items-center justify-center border border-slate-200/50 dark:border-slate-700"
      >
        {isDark ? (
          <Moon size={10} className="text-blue-400" />
        ) : (
          <Sun size={10} className="text-amber-500" />
        )}
      </motion.div>
    </button>
  );
}
