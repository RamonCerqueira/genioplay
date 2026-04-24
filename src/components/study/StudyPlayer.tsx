'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, AlertCircle, ChevronRight, ChevronLeft, CheckCircle2, XCircle, Timer, Sparkles, Coins, Loader2, MessageCircle, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { io } from 'socket.io-client';

interface StudyPlayerProps {
  sessionId: string;
}

export default function StudyPlayer({ sessionId }: StudyPlayerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [socket, setSocket] = useState<any>(null);
  const [balance, setBalance] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const focusLostRef = useRef(0);

  // Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([
    { role: 'model', content: 'Olá! Sou o seu GênioPlay Tutor. Estou aqui para te ajudar a dominar esse assunto e ganhar muitas moedas! O que você gostaria de saber sobre esse tema? 🚀' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;

    const userMsg = { role: 'user', content: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/study/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          topic: sessionData.topic,
          subject: sessionData.subject,
          history: chatHistory.map(h => ({ role: h.role, parts: h.content }))
        })
      });
      const data = await res.json();
      if (data.success) {
        setChatHistory(prev => [...prev, { role: 'model', content: data.text }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    fetchSessionData();
    const s = io();
    setSocket(s);
    return () => s.disconnect();
  }, [sessionId]);

  const fetchSessionData = async () => {
    try {
      const res = await fetch(`/api/study/session-data?id=${sessionId}`);
      const data = await res.json();
      if (data.success) {
        setSessionData(data);
      }
    } catch (err) {
      console.error('Error fetching session data');
    } finally {
      setLoading(false);
    }
  };

  const grantReward = async (amount: number, type: string) => {
    try {
      const res = await fetch('/api/study/reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, type, sessionId })
      });
      const data = await res.json();
      if (data.success) {
        setBalance(data.newBalance);
      }
    } catch (err) {
      console.error('Error granting reward');
    }
  };

  const handleOptionSelect = async (index: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(index);
    const isCorrect = index === sessionData.questions[currentQuestion].correct;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 }
      });
      await grantReward(5, 'QUIZ_BONUS');
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (currentQuestion < sessionData.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setIsQuizMode(false);
        setCurrentQuestion(0);
      }
    }, 2000);
  };

  // Visibility Detection (Anti-Cheat)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive && !isBreak) {
        setIsActive(false);
        setShowWarning(true);
        if (socket && sessionData) {
          socket.emit('student-focus-lost', { 
            studentId: sessionData.studentId, 
            studentName: sessionData.studentName 
          });
        }
        // Gravar evento no DB
        fetch('/api/study/focus-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, type: 'TAB_BLUR' })
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, isBreak, sessionData, socket]);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handlePhaseComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const handlePhaseComplete = async () => {
    setIsActive(false);
    if (!isBreak) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#f97316', '#0d9488']
      });
      await grantReward(20, 'STUDY_REWARD');
      setIsBreak(true);
      setTimeLeft(5 * 60);
    } else {
      setIsBreak(false);
      setTimeLeft(25 * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-slate-500 font-black animate-pulse">CARREGANDO CONTEÚDO DA IA...</p>
    </div>
  );

  if (!sessionData) return <div>Erro ao carregar sessão.</div>;

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-between py-6 gap-8 w-full max-w-5xl mx-auto">
      {/* Warning Overlay */}
      <AnimatePresence>
        {showWarning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 glass-card bg-red-50/95 border-red-200 flex flex-col items-center justify-center p-8 text-center gap-6 rounded-[3rem]"
          >
            <div className="bg-red-500 p-6 rounded-full text-white shadow-2xl shadow-red-500/40">
              <AlertCircle size={64} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-red-600">Ei! Foco total! 🛑</h2>
              <p className="text-red-500 font-bold mt-2">Você saiu da tela de estudo. O cronômetro foi pausado automaticamente.</p>
            </div>
            <button 
              onClick={() => setShowWarning(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-black py-4 px-10 rounded-2xl shadow-lg transition-all active:scale-95"
            >
              Entendi, voltando ao foco!
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
        
        {/* Timer Section */}
        <div className="flex flex-col items-center gap-8">
          <motion.div 
            animate={{ 
              scale: isActive ? [1, 1.01, 1] : 1,
              boxShadow: isActive ? '0 0 50px rgba(37, 99, 235, 0.15)' : 'none'
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className={`relative w-80 h-80 rounded-full premium-card flex flex-col items-center justify-center border-4 ${
              isBreak ? 'border-emerald-500/30 bg-emerald-50/30' : 'border-blue-500/30 bg-blue-50/10'
            }`}
          >
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="160"
                cy="160"
                r="154"
                fill="transparent"
                stroke={isBreak ? '#10b981' : '#2563eb'}
                strokeWidth="8"
                strokeDasharray={967}
                strokeDashoffset={967 - (967 * (timeLeft / (isBreak ? 5 * 60 : 25 * 60)))}
                className="transition-all duration-1000 ease-linear opacity-20"
              />
            </svg>

            <div className="text-center z-10">
              <span className={`badge mb-3 inline-block ${isBreak ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                {isBreak ? '☕ Descanso' : '⚡ Foco'}
              </span>
              <h2 className="text-7xl font-black font-mono tracking-tighter text-slate-800">
                {formatTime(timeLeft)}
              </h2>
            </div>
          </motion.div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsActive(!isActive)}
              className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all shadow-xl active:scale-90 ${
                isActive ? 'bg-slate-800 text-white shadow-slate-900/20' : 'btn-primary w-24 h-24'
              }`}
            >
              {isActive ? <Pause size={36} /> : <Play size={40} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              className="w-16 h-16 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
              onClick={() => { if(confirm('Encerrar sessão?')) router.push('/dashboard') }}
            >
              <Square size={24} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full max-w-lg space-y-6">
          <div className="flex items-center justify-between px-2">
            <div>
               <h3 className="text-2xl font-black text-slate-800">{sessionData.topic}</h3>
               <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{sessionData.subject}</p>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-2xl border border-amber-100 font-black">
               <Coins size={20} />
               {balance > 0 ? balance : 'Saldo...'}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isQuizMode ? (
              <motion.div 
                key="cards"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="premium-card p-10 bg-white border-blue-50 min-h-[300px] flex flex-col justify-between relative shadow-2xl shadow-blue-500/5"
              >
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Flashcard {currentCard + 1}/{sessionData.flashcards.length}</span>
                  <h3 className="text-2xl font-black text-slate-800 leading-tight">{sessionData.flashcards[currentCard].title}</h3>
                  <p className="text-slate-500 font-bold text-lg leading-relaxed">{sessionData.flashcards[currentCard].content}</p>
                </div>
                
                <div className="flex items-center justify-between mt-10">
                  <div className="flex gap-2">
                    {sessionData.flashcards.map((_: any, i: number) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentCard ? 'w-8 bg-blue-600' : 'w-2 bg-slate-100'}`} />
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setCurrentCard((prev) => (prev > 0 ? prev - 1 : sessionData.flashcards.length - 1))}
                      className="p-3 rounded-2xl border-2 border-slate-50 hover:bg-slate-50 text-slate-300 transition-all"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={() => {
                        if (currentCard < sessionData.flashcards.length - 1) {
                          setCurrentCard(prev => prev + 1);
                        } else {
                          setIsQuizMode(true);
                        }
                      }}
                      className="btn-primary py-3 px-6 !text-sm"
                    >
                      {currentCard < sessionData.flashcards.length - 1 ? 'Próximo' : 'Iniciar Quiz 🚀'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="quiz"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="premium-card p-10 bg-slate-900 border-none text-white min-h-[300px] space-y-8"
              >
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Pergunta {currentQuestion + 1}/{sessionData.questions.length}</span>
                   <div className="flex gap-1">
                      {[...Array(sessionData.questions.length)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i < currentQuestion ? 'bg-emerald-500' : i === currentQuestion ? 'bg-blue-500' : 'bg-slate-700'}`} />
                      ))}
                   </div>
                </div>

                <h3 className="text-xl font-black leading-snug">
                  {sessionData.questions[currentQuestion].question}
                </h3>

                <div className="grid gap-3">
                  {sessionData.questions[currentQuestion].options.map((option: string, i: number) => (
                    <button
                      key={i}
                      disabled={selectedOption !== null}
                      onClick={() => handleOptionSelect(i)}
                      className={`w-full p-5 rounded-2xl text-left font-bold transition-all flex items-center justify-between border-2 ${
                        selectedOption === i 
                        ? i === sessionData.questions[currentQuestion].correct 
                          ? 'bg-emerald-500 border-emerald-400 text-white' 
                          : 'bg-rose-500 border-rose-400 text-white'
                        : selectedOption !== null && i === sessionData.questions[currentQuestion].correct
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : 'bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-300'
                      }`}
                    >
                      {option}
                      {selectedOption === i && (
                        i === sessionData.questions[currentQuestion].correct ? <CheckCircle2 size={22} /> : <XCircle size={22} />
                      )}
                    </button>
                  ))}
                </div>

                {selectedOption !== null && (
                  <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className={`text-sm font-bold text-center ${selectedOption === sessionData.questions[currentQuestion].correct ? 'text-emerald-400' : 'text-rose-400'}`}
                  >
                    {selectedOption === sessionData.questions[currentQuestion].correct 
                      ? 'Excelente! +5 Moedas 🪙' 
                      : `Ops! ${sessionData.questions[currentQuestion].explanation}`}
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* AI Tutor Chat Floating Button */}
      <div className="fixed bottom-8 right-8 z-[60]">
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
        >
          {isChatOpen ? <XCircle size={32} /> : <MessageCircle size={32} />}
          {!isChatOpen && (
            <span className="absolute -top-12 right-0 bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-black shadow-xl whitespace-nowrap animate-bounce border border-blue-100">
              Dúvida? Fale comigo! 👋
            </span>
          )}
        </button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-28 right-8 w-[380px] h-[500px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl z-[60] flex flex-col overflow-hidden border border-blue-100 dark:border-slate-800"
          >
            <div className="bg-blue-600 p-6 text-white flex items-center gap-3">
               <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Brain size={24} />
               </div>
               <div>
                  <h4 className="font-black">GênioPlay Tutor</h4>
                  <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">IA Inteligente • Online</p>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
               {chatHistory.map((msg: any, i: number) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-bold ${
                      msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none'
                    }`}>
                       {msg.content}
                    </div>
                 </div>
               ))}
               {isTyping && (
                 <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none">
                       <Loader2 className="animate-spin text-blue-600" size={18} />
                    </div>
                 </div>
               )}
               <div ref={chatEndRef} />
            </div>

            <div className="p-6 border-t dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
               <form 
                 onSubmit={(e) => {
                   e.preventDefault();
                   handleSendMessage();
                 }}
                 className="relative"
               >
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Pergunte qualquer coisa..."
                    className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl pl-6 pr-14 py-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    disabled={!chatInput.trim() || isTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl disabled:opacity-50 transition-all hover:bg-blue-700"
                  >
                    <ChevronRight size={20} />
                  </button>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
