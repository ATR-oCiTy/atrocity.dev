import { motion } from 'framer-motion';
import { SectionDef } from '../hooks/useCardStack';

interface Props {
  sections: SectionDef[];
  activeIndex: number;
  onNavigate: (index: number) => void;
}

export const HudOverlay = ({ sections, activeIndex, onNavigate }: Props) => {
  const active = sections[activeIndex];

  return (
    <>
      {/* Top-right HUD — Section info */}
      <div className="fixed top-20 right-6 z-[150] font-mono text-right pointer-events-none hidden md:block">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-[10px] text-[#333] uppercase tracking-[0.3em] mb-1">// ACTIVE_MODULE</div>
          <div className="text-lg font-bold uppercase tracking-widest" style={{ color: active.color }}>
            {active.label}
          </div>
          <div className="text-[10px] text-[#333] uppercase tracking-wider mt-1">
            SEC_{activeIndex + 1} / {sections.length}
          </div>
        </motion.div>
      </div>

      {/* Right-side vertical nav dots (minimap) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[150] hidden md:flex flex-col items-center gap-3">
        {sections.map((section, i) => (
          <button
            key={section.id}
            onClick={() => onNavigate(i)}
            className="group relative flex items-center justify-center cursor-pointer"
            title={section.label}
          >
            {/* Active indicator ring */}
            {i === activeIndex && (
              <motion.div
                layoutId="hud-ring"
                className="absolute w-5 h-5 border"
                style={{ borderColor: active.color, boxShadow: `0 0 8px ${active.color}40` }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {/* Dot */}
            <div
              className={`w-2 h-2 transition-all duration-300 ${
                i === activeIndex ? 'scale-100' : 'scale-75 opacity-30 group-hover:opacity-70'
              }`}
              style={{ backgroundColor: i === activeIndex ? active.color : '#444' }}
            />
            {/* Label on hover */}
            <span
              className="absolute right-8 text-[10px] uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ color: section.color }}
            >
              {section.label}
            </span>
          </button>
        ))}

        {/* Connecting line */}
        <div className="absolute top-0 bottom-0 w-[1px] bg-[#111] -z-10" />
      </div>

      {/* Bottom-left system stats */}
      <div className="fixed bottom-14 left-6 z-[150] font-mono text-[10px] text-[#222] uppercase tracking-widest pointer-events-none hidden md:block">
        <div className="space-y-1">
          <div>FPS: <span className="text-[#333]">60</span></div>
          <div>RENDER: <span className="text-[#333]">GPU_ACCEL</span></div>
          <div>SCROLL: <span style={{ color: active.color }}>DISABLED</span></div>
          <div>NAV: <span className="text-[#00ff41]">CARD_STACK</span></div>
        </div>
      </div>
    </>
  );
};
