'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes Modulares
import { StudyHeader } from './StudyHeader';
import { CardView } from './CardView';
import { QuizView } from './QuizView';
import { BoardPlayer } from './BoardPlayer';
import { TutorFAB } from './TutorFAB';

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
  const [currentCard, setCurrentCard] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [socket, setSocket] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<any>(null);
  const [boardView, setBoardView] = useState(false);
  const [isBonusMode, setIsBonusMode] = useState(false);
  const [showBonusPrompt, setShowBonusPrompt] = useState(false);

  // Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    fetchSessionData();
    const s = io();
    setSocket(s);
    return () => { s.disconnect(); };
  }, [sessionId]);

  const fetchSessionData = async () => {
    try {
      const res = await fetch(`/api/study/session-data?id=${sessionId}`);
      const data = await res.json();
      if (data.success) {
        setSessionData(data);
        if (data.metadata?.trilha?.modo === 'tabuleiro') {
          setBoardView(true);
        }
        
        // Ativa o timer automaticamente ao carregar
        setIsActive(true);
        
        setChatHistory([
          { role: 'model', content: `Olá! Prepare-se para dominar o tema "${data.topic}"! 🚀 Estou aqui para tirar qualquer dúvida e te ajudar a ganhar muitas LarCoins. Vamos começar?` }
        ]);
      }
    } catch (err) {
      console.error('Error fetching session data');
    } finally {
      setLoading(false);
    }
  };

  // Lógica do Cronômetro
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);
      alert("Tempo de foco encerrado! Que tal uma pausa?");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

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
      if (data.success) setChatHistory(prev => [...prev, { role: 'model', content: data.text }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleOptionSelect = async (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    const questions = isBonusMode 
      ? sessionData.bonusQuestions 
      : currentPhase 
        ? currentPhase.teste 
        : sessionData.questions;
        
    const isCorrect = index === (currentPhase ? questions[currentQuestion].resposta_correta : questions[currentQuestion].correct);
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      grantReward(5, 'QUIZ_BONUS');
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setSelectedOption(null);
        setCurrentQuestion(0);

        if (currentPhase) {
          setIsQuizMode(false);
          setCurrentPhase(null);
          setBoardView(true);
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        } else if (!isBonusMode && (sessionData.bonusQuestions?.length > 0)) {
          setShowBonusPrompt(true);
          setIsQuizMode(false); // Pausa o quiz para mostrar o prompt
        } else {
          // Conclusão da lição (Main ou Bonus finalizados)
          const finalScore = Math.round((quizScore / (sessionData.questions.length + (isBonusMode ? sessionData.bonusQuestions.length : 0))) * 100);
          const totalCoins = quizScore * 5;

          await fetch('/api/study/complete-lesson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              lessonId: sessionData.id, 
              score: finalScore, 
              coinsEarned: totalCoins 
            })
          });

          alert(`Incrível! Você completou a lição.\n\nSua nota final: ${finalScore}\nLarCoins Ganhos: ${totalCoins}`);
          router.push('/dashboard/student');
        }
      }
    }, 2000);
  };

  const grantReward = async (amount: number, type: string) => {
    try {
      const res = await fetch('/api/study/reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, type, sessionId })
      });
      const data = await res.json();
      if (data.success) setBalance(data.newBalance);
    } catch (err) {}
  };

  if (loading || !sessionData) return <div className="flex h-screen items-center justify-center text-blue-600 font-black">CARREGANDO LIÇÃO ÉPICA...</div>;

  return (
    <div className="space-y-8 pb-32 max-w-5xl mx-auto px-4">
      <StudyHeader 
        timeLeft={timeLeft}
        isActive={isActive}
        balance={balance}
        boardView={boardView}
        hasTrilha={!!sessionData.metadata?.trilha}
        topic={sessionData.topic}
        subject={sessionData.subject}
        onToggleView={() => setBoardView(!boardView)}
        onExit={() => { if(confirm('Encerrar sessão?')) router.push('/dashboard') }}
      />

      <AnimatePresence mode="wait">
        {showBonusPrompt && (
          <motion.div
            key="bonus-prompt"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="premium-card p-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center space-y-8 shadow-[0_20px_50px_rgba(37,99,235,0.4)]"
          >
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto text-4xl">🔥</div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black uppercase tracking-tight">Desafio Bônus!</h3>
              <p className="text-blue-100 font-bold text-lg">
                Você dominou o conteúdo básico! Quer enfrentar 2 questões bônus de nível Gênio para ganhar LarCoins extras?
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setShowBonusPrompt(false);
                  setIsBonusMode(true);
                  setIsQuizMode(true);
                  setCurrentQuestion(0);
                }}
                className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl"
              >
                SIM, EU SOU UM GÊNIO! 🚀
              </button>
              <button
                onClick={() => {
                  // Finaliza sem bônus
                  const finalScore = Math.round((quizScore / sessionData.questions.length) * 100);
                  const totalCoins = quizScore * 5;
                  fetch('/api/study/complete-lesson', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lessonId: sessionData.id, score: finalScore, coinsEarned: totalCoins })
                  });
                  alert(`Parabéns! Você concluiu a lição com ${finalScore}% de acertos.`);
                  router.push('/dashboard/student');
                }}
                className="bg-blue-800/50 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-blue-800 transition-all"
              >
                NÃO, QUERO MEU PRÊMIO AGORA 🏆
              </button>
            </div>
          </motion.div>
        )}

        {boardView && sessionData.metadata?.trilha ? (
          <BoardPlayer 
            trilha={sessionData.metadata.trilha} 
            onStartPhase={(phase) => {
              setCurrentPhase(phase);
              setIsQuizMode(true);
              setCurrentQuestion(0);
              setBoardView(false);
            }}
          />
        ) : isQuizMode ? (
          <QuizView 
            currentQuestion={currentQuestion}
            totalQuestions={currentPhase ? currentPhase.teste.length : sessionData.questions.length}
            question={currentPhase ? currentPhase.teste[currentQuestion].pergunta : sessionData.questions[currentQuestion].question}
            options={currentPhase ? currentPhase.teste[currentQuestion].alternativas : sessionData.questions[currentQuestion].options}
            correctIndex={currentPhase ? currentPhase.teste[currentQuestion].resposta_correta : sessionData.questions[currentQuestion].correct}
            selectedOption={selectedOption}
            onOptionSelect={handleOptionSelect}
          />
        ) : (
          <CardView 
            currentCard={currentCard}
            totalCards={sessionData.flashcards.length}
            title={sessionData.flashcards[currentCard].title}
            content={sessionData.flashcards[currentCard].content}
            onNext={() => setCurrentCard(prev => Math.min(sessionData.flashcards.length - 1, prev + 1))}
            onPrev={() => setCurrentCard(prev => Math.max(0, prev - 1))}
            onFinish={() => setIsQuizMode(true)}
          />
        )}
      </AnimatePresence>

      <TutorFAB 
        isChatOpen={isChatOpen}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        chatInput={chatInput}
        setChatInput={setChatInput}
        chatHistory={chatHistory}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
