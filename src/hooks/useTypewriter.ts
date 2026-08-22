import { useCallback, useEffect, useRef, useState } from 'react';

export const useTypewriter = (text: string, active: boolean, speedMs = 16) => {
  const [visible, setVisible] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setVisible(text);
      return undefined;
    }
    setVisible('');
    indexRef.current = 0;
    const timer = window.setInterval(() => {
      indexRef.current += 1;
      setVisible(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) window.clearInterval(timer);
    }, speedMs);
    return () => window.clearInterval(timer);
  }, [text, active, speedMs]);

  return visible;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  typing?: boolean;
};
