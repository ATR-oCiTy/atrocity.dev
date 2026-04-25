import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Easter egg: DevTools console message
console.log(
  '%c╔══════════════════════════════════════════╗\n' +
  '║    🔒 SYSTEM_OS // ASHLEY THOMAS ROY     ║\n' +
  '╠══════════════════════════════════════════╣\n' +
  '║                                          ║\n' +
  '║  You opened DevTools.                    ║\n' +
  '║  I like you already.                     ║\n' +
  '║                                          ║\n' +
  '║  Try typing \'hack this\' in the           ║\n' +
  '║  terminal at the bottom of the page.     ║\n' +
  '║                                          ║\n' +
  '║  There are more secrets to find.         ║\n' +
  '╚══════════════════════════════════════════╝',
  'color: #00ff41; font-family: monospace; font-size: 12px; background: #000; padding: 8px;'
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
