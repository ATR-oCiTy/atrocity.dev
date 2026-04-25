import { useState, useCallback, useEffect } from 'react';

export interface SectionDef {
  id: string;
  command: string;
  label: string;
  color: string;
}

export const SECTIONS: SectionDef[] = [
  { id: 'hero',       command: 'home',       label: 'SYSTEM_INIT',   color: '#00f3ff' },
  { id: 'skills',     command: 'skills',     label: 'TECH_ARSENAL',  color: '#fcee0a' },
  { id: 'experience', command: 'experience', label: 'SYS_LOGS',      color: '#00f3ff' },
  { id: 'education',  command: 'education',  label: 'TRAINING_DATA', color: '#00ff41' },
  { id: 'contact',    command: 'contact',    label: 'OPEN_CHANNEL',  color: '#ff003c' },
];

interface UseCardStackReturn {
  activeIndex: number;
  direction: 'up' | 'down';
  navigateTo: (index: number) => void;
  navigateByCommand: (cmd: string) => boolean;
}

/**
 * Simple tab navigation state — no scroll hijacking.
 * Drives the centered panel's active tab.
 */
export const useCardStack = (): UseCardStackReturn => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('down');

  const navigateTo = useCallback((index: number) => {
    // Allow up to index 5 (hidden breach tab beyond SECTIONS)
    if (index < 0 || index > SECTIONS.length || index === activeIndex) return;
    setDirection(index > activeIndex ? 'down' : 'up');
    setActiveIndex(index);
  }, [activeIndex]);

  const navigateByCommand = useCallback((cmd: string): boolean => {
    const normalized = cmd.trim().toLowerCase().replace(/^(cd |goto |cat |ls |open )/, '').replace(/^\//, '');
    const idx = SECTIONS.findIndex(s =>
      s.command === normalized || s.id === normalized || s.label.toLowerCase() === normalized
    );
    if (idx !== -1) {
      navigateTo(idx);
      return true;
    }
    return false;
  }, [navigateTo]);

  // Keyboard shortcuts (only when not typing in inputs)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      // Ctrl/Cmd + number to jump to tab
      if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        navigateTo(parseInt(e.key) - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateTo]);

  return { activeIndex, direction, navigateTo, navigateByCommand };
};
