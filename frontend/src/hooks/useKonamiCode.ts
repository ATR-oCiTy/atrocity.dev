import { useState, useEffect, useRef } from 'react';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

/**
 * Listens for the Konami code sequence.
 * Returns `triggered` true for a duration then resets.
 */
export const useKonamiCode = (): { triggered: boolean } => {
  const [triggered, setTriggered] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === KONAMI[indexRef.current]) {
        indexRef.current++;
        if (indexRef.current === KONAMI.length) {
          indexRef.current = 0;
          setTriggered(true);
          // Auto-reset after animation completes
          setTimeout(() => setTriggered(false), 8000);
        }
      } else {
        indexRef.current = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { triggered };
};
