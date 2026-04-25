import { useState, useEffect, useRef, useCallback } from 'react';

interface BootLine {
  text: string;
  status: 'ok' | 'warn' | 'load' | 'info';
  delay: number;
}

const BOOT_LINES: BootLine[] = [
  { text: 'Initializing SYSTEM_OS v4.2.1...', status: 'info', delay: 0 },
  { text: 'Checking hardware integrity ............', status: 'ok', delay: 300 },
  { text: 'Loading kernel modules', status: 'ok', delay: 500 },
  { text: 'Mounting /dev/profile .................', status: 'ok', delay: 700 },
  { text: 'Loading skills.module ── 22 packages found', status: 'ok', delay: 900 },
  { text: 'Loading experience.json ── 3 records loaded', status: 'ok', delay: 1100 },
  { text: 'Loading education.dat ── 2 records loaded', status: 'ok', delay: 1300 },
  { text: 'Loading clients.registry ── 6 nodes connected', status: 'ok', delay: 1500 },
  { text: 'Establishing secure channel ──────────', status: 'ok', delay: 1700 },
  { text: 'Running security audit ── OWASP:PASS', status: 'ok', delay: 1900 },
  { text: '11 easter_eggs loaded ── 0 discovered. Try harder.', status: 'warn', delay: 2050 },
  { text: 'Hint: curious minds check /robots.txt first', status: 'warn', delay: 2150 },
  { text: 'Compiling UI shader pipeline', status: 'ok', delay: 2300 },
  { text: 'GPU acceleration: ENABLED', status: 'ok', delay: 2400 },
  { text: 'SYSTEM READY.', status: 'info', delay: 2700 },
];

interface UseBootSequenceReturn {
  isBooting: boolean;
  visibleLines: BootLine[];
  progress: number;
  skip: () => void;
}

export const useBootSequence = (): UseBootSequenceReturn => {
  const [isBooting, setIsBooting] = useState(true);
  const [visibleLines, setVisibleLines] = useState<BootLine[]>([]);
  const [progress, setProgress] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const skip = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    setIsBooting(false);
  }, []);

  useEffect(() => {
    // Skip boot on subsequent mounts (dev HMR)
    const hasBooted = sessionStorage.getItem('sys_booted');
    if (hasBooted) {
      setIsBooting(false);
      return;
    }

    BOOT_LINES.forEach((line, i) => {
      const timer = setTimeout(() => {
        setVisibleLines(prev => [...prev, line]);
        setProgress(((i + 1) / BOOT_LINES.length) * 100);
      }, line.delay);
      timersRef.current.push(timer);
    });

    // Auto-complete after last line + a small pause
    const finishTimer = setTimeout(() => {
      sessionStorage.setItem('sys_booted', 'true');
      setIsBooting(false);
    }, 3500);
    timersRef.current.push(finishTimer);

    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  return { isBooting, visibleLines, progress, skip };
};
