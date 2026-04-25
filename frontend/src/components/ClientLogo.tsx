import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Client } from '../types';

interface Props {
  client: Client;
  onHoverChange: (hovering: boolean) => void;
}

export const ClientLogo = ({ client, onHoverChange }: Props) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);

  const startTyping = () => {
    setTypedText('');
    indexRef.current = 0;
    intervalRef.current = setInterval(() => {
      if (indexRef.current < client.name.length) {
        setTypedText(client.name.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 55);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
    setIsHovered(true);
    onHoverChange(true);
    startTyping();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTypedText('');
    indexRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <>
      <div
        className="flex items-center shrink-0 cursor-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {!imgFailed ? (
          <img
            src={client.logoUrl}
            alt={client.name}
            className={`h-8 w-auto object-contain transition-all duration-500 ${
              isHovered
                ? 'grayscale-0 opacity-100 scale-110 drop-shadow-[0_0_12px_rgba(0,243,255,0.6)]'
                : 'grayscale opacity-40'
            }`}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span
            className={`text-sm font-mono font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
              isHovered
                ? 'text-[#00f3ff] drop-shadow-[0_0_6px_rgba(0,243,255,0.8)]'
                : 'text-[#333]'
            }`}
          >
            {client.name}
          </span>
        )}
      </div>

      {/* Portal: renders directly into document.body to escape the transform stacking context of the marquee */}
      {isHovered &&
        ReactDOM.createPortal(
          <div
            className="fixed z-[9999] pointer-events-none select-none"
            style={{ left: cursorPos.x + 18, top: cursorPos.y + 18 }}
          >
            <div className="relative bg-black border border-[#00f3ff] px-4 py-2 shadow-[0_0_24px_rgba(0,243,255,0.4)]">
              {/* Corner accents */}
              <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00f3ff] -mt-[2px] -ml-[2px]" />
              <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00f3ff] -mt-[2px] -mr-[2px]" />
              <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00f3ff] -mb-[2px] -ml-[2px]" />
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00f3ff] -mb-[2px] -mr-[2px]" />
              {/* Label */}
              <div className="text-[8px] font-mono text-[#00f3ff]/40 uppercase tracking-[0.25em] mb-1">// CLIENT_ID</div>
              {/* Typed line */}
              <div className="flex items-center gap-1 font-mono text-sm">
                <span className="text-[#00ff41]">&gt;_</span>
                <span className="text-white uppercase tracking-widest">{typedText}</span>
                <span className="w-[7px] h-[14px] bg-[#00f3ff] animate-pulse inline-block" />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
