import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface Props {
  onCommand: (cmd: string) => boolean;
  activeSection: string;
  onMeltdown: () => void;
  onBreach: () => void;
}

interface HistoryEntry {
  input: string;
  output: string;
  isError: boolean;
}

const HELP_TEXT = `Available commands:
  cd /home          Navigate to home
  cd /skills        Navigate to tech arsenal
  cd /experience    Navigate to experience logs
  cd /education     Navigate to training data
  cd /contact       Open communication channel
  help              Show this help
  clear             Clear terminal history
  whoami            Display user info`;

const MAN_HIRE = `HIRE(1)                     Ashley Thomas Roy Manual                    HIRE(1)

NAME
       hire - engage a cybersecurity engineer with full-stack capabilities

SYNOPSIS
       hire ashley [--fulltime | --contract] [--remote] [--onsite=LOCATION]

DESCRIPTION
       Deploys a battle-tested engineer specializing in AI/LLM automation,
       penetration testing, and production-grade web systems. Ships clean,
       typed, documented code. Responds faster than most APIs.

OPTIONS
       --security    OWASP-hardened code, threat modeling, red team mindset
       --ai          LLM orchestration, RAG pipelines, agentic systems
       --fullstack   React + TypeScript + Node + MongoDB + Docker
       --fast        Available to start within 2 weeks

EXAMPLES
       $ hire ashley --fulltime --remote
       $ hire ashley --contract --security --ai

AUTHOR
       Ashley Thomas Roy <ashleytr.mec@gmail.com>

SEE ALSO
       linkedin(1), github(1), portfolio(1)`;

const NMAP_OUTPUT = `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toISOString().split('T')[0]}
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00042s latency).

PORT      STATE  SERVICE           VERSION
22/tcp    open   ssh               OpenSSH 9.0 (protocol 2.0)
443/tcp   open   react-engine      Vite/4.5.3 + React/18
3000/tcp  open   express-api       Express/4.18 + TypeScript
27017/tcp open   mongodb           MongoDB 7.0.4
6379/tcp  open   redis-cache       Redis 7.2.1
8443/tcp  open   llm-orchestrator  LangChain/0.1.x

Service detection performed. 6 services found.
Nmap done: 1 IP address (1 host up) scanned in 0.42 seconds`;

export const TerminalNav = ({ onCommand, activeSection, onMeltdown, onBreach }: Props) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commands, setCommands] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [hackMode, setHackMode] = useState(false);
  const [hackTarget, setHackTarget] = useState('');
  const [hackTimer, setHackTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  // Persistent History Load
  useEffect(() => {
    const saved = localStorage.getItem('terminal_commands');
    if (saved) {
      try {
        setCommands(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load terminal history', e);
      }
    }
  }, []);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    return () => { if (hackTimer) clearTimeout(hackTimer); };
  }, [hackTimer]);

  const addHistory = (input: string, output: string, isError = false) => {
    setHistory(prev => [...prev, { input, output, isError }]);
  };

  const startHackGame = () => {
    const words = ['FIREWALL', 'DECRYPT', 'ROOTKIT', 'PAYLOAD', 'EXPLOIT', 'KERNEL', 'CIPHER', 'BREACH'];
    const target = words[Math.floor(Math.random() * words.length)];
    setHackMode(true);
    setHackTarget(target);
    addHistory('hack this', `[FIREWALL DETECTED] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Interception encrypted traffic...
Vulnerability found in sector 7G.
\nTYPE THE BYPASS CODE TO BREACH: ▸ ${target} ◂\nYou have 10 seconds. GO.`, false);

    const timer = setTimeout(() => {
      setHackMode(false);
      setHackTarget('');
      addHistory('', '⏱ TIME EXPIRED — FIREWALL LOCKED. ACCESS DENIED.', true);
    }, 10000);
    setHackTimer(timer);
  };

  const processCommand = (raw: string) => {
    const cmd = raw.trim();
    const cmdLower = cmd.toLowerCase();
    if (!cmd) return;

    // Save to persistence
    const updatedCommands = [cmd, ...commands.filter(c => c !== cmd)].slice(0, 50);
    setCommands(updatedCommands);
    setHistoryIndex(-1);
    localStorage.setItem('terminal_commands', JSON.stringify(updatedCommands));

    if (cmd.length > 150) {
      addHistory(raw, '⚠️  PAYLOAD TOO LARGE: Command exceeds safe buffer (150 chars).', true);
      return;
    }

    if (hackMode) {
      if (cmd.toUpperCase() === hackTarget) {
        if (hackTimer) clearTimeout(hackTimer);
        setHackMode(false);
        setHackTarget('');
        addHistory(cmd, `✅ BYPASS CODE ACCEPTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Firewall breached in ${(Math.random() * 3 + 1).toFixed(2)}s
Packets intercepted: ${Math.floor(Math.random() * 9000 + 1000)}
Encryption: NEUTRALIZED
\n> You'd make a good pentester. Or a dangerous one.`);
      } else {
        addHistory(cmd, `❌ WRONG CODE. The bypass was: ${hackTarget}. Firewall held.`, true);
        if (hackTimer) clearTimeout(hackTimer);
        setHackMode(false);
        setHackTarget('');
      }
      return;
    }

    if (cmdLower === 'help' || cmdLower === '?') {
      addHistory(raw, HELP_TEXT); return;
    }
    if (cmdLower === 'clear' || cmdLower === 'cls') {
      setHistory([]); return;
    }
    if (cmdLower === 'whoami') {
      addHistory(raw, 'visitor@ashley-portfolio:~$ ACCESS_LEVEL: GUEST\nTIP: There are hidden commands. A real hacker would find them.'); return;
    }
    if (cmdLower === 'man hire' || cmdLower === 'man ashley') {
      addHistory(raw, MAN_HIRE); return;
    }
    if (cmdLower === 'nmap localhost' || cmdLower === 'nmap 127.0.0.1' || cmdLower === 'nmap -sV localhost') {
      addHistory(raw, NMAP_OUTPUT); return;
    }
    if (cmdLower === 'cat /etc/shadow' || cmdLower === 'cat /etc/passwd') {
      addHistory(raw, '🔒 ACCESS DENIED — nice try, script kiddie.\nPermission denied. This incident will be reported.', true); return;
    }
    if (cmdLower === 'ping ashley' || cmdLower === 'ping admin') {
      addHistory(raw, `PING ashley.portfolio (127.0.0.1): 56 data bytes
64 bytes from ashley: icmp_seq=0 ttl=64 time=0.31ms
64 bytes from ashley: icmp_seq=1 ttl=64 time=0.28ms
64 bytes from ashley: icmp_seq=2 ttl=64 time=0.33ms

--- ashley.portfolio ping statistics ---
3 packets transmitted, 3 packets received, 0% packet loss
> I respond faster than most APIs. Try me.`); return;
    }
    if (cmdLower.startsWith('sudo rm') || cmdLower === 'rm -rf /' || cmdLower === 'sudo rm -rf /') {
      addHistory(raw, '☠️  INITIATING SYSTEM MELTDOWN...');
      onMeltdown();
      return;
    }
    if (cmdLower === 'hack this' || cmdLower === 'hack') {
      startHackGame(); return;
    }
    if (cmdLower === 'breach' || cmdLower === 'code breach') {
      addHistory(raw, `▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
 ██████  ██████  ███████  █████   ██████ ██   ██
 ██   ██ ██   ██ ██      ██   ██ ██      ██   ██
 ██████  ██████  █████   ███████ ██      ███████
 ██   ██ ██   ██ ██      ██   ██ ██      ██   ██
 ██████  ██   ██ ███████ ██   ██  ██████ ██   ██
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
ACCESS LEVEL UPGRADED: CLASSIFIED
Unlocking dossier...`);
      setTimeout(() => onBreach(), 1500);
      return;
    }
    if (cmdLower === 'ls' || cmdLower === 'ls -la') {
      addHistory(raw, `total 42
drwxr-xr-x  ashley  staff   skills.json
drwxr-xr-x  ashley  staff   experience.log
drwxr-xr-x  ashley  staff   education.dat
-rw-------  ashley  staff   .classified_dossier
-rw-r--r--  ashley  staff   README.md`); return;
    }
    if (cmdLower.startsWith('cat ')) {
      const file = cmdLower.substring(4).trim();
      if (!file) {
        addHistory(raw, 'cat: missing file operand', true); return;
      }
      if (file === '.classified_dossier') {
        addHistory(raw, 'cat: .classified_dossier: Permission denied. Clearance level 5 required. Try: breach', true); return;
      }
      if (file === 'readme.md') {
        addHistory(raw, 'cat: readme.md: Permission denied. File is locked by root.', true); return;
      }
      if (file === 'skills.json' || file === 'experience.log' || file === 'education.dat') {
        const section = file.split('.')[0];
        addHistory(raw, `cat: ${file}: Permission denied. Access restricted to UI panel.\nUse 'cd /${section}' to view via secured interface.`, true); return;
      }
      addHistory(raw, `cat: ${file}: No such file or directory`, true); return;
    }
    if (cmdLower === 'exit' || cmdLower === 'quit') {
      addHistory(raw, "There is no escape. You're in the system now."); return;
    }
    if (cmdLower === 'matrix') {
      addHistory(raw, 'Wake up, Neo... The Matrix has you.\nFollow the white rabbit. 🐇\nTry the Konami code: ↑↑↓↓←→←→BA'); return;
    }

    const navigated = onCommand(cmd);
    if (navigated) {
      const section = cmd.replace(/^(cd |goto |cat |ls |open )/, '').replace(/^\//, '');
      addHistory(raw, `Navigating to /${section}...`);
    } else {
      addHistory(raw, `[ERROR]: Command "${raw}" not recognized. Type 'help' for available commands.`, true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = historyIndex + 1;
      if (nextIndex < commands.length) {
        setHistoryIndex(nextIndex);
        setInput(commands[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInput(commands[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const possible = ['cd /home', 'cd /skills', 'cd /experience', 'cd /education', 'cd /contact', 'help', 'clear', 'whoami', 'man hire', 'nmap localhost', 'ping ashley', 'hack', 'matrix', 'ls', 'ls -la', 'breach'];
      const match = possible.find(c => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-[200] transition-all duration-300 ${isFocused ? 'h-64' : 'h-11'}`}>
      {isFocused && (
        <div ref={historyRef}
          className="bg-black/95 backdrop-blur-md border-t border-[#00ff41]/30 px-6 pt-3 pb-1 font-mono text-xs overflow-y-auto"
          style={{ height: 'calc(100% - 44px)' }}>
          {history.map((entry, i) => (
            <div key={i} className="mb-1">
              {entry.input && (
                <div className="text-[#00ff41]">
                  <span className="text-[#333]">visitor@sys</span>
                  <span className="text-[#00f3ff]">:</span>
                  <span className="text-[#fcee0a]">~/{activeSection}</span>
                  <span className="text-[#333]">$ </span>
                  <span className="text-gray-300">{entry.input}</span>
                </div>
              )}
              <div className={entry.isError ? 'text-[#ff003c]' : entry.output.startsWith('[NEURAL') ? 'text-[#00f3ff]' : entry.output.startsWith('[DECISION') ? 'text-[#00ff41]' : 'text-gray-500'} style={{ whiteSpace: 'pre' }}>
                {entry.output}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="h-11 bg-black/95 backdrop-blur-md border-t border-[#00ff41]/20 px-6 flex items-center gap-3 cursor-text"
        onClick={() => inputRef.current?.focus()}>
        <div className="flex items-center gap-2 shrink-0">
          <div className={`w-2 h-2 ${hackMode ? 'bg-[#ff003c] shadow-[0_0_6px_#ff003c] animate-pulse' : isAiProcessing ? 'bg-[#fcee0a] shadow-[0_0_6px_#fcee0a] animate-pulse' : isFocused ? 'bg-[#00ff41] shadow-[0_0_6px_#00ff41]' : 'bg-[#333]'} transition-colors`} />
          <span className="text-[10px] font-mono text-[#333] uppercase tracking-widest">
            {hackMode ? 'HACK_MODE' : isAiProcessing ? 'THINKING' : 'TERMINAL'}
          </span>
          {isAiLoading && (
            <div className="flex gap-1 ml-2">
              <div className="w-1 h-1 bg-[#00f3ff] animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-1 bg-[#00f3ff] animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-1 bg-[#00f3ff] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>
        <span className="text-[#00ff41] font-mono text-xs shrink-0">
          <span className="text-[#333]">visitor@sys</span>
          <span className="text-[#00f3ff]">:</span>
          <span className="text-[#fcee0a]">~/{activeSection}</span>
          <span className="text-[#333]">$ </span>
        </span>
        <input ref={inputRef} type="text" value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={isFocused ? '' : isAiLoading ? 'INITIALIZING NEURAL ENGINE...' : isAiProcessing ? 'PROCESSING INTENT...' : hackMode ? 'TYPE THE BYPASS CODE...' : "Type 'help' or any natural language query..."}
          className={`flex-1 bg-transparent outline-none font-mono text-xs placeholder-[#222] ${hackMode ? 'text-[#ff003c] caret-[#ff003c]' : isAiProcessing ? 'text-[#fcee0a]' : 'text-white caret-[#00ff41]'}`}
          disabled={isAiProcessing}
          autoComplete="off" spellCheck="false" />
      </div>
    </div>
  );
};

