'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Brain, Trophy, AlertCircle, CheckCircle2, XCircle, Timer, Coins, Lightbulb } from 'lucide-react';
import { useFocusTracker } from '@/hooks/useFocusTracker';
import confetti from 'canvas-confetti';

export default function StudentStudyPage({ params }: { params: { lessonId: string } }) {
  const [lesson, setLesson] = useState<any>(null);
  const [step, setStep] = useState<'CARDS' | 'QUIZ' | 'SUCCESS'>('CARDS');
  const [currentCard, setCurrentCard] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');

  // Inicia sessão real no banco de dados
  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch('/api/study/start-session', { method: 'POST' });
        const data = await res.json();
        if (data.sessionId) setSessionId(data.sessionId);
      } catch (err) {
        console.error('Erro ao iniciar sessão:', err);
      }
    };

    initSession();

    fetch(`/api/student/lessons/${params.lessonId}`)
      .then(res => res.json())
      .then(data => {
        setLesson(data.lesson);
        setLoading(false);
      });
  }, [params.lessonId]);

  // Ativa o Anti-Cheat
  useFocusTracker(sessionId, params.lessonId);

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>;

  const handleNextCard = () => {
    if (currentCard < lesson.topic.flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    } else {
      setStep('QUIZ');
    }
  };

  const handleAnswer = async (optionId: string, isCorrect: boolean) => {
    const newAnswers = [...answers, { questionId: lesson.topic.questions[currentQuestion].id, optionId, isCorrect }];
    setAnswers(newAnswers);

    if (currentQuestion < lesson.topic.questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 600);
    } else {
      setTimeout(() => completeLesson(newAnswers), 1000);
    }
  };

  const completeLesson = async (finalAnswers: any[]) => {
    setStep('SUCCESS');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#f59e0b', '#10b981']
    });

    // Salva no banco (Simplificado para o exemplo)
    await fetch('/api/student/complete-lesson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId: params.lessonId, answers: finalAnswers })
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-6">
      {/* Header Estilo Gamer */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Brain size={24} />
          </div>
          <div>
            <h1 className="font-black text-lg">{lesson?.topic.name}</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{lesson?.topic.subject.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
           <div className="flex items-center gap-2 text-blue-600">
              <Timer size={18} />
              <span className="font-black">12:45</span>
           </div>
           <div className="h-6 w-px bg-slate-100 dark:bg-slate-800" />
           <div className="flex items-center gap-2 text-orange-500">
              <Coins size={18} />
              <span className="font-black">450</span>
           </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'CARDS' && (
            <motion.div 
              key="cards"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
              {/* Progress Bar */}
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-black text-slate-400 uppercase">Flashcards: {currentCard + 1}/{lesson.topic.flashcards.length}</span>
                <div className="flex gap-1">
                  {lesson.topic.flashcards.map((_: any, i: number) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all ${i <= currentCard ? 'w-6 bg-blue-600' : 'w-2 bg-slate-200 dark:bg-slate-800'}`} />
                  ))}
                </div>
              </div>

              {/* Card 3D Flip */}
              <div 
                className="perspective-1000 h-[400px] cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div 
                  className={`relative w-full h-full transition-all duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                >
                  {/* Front */}
                  <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-12 flex flex-col items-center justify-center text-center backface-hidden border border-slate-100 dark:border-slate-800">
                     <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full text-blue-600 mb-6">
                        <Lightbulb size={32} />
                     </div>
                     <h2 className="text-3xl font-black text-slate-800 dark:text-white leading-tight">
                       {lesson.topic.flashcards[currentCard].front}
                     </h2>
                     <p className="mt-8 text-slate-400 font-bold animate-pulse text-sm">Clique para ver a explicação</p>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] shadow-2xl p-12 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180 text-white">
                     <p className="text-xl font-bold leading-relaxed">
                       {lesson.topic.flashcards[currentCard].back}
                     </p>
                     <button 
                      onClick={(e) => { e.stopPropagation(); handleNextCard(); }}
                      className="mt-12 bg-white text-blue-600 font-black py-4 px-8 rounded-2xl hover:bg-blue-50 transition-all flex items-center gap-2 shadow-xl"
                     >
                       Entendi! Próximo <ChevronRight size={20} />
                     </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {step === 'QUIZ' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                 <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                    <span>Questão {currentQuestion + 1} de {lesson.topic.questions.length}</span>
                    <span>Nível: {lesson.topic.questions[currentQuestion].difficulty > 7 ? '🔥 Difícil' : '⚡ Normal'}</span>
                 </div>
                 <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestion + 1) / lesson.topic.questions.length) * 100}%` }}
                    />
                 </div>
              </div>

              <div className="premium-card p-8 md:p-12 space-y-8">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
                  {lesson.topic.questions[currentQuestion].text}
                </h2>

                <div className="grid gap-4">
                  {lesson.topic.questions[currentQuestion].options.map((option: any) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id, option.isCorrect)}
                      className="group relative p-6 rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 text-left transition-all font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-blue-600 text-slate-400 group-hover:text-blue-600 transition-colors">
                           {/* Letra da opção (A, B, C...) */}
                        </div>
                        <span className="text-slate-700 dark:text-slate-300">{option.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'SUCCESS' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 py-12"
            >
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-500 mx-auto">
                  <Trophy size={64} />
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg shadow-emerald-500/30"
                >
                  <CheckCircle2 size={24} />
                </motion.div>
              </div>

              <div>
                <h2 className="text-4xl font-black text-slate-800 dark:text-white">Excelente Trabalho!</h2>
                <p className="text-slate-500 font-bold text-lg mt-2">Você completou o módulo de {lesson.topic.name}.</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 max-w-sm mx-auto">
                <div className="flex justify-around items-center">
                   <div className="text-center">
                      <p className="text-sm font-black text-slate-400 uppercase">Acertos</p>
                      <p className="text-3xl font-black text-emerald-500">{answers.filter(a => a.isCorrect).length}</p>
                   </div>
                   <div className="h-10 w-px bg-slate-100 dark:bg-slate-800" />
                   <div className="text-center">
                      <p className="text-sm font-black text-slate-400 uppercase">LarCoins</p>
                      <div className="flex items-center gap-1 justify-center text-orange-500">
                        <Coins size={20} />
                        <span className="text-3xl font-black">+150</span>
                      </div>
                   </div>
                </div>
              </div>

              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="btn-primary w-full max-w-sm py-4 !text-lg"
              >
                Voltar ao Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
