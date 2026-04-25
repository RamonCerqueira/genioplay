'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, BookOpen, Rocket, Lightbulb, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const StudyExplorer = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const suggestions = [
    { title: 'Sistema Solar', subject: 'Ciências', icon: '🪐' },
    { title: 'Império Romano', subject: 'História', icon: '🏛️' },
    { title: 'Fotossíntese', subject: 'Biologia', icon: '🌱' },
    { title: 'Frações Matemáticas', subject: 'Matemática', icon: '🔢' },
  ];

  const handleSearch = async (topic?: string) => {
    const searchTopic = topic || query;
    if (!searchTopic.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/study/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'Geral',
          topic: searchTopic,
          persona: 'Tutor Divertido',
          visualMode: 'tabuleiro'
        })
      });

      const data = await res.json();
      if (data.success && data.lessonId) {
        router.push(`/dashboard/study/${data.lessonId}`);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-500/20 mb-8"
        >
          <Rocket size={40} />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tight">
          O que você quer <span className="text-blue-600">descobrir</span> hoje?
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto">
          Digite qualquer tema e o Tutor Gênio criará uma jornada incrível só para você!
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ex: Como os vulcões funcionam? ou Quem foi Einstein?"
            className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] py-6 pl-8 pr-20 text-xl font-bold focus:outline-none focus:border-blue-500 transition-all shadow-2xl dark:text-white"
          />
          <button 
            onClick={() => handleSearch()}
            disabled={isLoading}
            className="absolute right-3 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Search size={24} />}
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-6">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" /> Sugestões para você
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((s, i) => (
            <motion.button
              key={i}
              whileHover={{ x: 10 }}
              onClick={() => handleSearch(s.title)}
              className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl hover:border-blue-200 dark:hover:border-blue-900 transition-all text-left group shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl bg-slate-50 dark:bg-slate-800 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 dark:text-white">{s.title}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.subject}</p>
                </div>
              </div>
              <ArrowRight className="text-slate-300 group-hover:text-blue-600 transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-[200] flex flex-col items-center justify-center gap-6"
          >
            <div className="relative">
               <div className="w-24 h-24 border-4 border-blue-100 dark:border-slate-800 rounded-full animate-ping opacity-25" />
               <Loader2 className="animate-spin text-blue-600 absolute inset-0 m-auto" size={48} />
            </div>
            <div className="text-center space-y-2">
               <h2 className="text-2xl font-black text-slate-800 dark:text-white">Criando sua jornada...</h2>
               <p className="text-slate-500 font-bold italic">O Tutor Gênio está preparando algo incrível! ✨</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
