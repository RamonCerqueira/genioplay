'use client';

import { useEffect, useCallback } from 'react';

export function useFocusTracker(sessionId: string, lessonId: string) {
  const logEvent = useCallback(async (type: string, metadata?: any) => {
    try {
      await fetch('/api/study/focus-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          lessonId,
          type,
          metadata,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.error('Erro ao logar evento de foco:', err);
    }
  }, [sessionId, lessonId]);

  useEffect(() => {
    if (!sessionId) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logEvent('TAB_BLUR', { reason: 'Usuário mudou de aba ou minimizou' });
      } else {
        logEvent('TAB_FOCUS', { reason: 'Usuário voltou para a aba' });
      }
    };

    const handleBlur = () => logEvent('WINDOW_BLUR', { reason: 'Janela perdeu o foco' });
    const handleFocus = () => logEvent('WINDOW_FOCUS', { reason: 'Janela recuperou o foco' });

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [sessionId, logEvent]);
}
