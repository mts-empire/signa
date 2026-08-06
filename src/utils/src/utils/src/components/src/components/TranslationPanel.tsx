import React from 'react';
import { Play, Copy, Trash2, Plus } from 'lucide-react';
import { speakText } from '../utils/speech';

interface TranslationPanelProps {
  currentGesture: string;
  transcript: string;
  setTranscript: React.Dispatch<React.SetStateAction<string>>;
  isMuted: boolean;
  onSaveToHistory: (text: string) => void;
}

export const TranslationPanel: React.FC<TranslationPanelProps> = ({
  currentGesture,
  transcript,
  setTranscript,
  isMuted,
  onSaveToHistory,
}) => {
  const appendGesture = () => {
    if (!currentGesture || currentGesture.includes('Searching')) return;
    const updated = transcript ? `${transcript} ${currentGesture}` : currentGesture;
    setTranscript(updated);
    speakText(currentGesture, isMuted);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
  };

  const clearTranscript = () => {
    if (transcript) {
      onSaveToHistory(transcript);
      setTranscript('');
    }
  };

  return (
    <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
      <div>
        <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Detected Sign</h2>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <span className="text-2xl font-extrabold text-blue-400">{currentGesture}</span>
          <button
            onClick={appendGesture}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Word</span>
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Constructed Sentence</h2>
          <div className="flex space-x-2">
            <button
              onClick={copyToClipboard}
              className="p-1.5 text-slate-400 hover:text-white transition"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={clearTranscript}
              className="p-1.5 text-slate-400 hover:text-red-400 transition"
              title="Clear & Save"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl min-h-[100px] text-slate-200 text-base leading-relaxed">
          {transcript || <span className="text-slate-500 italic">Click "Add Word" or signs will assemble here...</span>}
        </div>
      </div>

      <button
        onClick={() => speakText(transcript, isMuted)}
        disabled={!transcript}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-900/20"
      >
        <Play className="w-4 h-4 fill-white" />
        <span>Speak Sentence</span>
      </button>
    </div>
  );
};
