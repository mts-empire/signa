import React, { useState } from 'react';

interface TranslationPanelProps {
  currentGesture: string;
  currentSentence: string;
  engineStatus: string;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export function TranslationPanel({
  currentGesture,
  currentSentence,
  engineStatus,
  isMuted,
  setIsMuted,
}: TranslationPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (currentSentence) {
      navigator.clipboard.writeText(currentSentence);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between h-full shadow-xl">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Translation Stream
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            engineStatus.includes('Active') || engineStatus.includes('Detected')
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}>
            {engineStatus}
          </span>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 font-mono block mb-1">Detected Gesture</span>
            <p className="text-lg font-bold text-indigo-400">
              {currentGesture || 'Waiting for gesture input...'}
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 font-mono block mb-1">AI Spoken Sentence</span>
            <p className="text-base text-slate-200 min-h-[48px] font-medium leading-relaxed">
              {currentSentence ? `"${currentSentence}"` : 'Translated sentence will display here.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition"
        >
          {isMuted ? 'Unmute Audio' : 'Mute Audio'}
        </button>

        <button
          onClick={handleCopy}
          disabled={!currentSentence}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs text-white font-medium transition shadow-lg shadow-indigo-600/20"
        >
          {copied ? 'Copied!' : 'Copy Text'}
        </button>
      </div>
    </div>
  );
}

export default TranslationPanel;
