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
        if (data.metadata?.trilha?.modo === 'tabuleiro') setBoardView(true);
        
        // Saudação inicial do Tutor baseada no tema
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
    const questions = currentPhase ? currentPhase.teste : sessionData.questions;
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
        setIsQuizMode(false);
        setCurrentQuestion(0);
        if (currentPhase) {
          setCurrentPhase(null);
          setBoardView(true);
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        } else {
          // Se for o quiz final, podemos mostrar um modal de conclusão com a análise da IA
          alert(`Incrível! Você completou a lição.\n\nNível: ${sessionData.metadata?.analise?.nivel || 'Estudante'}\nFeedback: ${sessionData.metadata?.analise?.feedback || 'Continue assim!'}`);
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
