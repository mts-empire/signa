import React, { useState } from 'react';
import { Play, Copy, Trash2, Plus, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { speakText } from '../utils/speech';
import { refineSentenceWithGroq } from '../utils/groq';

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
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [error, setError] = useState('');

  const appendGesture = () => {
    if (!currentGesture || currentGesture.includes('Searching')) return;
    setTranscript((prev) => (prev ? `${prev} ${currentGesture}` : currentGesture));
    speakText(currentGesture, isMuted);
  };

  const handleEnhance = async () => {
    if (!transcript.trim()) return;
    setIsAiProcessing(true);
    setError('');

    try {
      const refined = await refineSentenceWithGroq(transcript);
      setTranscript(refined);
      speakText(refined, isMuted);
    } catch (err: any) {
      setError(err.message || 'Groq processing failed.');
    } finally {
      setIsAiProcessing(false);
    }
  };

  return (
    <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-6">
      {/* Current Gesture Card */}
      <div>
        <h2 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-2">Recognized Token</h2>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <span className="text-lg font-bold text-blue-400">{currentGesture}</span>
          <button
            onClick={appendGesture}
            disabled={currentGesture.includes('Searching')}
            className="flex items-center space-x-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Transcript Box */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Sentence Builder</h2>
          <div className="flex space-x-1">
            <button onClick={() => navigator.clipboard.writeText(transcript)} className="p-2 text-slate-400 hover:text-white transition">
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (transcript) onSaveToHistory(transcript);
                setTranscript('');
                setError('');
              }}
              className="p-2 text-slate-400 hover:text-red-400 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl min-h-[120px] text-slate-200 text-sm leading-relaxed shadow-inner">
          {transcript || <span className="text-slate-600 italic">Captured gestures will build up here...</span>}
        </div>
        {error && <p className="text-xs text-red-400 font-medium mt-2">{error}</p>}
      </div>

      {/* Controls */}
      <div className="space-y-3">
        <button
          onClick={handleEnhance}
          disabled={!transcript || isAiProcessing}
          className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-90 disabled:opacity-40 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-purple-900/30 active:scale-95"
        >
          {isAiProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Thinking with Groq AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-white" />
              <span>Convert to AI Sentence (Groq)</span>
            </>
          )}
        </button>

        <button
          onClick={() => speakText(transcript, isMuted)}
          disabled={!transcript}
          className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 disabled:opacity-40 text-emerald-400 font-bold py-3.5 rounded-2xl flex items-center justify-center space-x-2 transition active:scale-95"
        >
          <Play className="w-5 h-5 fill-emerald-400" />
          <span>Speak Output</span>
        </button>
      </div>
    </div>
  );
};
