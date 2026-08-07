import { useState, useRef } from 'react';

export default function GestureTool() {
  const [gestureWord, setGestureWord] = useState("Waiting...");
  const [spokenSentence, setSpokenSentence] = useState("Show a gesture to start...");
  const [isScanning, setIsScanning] = useState(false);
  const lastSpokenRef = useRef("");

  // Speak sentence using Web Speech API
  const speakText = (text) => {
    if ('speechSynthesis' in window && text !== lastSpokenRef.current) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      lastSpokenRef.current = text;
    }
  };

  const handleFrameProcess = async (landmarks) => {
    const res = await fetch('/api/gesture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ landmarks })
    });
    const data = await res.json();
    if (data.word) {
      setGestureWord(data.word);
      setSpokenSentence(data.sentence);
      speakText(data.sentence);
    }
  };

  return (
    <div id="tool" className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 relative aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
          {!isScanning ? (
            <button 
              onClick={() => setIsScanning(true)}
              className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg"
            >
              Start Camera & AI Speech
            </button>
          ) : (
            <div className="w-full h-full relative">
              <video className="w-full h-full object-cover" autoPlay playsInline muted />
            </div>
          )}
        </div>

        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono text-indigo-400 uppercase tracking-wider mb-2">Detected Gesture Word</h3>
            <div className="text-2xl font-bold text-emerald-400 mb-6">{gestureWord}</div>

            <h3 className="text-xs font-mono text-indigo-400 uppercase tracking-wider mb-2">Groq AI Spoken Sentence</h3>
            <div className="text-lg font-medium text-slate-200 bg-slate-900 p-4 rounded-xl border border-slate-800">
              "{spokenSentence}"
            </div>
          </div>

          <div className="mt-6 p-4 bg-indigo-950/30 border border-indigo-900/50 rounded-xl flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs text-indigo-300">Text-to-Speech Engine Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
