import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ChevronRight, Briefcase, GraduationCap, Phone, MapPin, Code2, Terminal, X, Minus, Maximize2, Shield } from 'lucide-react';
import { useMousePosition } from './hooks/useMousePosition';
import { usePortfolioData } from './hooks/usePortfolioData';
import { useContactForm } from './hooks/useContactForm';
import { useBootSequence } from './hooks/useBootSequence';
import { useCardStack, SECTIONS } from './hooks/useCardStack';
import { useKonamiCode } from './hooks/useKonamiCode';
import { fadeInUp, staggerContainer, staggerItem, cardVariants } from './animations/variants';
import { ClientLogo } from './components/ClientLogo';
import { BootSequence } from './components/BootSequence';
import { TerminalNav } from './components/TerminalNav';
import { HudOverlay } from './components/HudOverlay';
import { ContentTabs } from './components/ContentTabs';
import { MatrixRain } from './components/MatrixRain';
import { MeltdownOverlay } from './components/MeltdownOverlay';

function App() {
  const { profile, experiences, education, skills, clients, loading } = usePortfolioData();
  const mousePosition = useMousePosition();
  const { formData, status, handleChange, handleSubmit } = useContactForm();
  const { isBooting, visibleLines, progress, skip } = useBootSequence();
  const { activeIndex, direction, navigateTo, navigateByCommand } = useCardStack();
  const { triggered: konamiTriggered } = useKonamiCode();
  const [clientMarqueePaused, setClientMarqueePaused] = useState(false);
  const [showMeltdown, setShowMeltdown] = useState(false);
  const [redTeamMode, setRedTeamMode] = useState(false);
  const [breachUnlocked, setBreachUnlocked] = useState(false);
  const logoClickCountRef = React.useRef(0);

  const handleLogoClick = useCallback(() => {
    logoClickCountRef.current++;
    if (logoClickCountRef.current >= 3) {
      setRedTeamMode(r => !r);
      logoClickCountRef.current = 0;
    } else {
      setTimeout(() => { logoClickCountRef.current = 0; }, 600);
    }
  }, []);

  const handleBreach = useCallback(() => {
    setBreachUnlocked(true);
    // Navigate to the breach tab (index 5) after a short delay
    setTimeout(() => navigateTo(5), 500);
  }, [navigateTo]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-black text-[#00ff41] flex items-center justify-center font-mono">
        <div className="animate-pulse flex flex-col items-center">
          <Terminal className="w-12 h-12 mb-4" />
          <p className="tracking-widest">LOADING DATA STREAMS...</p>
        </div>
      </div>
    );
  }

  const active = (activeIndex === 5 && breachUnlocked)
    ? { id: 'breach', command: 'breach', label: 'CLASSIFIED', color: '#ff003c' }
    : SECTIONS[activeIndex] || SECTIONS[0];

  return (
    <div className="h-screen bg-[#050505] text-gray-100 font-sans selection:bg-[#00f3ff] selection:text-black overflow-hidden relative">

      {/* Easter Egg Overlays */}
      <AnimatePresence>
        {konamiTriggered && <MatrixRain onComplete={() => {}} />}
        {showMeltdown && <MeltdownOverlay onComplete={() => setShowMeltdown(false)} />}
      </AnimatePresence>

      {/* Boot Sequence */}
      <AnimatePresence>
        {isBooting && <BootSequence visibleLines={visibleLines} progress={progress} onSkip={skip} />}
      </AnimatePresence>

      {/* Cyber Grid Background */}
      <div className="fixed inset-[-50%] w-[200%] h-[200%] bg-cyber-grid pointer-events-none z-0 opacity-50" />

      {/* Mouse Flashlight */}
      <motion.div
        className="fixed top-0 left-0 w-[500px] h-[500px] bg-[#00f3ff]/10 rounded-full pointer-events-none blur-[100px] z-0 hidden md:block"
        animate={{ x: mousePosition.x - 250, y: mousePosition.y - 250 }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
      />

      {/* ═══════════════════════════════════════════════
          BROWSER WINDOW — centered panel with Chrome tabs
          ═══════════════════════════════════════════════ */}
      <div className="relative z-10 flex items-center justify-center h-full p-4 md:p-8 pb-16">
        <div className="w-full max-w-6xl h-full flex flex-col">

          {/* ── Tab Bar (Chrome-style) ──────────────────── */}
          <div className="flex items-end pl-2 relative w-full overflow-hidden">
            {/* Scrollable Tabs Container */}
            <div className="flex items-end flex-1 overflow-x-auto no-scrollbar mask-fade-right">
              {SECTIONS.map((section, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={section.id}
                    onClick={() => navigateTo(i)}
                    className={`relative group flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-all duration-200 cursor-pointer border-t border-l border-r whitespace-nowrap shrink-0
                      ${isActive
                        ? 'bg-[#0a0a0a] text-white border-[#222] z-20 -mb-[1px] rounded-t-lg'
                        : 'bg-[#111] text-[#444] border-transparent hover:text-[#888] hover:bg-[#0d0d0d] rounded-t-md -mb-[1px]'
                      }`}
                  >
                    {/* Tab color indicator dot */}
                    <span
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? 'shadow-[0_0_6px]' : 'opacity-40'}`}
                      style={{ backgroundColor: section.color, boxShadow: isActive ? `0 0 8px ${section.color}` : 'none' }}
                    />
                    <span className="hidden sm:inline">{section.label}</span>
                    <span className="sm:hidden">{section.command.slice(0, 3).toUpperCase()}</span>
                  </button>
                );
              })}

              {/* Breach tab — only visible after unlocking */}
              {breachUnlocked && (
                <button
                  onClick={() => navigateTo(5)}
                  className={`relative group flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-all duration-200 cursor-pointer border-t border-l border-r whitespace-nowrap shrink-0
                    ${activeIndex === 5
                      ? 'bg-[#0a0a0a] text-white border-[#ff003c]/50 z-20 -mb-[1px] rounded-t-lg'
                      : 'bg-[#111] text-[#ff003c]/60 border-transparent hover:text-[#ff003c] hover:bg-[#0d0d0d] rounded-t-md -mb-[1px] animate-pulse'
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full bg-[#ff003c] transition-all duration-300 ${activeIndex === 5 ? 'shadow-[0_0_8px_#ff003c]' : 'opacity-60'}`} />
                  <span className="hidden sm:inline">CLASSIFIED</span>
                  <span className="sm:hidden">CLS</span>
                </button>
              )}
            </div>

            {/* Right side: Logo and Window Controls */}
            <div className="flex items-center shrink-0">
              {/* Logo with red team toggle */}
              <div
              onClick={handleLogoClick}
              className={`font-mono text-sm font-bold uppercase tracking-widest cursor-pointer select-none transition-colors duration-300 pl-3 pb-2 ${
                redTeamMode
                  ? 'text-[#ff003c] drop-shadow-[0_0_6px_rgba(255,0,60,0.6)]'
                  : 'text-[#00f3ff] drop-shadow-[0_0_6px_rgba(0,243,255,0.6)]'
              }`}
            >
              {redTeamMode ? 'RED' : 'SYS'}<span className="text-white">{redTeamMode ? '.TEAM' : '.ADMIN'}</span>
              {redTeamMode && <span className="ml-2 text-[8px] text-[#ff003c] border border-[#ff003c] px-1 py-0.5 align-middle">RED_TEAM</span>}
            </div>

            {/* Right-side window controls (decorative) */}
            <div className="ml-auto flex items-center gap-3 px-4 pb-2">
              <Minus className="w-3 h-3 text-[#333] hover:text-[#fcee0a] transition-colors cursor-pointer" />
              <Maximize2 className="w-3 h-3 text-[#333] hover:text-[#00ff41] transition-colors cursor-pointer" />
              <X className="w-3 h-3 text-[#333] hover:text-[#ff003c] transition-colors cursor-pointer" />
            </div>
          </div>
        </div>

          {/* ── Window Chrome (address bar) ────────────── */}
          <div className="bg-[#0a0a0a] border border-[#222] border-b-0 px-4 py-2 flex items-center gap-3">
            <div className="flex-1 bg-[#111] border border-[#1a1a1a] rounded-md px-3 py-1.5 flex items-center gap-2 group relative">
              <span className="text-[10px] font-mono text-[#00ff41]">▸</span>
              <span className="text-[11px] font-mono text-[#555]">
                sys://ashley.portfolio<span style={{ color: active.color }}>/{active.command}</span>
              </span>
              {/* Hidden hint — only appears on hover */}
              <span className="absolute right-3 text-[9px] font-mono text-[#111] group-hover:text-[#333] transition-colors duration-500 uppercase tracking-wider">
                // try the terminal below
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-[#333]">
              <span className="px-2 py-0.5 border border-[#1a1a1a] rounded">⌘{activeIndex + 1}</span>
            </div>
          </div>

          {/* ── Content Area ───────────────────────────── */}
          <div className="flex-1 bg-[#0a0a0a] border border-[#222] border-t-0 rounded-b-lg overflow-hidden relative">
            {/* Subtle top border glow matching active tab color */}
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${active.color}30, transparent)` }} />

            <div className="h-full overflow-y-auto card-scroll">
              <AnimatePresence mode="wait" custom={direction}>

                {/* ── TAB: HOME ─────────────────────────── */}
                {activeIndex === 0 && (
                  <motion.div key="hero" custom={direction} variants={cardVariants} initial="enter" animate="active" exit="exit">
                    <section className="px-6 md:px-12 py-16 flex flex-col items-center text-center">
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-black border border-[#00ff41] text-xs font-mono text-[#00ff41] mb-8 uppercase tracking-widest shadow-[0_0_10px_rgba(0,255,65,0.2)]">
                        <Terminal className="w-4 h-4" />
                        <span className="animate-pulse">{profile.tagline}</span>
                      </motion.div>

                      <motion.h1 initial="hidden" animate="visible" variants={fadeInUp}
                        className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase glitch-wrapper">
                        <span className="glitch text-white">{profile.name}</span>
                      </motion.h1>

                      <motion.p initial="hidden" animate="visible" variants={fadeInUp}
                        className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 font-mono leading-relaxed border-l-4 border-[#00f3ff] pl-6 text-left">
                        {profile.bioLines.map((line, i) => (
                          <React.Fragment key={i}>{line}<br /></React.Fragment>
                        ))}
                      </motion.p>

                      <motion.div initial="hidden" animate="visible" variants={fadeInUp}
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => navigateTo(2)}
                          className="px-6 py-3 bg-[#00f3ff] text-black border-2 border-[#00f3ff] hover:bg-transparent hover:text-[#00f3ff] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.4)] cursor-pointer">
                          EXECUTE_EXP <ChevronRight className="w-5 h-5" />
                        </motion.button>
                        <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          href={profile.linkedinUrl} target="_blank" rel="noreferrer"
                          className="px-6 py-3 bg-transparent border-2 border-[#ff003c] text-[#ff003c] hover:bg-[#ff003c] hover:text-black font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,0,60,0.2)]">
                          LINK_IN
                        </motion.a>
                      </motion.div>
                    </section>

                    {/* Marquees */}
                    <section className="py-6 border-y-2 border-[#00ff41]/30 bg-black overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />
                      <div className="flex gap-16 items-center w-max animate-marquee font-mono uppercase text-[#00ff41]">
                        {[...Array(2)].map((_, i) => (
                          <React.Fragment key={i}>
                            {skills.flatMap(c => c.skills).map((skill, sIdx) => (
                              <div key={`${i}-${sIdx}`} className="text-lg font-bold hover:text-white hover:drop-shadow-[0_0_10px_rgba(0,255,65,1)] transition-all duration-300 cursor-default">{skill}</div>
                            ))}
                          </React.Fragment>
                        ))}
                      </div>
                    </section>
                    {clients.length > 0 && (
                      <section className="py-5 border-b-2 border-[#00f3ff]/20 bg-[#0a0a0a] overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a] z-10 pointer-events-none" />
                        <p className="text-center text-[10px] font-mono text-[#00f3ff]/40 uppercase tracking-[0.3em] mb-3">// Clients I've Worked With</p>
                        <div className="flex gap-36 items-center w-max"
                          style={{ animation: 'marquee 30s linear infinite', animationPlayState: clientMarqueePaused ? 'paused' : 'running' }}>
                          {[...Array(3)].map((_, i) => (
                            <React.Fragment key={i}>
                              {clients.map((client, cIdx) => (
                                <ClientLogo key={`${i}-${cIdx}`} client={client} onHoverChange={(h) => setClientMarqueePaused(h)} />
                              ))}
                            </React.Fragment>
                          ))}
                        </div>
                      </section>
                    )}
                  </motion.div>
                )}

                {/* ── TAB: SKILLS ───────────────────────── */}
                {activeIndex === 1 && (
                  <motion.div key="skills" custom={direction} variants={cardVariants} initial="enter" animate="active" exit="exit"
                    className="px-6 md:px-12 py-12">
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-8 flex items-center gap-4">
                      <div className="p-3 bg-[#fcee0a]/10 border-2 border-[#fcee0a] shadow-[0_0_15px_rgba(252,238,10,0.3)]">
                        <Code2 className="w-7 h-7 text-[#fcee0a]" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight">Tech_Arsenal</h2>
                    </motion.div>

                    <ContentTabs
                      tabs={skills.map((cat, i) => ({ id: cat._id || String(i), label: cat.title }))}
                      accentColor="#fcee0a"
                    >
                      {(activeTabId) => {
                        const category = skills.find((c, i) => (c._id || String(i)) === activeTabId);
                        if (!category) return null;
                        return (
                          <motion.div initial="hidden" animate="visible" variants={staggerContainer}
                            className="bg-[#050505] border-l-4 border-t border-b border-r border-[#111] border-l-[#fcee0a] p-6 hover:border-[#fcee0a] transition-colors shadow-2xl relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-[#fcee0a]/5 transform rotate-45 translate-x-8 -translate-y-8 group-hover:bg-[#fcee0a]/20 transition-colors" />
                            <div className="flex flex-wrap gap-2">
                              {category.skills.map((skill, sIdx) => (
                                <motion.span key={sIdx} variants={staggerItem} whileHover={{ scale: 1.05 }}
                                  className="px-3 py-1.5 bg-black border border-[#222] font-mono text-xs uppercase text-[#fcee0a] hover:border-[#fcee0a] hover:bg-[#fcee0a] hover:text-black hover:shadow-[0_0_10px_rgba(252,238,10,0.8)] transition-all duration-200 cursor-default">
                                  {skill}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>
                        );
                      }}
                    </ContentTabs>
                  </motion.div>
                )}

                {/* ── TAB: EXPERIENCE ───────────────────── */}
                {activeIndex === 2 && (
                  <motion.div key="experience" custom={direction} variants={cardVariants} initial="enter" animate="active" exit="exit"
                    className="px-6 md:px-12 py-12">
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-8 flex items-center gap-4">
                      <div className="p-3 bg-[#00f3ff]/10 border-2 border-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                        <Briefcase className="w-7 h-7 text-[#00f3ff]" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight">Sys_Logs</h2>
                    </motion.div>

                    <ContentTabs
                      tabs={experiences.map((exp, i) => ({ id: exp._id || String(i), label: exp.company }))}
                      accentColor="#00f3ff"
                    >
                      {(activeTabId) => {
                        const exp = experiences.find((e, i) => (e._id || String(i)) === activeTabId);
                        if (!exp) return null;
                        return (
                          <motion.div initial="hidden" animate="visible" variants={staggerContainer}
                            className="bg-[#050505] border border-[#222] hover:border-[#00f3ff] p-6 transition-colors group relative">
                            <div className="absolute top-0 right-0 px-2 py-1 bg-[#00f3ff] text-black font-mono text-[10px] font-bold uppercase">SEC: CLASSIFIED</div>
                            <motion.div variants={staggerItem} className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 pt-3">
                              <div>
                                <h3 className="text-xl font-bold text-white mb-1 uppercase font-mono group-hover:text-[#00f3ff] transition-colors">{exp.role}</h3>
                                <h4 className="text-lg text-[#a0a0a0] font-mono tracking-widest uppercase">{exp.company}</h4>
                              </div>
                              <div className="mt-3 md:mt-0 px-3 py-1.5 bg-black border border-[#00f3ff]/50 font-mono text-[11px] text-[#00f3ff] shadow-[inset_0_0_10px_rgba(0,243,255,0.1)]">{exp.duration}</div>
                            </motion.div>
                            <ul className="space-y-3">
                              {exp.description.map((desc, i) => (
                                <motion.li key={i} variants={staggerItem} className="flex items-start gap-3 text-gray-300 font-mono text-sm leading-relaxed">
                                  <span className="text-[#00f3ff] mt-1 shrink-0">&gt;</span>
                                  <span>{desc}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        );
                      }}
                    </ContentTabs>
                  </motion.div>
                )}

                {/* ── TAB: EDUCATION ────────────────────── */}
                {activeIndex === 3 && (
                  <motion.div key="education" custom={direction} variants={cardVariants} initial="enter" animate="active" exit="exit"
                    className="px-6 md:px-12 py-12">
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-12 flex items-center gap-4">
                      <div className="p-3 bg-[#00ff41]/10 border-2 border-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.3)]">
                        <GraduationCap className="w-7 h-7 text-[#00ff41]" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight">Training_Data</h2>
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {education.map((edu, idx) => (
                        <motion.div key={edu._id || idx} initial="hidden" animate="visible" variants={staggerContainer}
                          className="bg-[#050505] border border-[#222] p-6 hover:border-[#00ff41] hover:shadow-[0_0_20px_rgba(0,255,65,0.1)] transition-colors relative">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00ff41]" />
                          <motion.div variants={staggerItem} className="text-xs text-[#00ff41] font-mono font-bold mb-3 tracking-widest uppercase">{edu.duration}</motion.div>
                          <motion.h3 variants={staggerItem} className="text-lg font-bold text-white mb-2 font-mono uppercase">{edu.degree}</motion.h3>
                          <motion.h4 variants={staggerItem} className="text-[#a0a0a0] font-mono mb-3 text-sm uppercase">{edu.institution}</motion.h4>
                          <motion.p variants={staggerItem} className="text-gray-400 text-sm leading-relaxed border-t border-[#222] pt-3 font-mono">&gt; {edu.details}</motion.p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── TAB: CONTACT ──────────────────────── */}
                {activeIndex === 4 && (
                  <motion.div key="contact" custom={direction} variants={cardVariants} initial="enter" animate="active" exit="exit"
                    className="px-6 md:px-12 py-12">
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                      <h2 className="text-3xl md:text-4xl font-black mb-4 uppercase text-white glitch-wrapper text-center">
                        <span className="glitch" style={{ animationDuration: '3s' }}>Open_Channel</span>
                      </h2>
                      <p className="text-[#a0a0a0] mb-10 text-base font-mono tracking-tight text-center">AWAITING HANDSHAKE PROTOCOL...</p>

                      <div className="flex flex-col md:flex-row gap-10 items-start justify-center">
                        <div className="flex flex-col gap-6 text-left border-l-2 border-[#ff003c] pl-6">
                          {[
                            { icon: MapPin, label: 'GEO', value: profile.location }
                          ].map((info, idx) => (
                            <motion.div key={idx} whileHover={{ x: 10 }} className="flex items-center gap-5 text-gray-300 group cursor-default">
                              <div className="w-10 h-10 bg-black flex items-center justify-center border border-[#ff003c] group-hover:bg-[#ff003c] transition-colors shadow-[0_0_10px_rgba(255,0,60,0.2)]">
                                <info.icon className="w-4 h-4 text-[#ff003c] group-hover:text-black" />
                              </div>
                              <div className="font-mono">
                                <h4 className="text-[10px] text-[#ff003c] mb-1 uppercase tracking-widest">{info.label}</h4>
                                <p className="text-sm uppercase">{info.value}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 w-full space-y-5 text-left bg-black p-6 border-2 border-[#222] focus-within:border-[#ff003c] transition-colors relative">
                          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ff003c] m-1" />
                          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#ff003c] m-1" />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-[10px] font-mono text-[#ff003c] mb-2 uppercase tracking-widest">ID</label>
                              <input required type="text" name="name" value={formData.name} onChange={handleChange}
                                className="w-full px-3 py-2.5 bg-[#111] border border-[#222] focus:outline-none focus:border-[#ff003c] transition-colors text-white font-mono text-sm placeholder-[#333]"
                                placeholder="USER_01" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-[#ff003c] mb-2 uppercase tracking-widest">NODE_ADDRESS</label>
                              <input required type="email" name="email" value={formData.email} onChange={handleChange}
                                className="w-full px-3 py-2.5 bg-[#111] border border-[#222] focus:outline-none focus:border-[#ff003c] transition-colors text-white font-mono text-sm placeholder-[#333]"
                                placeholder="user@network.net" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-[#ff003c] mb-2 uppercase tracking-widest">PAYLOAD</label>
                            <textarea required rows={4} name="message" value={formData.message} onChange={handleChange}
                              className="w-full px-3 py-2.5 bg-[#111] border border-[#222] focus:outline-none focus:border-[#ff003c] transition-colors text-white font-mono text-sm placeholder-[#333] resize-none"
                              placeholder="[INPUT DATA]" />
                          </div>
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                            className="w-full py-3.5 bg-[#ff003c] text-black hover:bg-black hover:text-[#ff003c] border-2 border-[#ff003c] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(255,0,60,0.4)]">
                            <Terminal className="w-5 h-5" /> INITIALIZE_TRANSFER
                          </motion.button>
                          {status && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              className={`text-center mt-3 text-xs font-mono uppercase tracking-widest ${status.includes('UPLOADED') ? 'text-[#00ff41]' : 'text-[#ff003c]'}`}>
                              {status}
                            </motion.p>
                          )}
                        </form>
                      </div>

                      <footer className="mt-16 py-6 text-center text-[#333] text-[10px] font-mono border-t border-[#1a1a1a] uppercase tracking-widest">
                        <p>SYSTEM.COPYRIGHT © {new Date().getFullYear()} {profile.name}. ALL RIGHTS SECURED.</p>
                        {/* Hex easter egg — decodes to: "triple click the logo for red team mode" */}
                        <p className="mt-2 text-[8px] text-[#111] hover:text-[#222] transition-colors duration-700 select-all cursor-default tracking-[0.2em]">
                          74 72 69 70 6c 65 20 63 6c 69 63 6b 20 74 68 65 20 6c 6f 67 6f
                        </p>
                      </footer>
                    </motion.div>
                  </motion.div>
                )}\n\n                {/* ── TAB: BREACH DOSSIER (hidden, unlocked via terminal) ── */}
                {activeIndex === 5 && breachUnlocked && (
                  <motion.div key="breach" custom={direction} variants={cardVariants} initial="enter" animate="active" exit="exit"
                    className="px-6 md:px-12 py-12">
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-[#ff003c]/10 border-2 border-[#ff003c] shadow-[0_0_15px_rgba(255,0,60,0.3)]">
                          <Shield className="w-7 h-7 text-[#ff003c]" />
                        </div>
                        <div>
                          <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight">CLASSIFIED_DOSSIER</h2>
                          <div className="text-[10px] font-mono text-[#ff003c] uppercase tracking-[0.3em] mt-1">CLEARANCE: LEVEL 5 // EYES ONLY</div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-[#050505] border border-[#ff003c]/30 p-6 relative">
                          <div className="absolute top-0 right-0 px-2 py-1 bg-[#ff003c] text-black font-mono text-[10px] font-bold">TOP SECRET</div>
                          <h3 className="font-mono text-[#ff003c] text-sm uppercase tracking-widest mb-4">Subject Profile</h3>
                          <div className="grid grid-cols-2 gap-4 font-mono text-sm">
                            <div><span className="text-[#555]">CODENAME:</span> <span className="text-white">{profile.alias}</span></div>
                            <div><span className="text-[#555]">STATUS:</span> <span className="text-[#00ff41]">ACTIVE</span></div>
                            <div><span className="text-[#555]">THREAT_LEVEL:</span> <span className="text-[#fcee0a]">ELEVATED</span></div>
                            <div><span className="text-[#555]">SPECIALTY:</span> <span className="text-white">AI + OFFENSIVE SEC</span></div>
                            <div><span className="text-[#555]">CLASSIFICATION:</span> <span className="text-[#ff003c]">███████████</span></div>
                            <div><span className="text-[#555]">CLEARANCE:</span> <span className="text-[#ff003c]">REDACTED</span></div>
                          </div>
                        </div>

                        <div className="bg-[#050505] border border-[#222] p-6">
                          <h3 className="font-mono text-[#00f3ff] text-sm uppercase tracking-widest mb-4">Intercepted Intel</h3>
                          <ul className="space-y-3 font-mono text-sm text-gray-300">
                            <li className="flex gap-3"><span className="text-[#00ff41]">▸</span> Subject demonstrates advanced capability in LLM orchestration and agentic AI systems</li>
                            <li className="flex gap-3"><span className="text-[#00ff41]">▸</span> Known to build production systems that pass OWASP audits on first review</li>
                            <li className="flex gap-3"><span className="text-[#00ff41]">▸</span> Has breached {Math.floor(Math.random() * 50 + 20)} test environments with zero detection</li>
                            <li className="flex gap-3"><span className="text-[#00ff41]">▸</span> Maintains a 1.34 GPA at HDBW while simultaneously operating as a working student at Infineon</li>
                            <li className="flex gap-3"><span className="text-[#ff003c]">▸</span> <span className="text-[#ff003c]">WARNING: Subject is actively seeking new challenges. Approach with compelling offers only.</span></li>
                          </ul>
                        </div>

                        <div className="bg-[#050505] border border-[#222] p-6">
                          <h3 className="font-mono text-[#fcee0a] text-sm uppercase tracking-widest mb-4">Recommended Action</h3>
                          <p className="font-mono text-sm text-gray-400 mb-4">If you've made it this far, you clearly know your way around a system. I respect that.</p>
                          <div className="flex gap-4">
                            <a href={`mailto:${profile.email}?subject=I%20found%20the%20BREACH%20dossier&body=I%20typed%20BREACH%20in%20your%20terminal.%20Let's%20talk.`}
                              className="px-4 py-2 bg-[#ff003c] text-black font-mono text-xs font-bold uppercase hover:shadow-[0_0_15px_rgba(255,0,60,0.6)] transition-shadow cursor-pointer">
                              INITIATE_CONTACT
                            </a>
                            <a href={profile.linkedinUrl} target="_blank" rel="noreferrer"
                              className="px-4 py-2 border border-[#00f3ff] text-[#00f3ff] font-mono text-xs font-bold uppercase hover:bg-[#00f3ff] hover:text-black transition-colors cursor-pointer">
                              LINKEDIN_RECON
                            </a>
                          </div>
                        </div>

                        <div className="text-center py-4">
                          <p className="font-mono text-[10px] text-[#333] uppercase tracking-widest">You found 1 of the hidden easter eggs. How many more can you discover?</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* HUD Overlay */}
      {!isBooting && <HudOverlay sections={breachUnlocked ? [...SECTIONS, { id: 'breach', command: 'breach', label: 'CLASSIFIED', color: '#ff003c' }] : SECTIONS} activeIndex={activeIndex} onNavigate={navigateTo} />}

      {/* Terminal Navigation */}
      {!isBooting && (
        <TerminalNav
          onCommand={navigateByCommand}
          activeSection={(breachUnlocked && activeIndex === 5) ? 'classified' : SECTIONS[Math.min(activeIndex, SECTIONS.length - 1)].command}
          onMeltdown={() => setShowMeltdown(true)}
          onBreach={handleBreach}
        />
      )}
    </div>
  );
}

export default App;
