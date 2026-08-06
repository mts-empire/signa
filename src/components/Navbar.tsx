import React, { useState } from 'react';
import { Camera, Volume2, VolumeX, Key, Check } from 'lucide-react';

interface NavbarProps {
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  status: string;
  userApiKey: string;
  setUserApiKey: (key: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isMuted, setIsMuted, status, userApiKey, setUserApiKey }) => {
  const [keyInput, setKeyInput] = useState(userApiKey);
  const [saved, setSaved] = useState(false);

  const handleSaveKey = () => {
    setUserApiKey(keyInput);
    localStorage.setItem('GROQ_USER_KEY', keyInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <header className="w-full border-b border-slate-800/80 bg-[#0d1322]/90 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-2xl">
          <Camera className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">AI Sign Language Translator</h1>
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{status}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* On-Screen API Key Input Box */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5">
          <Key className="w-4 h-4 text-purple-400" />
          <input
            type="password"
            placeholder="Paste Groq Key (gsk_...)"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="bg-transparent text-xs text-slate-200 outline-none w-40 placeholder-slate-500"
          />
          <button
            onClick={handleSaveKey}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-2.5 py-1 rounded-lg font-bold transition flex items-center space-x-1"
          >
            {saved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <span>Save</span>}
          </button>
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-2.5 rounded-xl border transition ${
            isMuted
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
          }`}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};
