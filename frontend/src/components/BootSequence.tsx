import { motion } from 'framer-motion';

interface BootLine {
  text: string;
  status: 'ok' | 'warn' | 'load' | 'info';
}

interface Props {
  visibleLines: BootLine[];
  progress: number;
  onSkip: () => void;
}

const statusColors: Record<string, string> = {
  ok: '#00ff41',
  warn: '#fcee0a',
  load: '#00f3ff',
  info: '#00f3ff',
};

export const BootSequence = ({ visibleLines, progress, onSkip }: Props) => {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex flex-col justify-center items-center overflow-hidden"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,243,255,0.03) 2px, rgba(0,243,255,0.03) 4px)',
        }}
      />

      <div className="w-full max-w-2xl px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#ff003c] animate-pulse" />
            <span className="font-mono text-[#ff003c] text-xs uppercase tracking-[0.3em]">SYSTEM_OS // BOOT</span>
          </div>
          <button
            onClick={onSkip}
            className="font-mono text-[10px] text-[#333] hover:text-[#00f3ff] uppercase tracking-widest transition-colors cursor-pointer"
          >
            [SKIP → ENTER]
          </button>
        </div>

        {/* Terminal output */}
        <div className="font-mono text-sm space-y-1 mb-8 min-h-[320px]">
          {visibleLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-3"
            >
              {line.status !== 'info' && (
                <span className="text-[10px] uppercase tracking-wider"
                  style={{ color: statusColors[line.status] }}>
                  [{line.status === 'ok' ? ' OK ' : line.status === 'warn' ? 'WARN' : 'LOAD'}]
                </span>
              )}
              {line.status === 'info' && (
                <span className="text-[10px] text-[#00f3ff] tracking-wider">[SYS]</span>
              )}
              <span className="text-gray-400">{line.text}</span>
            </motion.div>
          ))}

          {/* Blinking cursor */}
          {visibleLines.length > 0 && visibleLines.length < 15 && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[#00ff41]">$</span>
              <span className="w-2 h-4 bg-[#00ff41] animate-pulse" />
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="relative h-1 bg-[#111] w-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-[#00f3ff] shadow-[0_0_12px_rgba(0,243,255,0.6)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-2 font-mono text-[10px] text-[#333] uppercase tracking-widest">
          <span>BOOT PROGRESS</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </motion.div>
  );
};
