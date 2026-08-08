import React, { useState } from 'react';

interface HeaderProps {
  userApiKey: string;
  setUserApiKey: (key: string) => void;
}

export function Header({ userApiKey, setUserApiKey }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputKey, setInputKey] = useState(userApiKey);

  const handleSave = () => {
    localStorage.setItem('GROQ_USER_KEY', inputKey.trim());
    setUserApiKey(inputKey.trim());
    setIsOpen(false);
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
          S
        </div>
        <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
          Signa AI
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 transition flex items-center gap-2"
        >
          <span className={`w-2 h-2 rounded-full ${userApiKey ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          {userApiKey ? 'API Key Configured' : 'Set Groq API Key'}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-16 right-6 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl w-80 z-50">
          <h4 className="text-sm font-semibold text-slate-200 mb-2">Groq API Key</h4>
          <p className="text-xs text-slate-400 mb-3">
            Enter your key to enable real-time Llama 3 AI gesture translation.
          </p>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="gsk_..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 mb-3"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-lg text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
            >
              Save Key
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
