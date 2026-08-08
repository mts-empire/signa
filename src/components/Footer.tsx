import React from 'react';

export function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-slate-900 bg-[#030712] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center font-black text-white text-sm">
              S
            </div>
            <span className="text-lg font-extrabold text-white">Signa AI</span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Real-Time Sign Language Translation powered by client-side computer vision and cloud LLM refinement.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
            Quick Navigation
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <button onClick={() => scrollToSection('translator')} className="hover:text-indigo-400 transition">
                Live Translator
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('cheatsheet')} className="hover:text-indigo-400 transition">
                26 Gestures
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-indigo-400 transition">
                How It Works
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('about')} className="hover:text-indigo-400 transition">
                About Engine
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('history')} className="hover:text-indigo-400 transition">
                History Log
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
            Tech Stack
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>MediaPipe Hands API</li>
            <li>Groq Llama 3.3 70B</li>
            <li>React & TypeScript</li>
            <li>Tailwind CSS</li>
            <li>Vite & Vercel</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <span>© {new Date().getFullYear()} Signa AI. All rights reserved.</span>
        <span>Built for high-performance accessible translation</span>
      </div>
    </footer>
  );
}

export default Footer;
