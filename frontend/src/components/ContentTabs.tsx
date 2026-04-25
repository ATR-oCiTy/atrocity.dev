import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  accentColor: string;
  children: (activeTabId: string) => React.ReactNode;
}

/**
 * Chrome-style nested sub-tabs for paginating content within a section.
 * Used inside sections that would otherwise overflow the viewport.
 */
export const ContentTabs = ({ tabs, accentColor, children }: Props) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? '');

  return (
    <div>
      {/* Sub-tab bar */}
      <div className="flex items-center gap-0 mb-6 border-b border-[#1a1a1a]">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer border-b-2
                ${isActive
                  ? 'text-white border-current'
                  : 'text-[#444] border-transparent hover:text-[#888]'
                }`}
              style={{ color: isActive ? accentColor : undefined, borderColor: isActive ? accentColor : 'transparent' }}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="content-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}60` }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}

        {/* Tab counter */}
        <span className="ml-auto text-[10px] font-mono text-[#333] uppercase tracking-wider px-3">
          {tabs.findIndex(t => t.id === activeTab) + 1}/{tabs.length}
        </span>
      </div>

      {/* Tab content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {children(activeTab)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
