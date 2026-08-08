import React, { useState } from 'react';

interface HeaderProps {
  userApiKey: string;
  setUserApiKey: (key: string) => void;
}

export function Header({ userApiKey, setUserApiKey }: HeaderProps) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(userApiKey);

  const saveApiKey = () => {
    localStorage.setItem('GROQ_USER_KEY', tempKey);
    setUserApiKey(tempKey);
    setShowKeyModal(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-300">
            Signa AI
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <button 
            onClick={() => scrollToSection('translator')} 
            className="hover:text-indigo-400 transition-colors"
          >
            Live Translator
          </button>
          <button 
            onClick={() => scrollToSection('cheatsheet')} 
            className="hover:text-indigo-400 transition-colors"
          >
            Gestures (26)
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')} 
            className="hover:text-indigo-400 transition-colors"
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection('about')} 
            className="hover:text-indigo-400 transition-colors"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('history')} 
            className="hover:text-indigo-400 transition-colors"
          >
            History Log
          </button>
        </nav>

        {/* API Key Modal Action Button */}
        <button
          onClick={() => setShowKeyModal(true)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all shadow-lg ${
            userApiKey
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 shadow-emerald-500/10'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 shadow-amber-500/10'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${userApiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'}`} />
          {userApiKey ? 'API Key Configured' : 'Configure Groq API Key'}
        </button>
      </div>

      {/* Groq API Key Config Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Groq Llama 3.3 API Settings</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your custom Groq API Key to enable instant contextual translation smoothing. Your key remains stored safely in client-side localStorage.
            </p>
            <input
              type="password"
              placeholder="gsk_..."
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveApiKey}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-xs text-white font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
