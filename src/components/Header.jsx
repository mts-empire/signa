import { useState, useEffect } from 'react';

export default function Header({ apiKey, setApiKey }) {
  const [inputKey, setInputKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('user_groq_key') || '';
    setInputKey(saved);
    if (setApiKey) setApiKey(saved);
  }, []);

  const handleSaveKey = () => {
    localStorage.setItem('user_groq_key', inputKey);
    if (setApiKey) setApiKey(inputKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/90 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            AG
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              AetherGesture AI
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Engine Active
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#hero" className="hover:text-white transition-colors">Home</a>
          <a href="#tool" className="hover:text-white transition-colors">Vision Tool</a>
          <a href="#about" className="hover:text-white transition-colors">Technology</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
        </nav>

        {/* API Key Input & Action Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
            <span className="text-slate-500 mr-2 text-xs font-mono">🔑</span>
            <input
              type="password"
              placeholder="Groq API Key (Optional)..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="bg-transparent text-xs text-slate-200 outline-none w-36 sm:w-48 placeholder-slate-600 font-mono"
            />
            <button
              onClick={handleSaveKey}
              className="ml-2 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
            >
              {isSaved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
