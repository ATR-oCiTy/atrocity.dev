import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Full-screen system meltdown effect.
 * Triggered by `sudo rm -rf /` in the terminal.
 * Shakes screen, inverts colors, shows glitch, then displays "NICE TRY."
 */
export const MeltdownOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<'glitch' | 'message'>('glitch');

  useEffect(() => {
    const messageTimer = setTimeout(() => setPhase('message'), 2000);
    const completeTimer = setTimeout(onComplete, 4000);
    return () => { clearTimeout(messageTimer); clearTimeout(completeTimer); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {phase === 'glitch' && (
        <>
          {/* Screen shake */}
          <motion.div
            className="absolute inset-0 bg-[#ff003c]/20"
            animate={{
              x: [0, -5, 5, -3, 3, -1, 1, 0],
              y: [0, 3, -3, 2, -2, 1, -1, 0],
            }}
            transition={{ duration: 0.3, repeat: 6 }}
          />
          {/* Scanline interference */}
          <div className="absolute inset-0 mix-blend-overlay" style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,60,0.15) 2px, rgba(255,0,60,0.15) 4px)',
            animation: 'glitch 100ms infinite',
          }} />
          {/* Color inversion flash */}
          <motion.div
            className="absolute inset-0"
            animate={{ backgroundColor: ['rgba(255,0,60,0)', 'rgba(255,0,60,0.4)', 'rgba(255,0,60,0)', 'rgba(0,0,0,0.8)'] }}
            transition={{ duration: 2, times: [0, 0.3, 0.6, 1] }}
          />
          {/* Fake error text fragments */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute font-mono text-[#ff003c] text-xs uppercase whitespace-nowrap opacity-60"
                style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 80}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: Math.random() * 1.5, duration: 0.3 }}
              >
                {['SEGFAULT', 'KERNEL PANIC', 'CRITICAL ERROR', 'BUFFER OVERFLOW', 'STACK SMASHED', 'CORRUPTION DETECTED'][Math.floor(Math.random() * 6)]}
              </motion.div>
            ))}
          </div>
        </>
      )}

      {phase === 'message' && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-center"
          >
            <div className="text-6xl md:text-8xl font-black text-[#ff003c] uppercase drop-shadow-[0_0_30px_rgba(255,0,60,0.8)]">
              NICE TRY.
            </div>
            <div className="text-[#444] font-mono text-sm mt-4 uppercase tracking-widest">
              System recovered. Incident logged.
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
