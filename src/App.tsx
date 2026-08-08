import React, { useState, useRef } from 'react';
import Header from './components/Header';
import CameraView from './components/CameraView';
import TranslationPanel from './components/TranslationPanel';
import HistoryLog from './components/HistoryLog';
import { HistoryItem } from './types';
import { speak } from './utils/speech';

export function App() {
  const [isMuted, setIsMuted] = useState(false);
  const [engineStatus, setEngineStatus] = useState('Engine Active');
  const [currentGesture, setCurrentGesture] = useState<string>('');
  const [currentSentence, setCurrentSentence] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [userApiKey, setUserApiKey] = useState(
    localStorage.getItem('GROQ_USER_KEY') || ''
  );

  const activeGestureRef = useRef<string>('');
  const activeSentenceRef = useRef<string>('');

  const handleGestureCaptured = (newGesture: string, newSentence: string) => {
    if (!newGesture || newGesture.includes('Searching') || newGesture === activeGestureRef.current) {
      return;
    }

    if (activeGestureRef.current && !activeGestureRef.current.includes('Searching')) {
      const historyEntry: HistoryItem = {
        id: Date.now().toString(),
        text: activeGestureRef.current,
        sentence: activeSentenceRef.current,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setHistory((prev) => [historyEntry, ...prev]);
    }

    activeGestureRef.current = newGesture;
    activeSentenceRef.current = newSentence;

    setCurrentGesture(newGesture);
    setCurrentSentence(newSentence);

    if (!isMuted && newSentence) {
      speak(newSentence);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header userApiKey={userApiKey} setUserApiKey={setUserApiKey} />

      <main className="flex-grow">
        <section id="hero" className="py-12 px-6 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-400 mb-4">
            AI Sign Language Translation
          </h1>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Real-time hand landmark analysis combined with Groq LLM inference to translate gestures into natural spoken sentences.
          </p>
        </section>

        <section id="tool" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CameraView 
                onGestureDetected={handleGestureCaptured}
                setEngineStatus={setEngineStatus}
                userApiKey={userApiKey}
              />
            </div>

            <div>
              <TranslationPanel 
                currentGesture={currentGesture}
                currentSentence={currentSentence}
                engineStatus={engineStatus}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
              />
            </div>
          </div>

          <div className="mt-8">
            <HistoryLog history={history} setHistory={setHistory} />
          </div>
        </section>

        <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">About Signa AI</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Signa AI bridges accessibility gaps by converting computer vision hand landmark tracking into natural human speech using ultra-fast edge inference powered by Groq.
            </p>
          </div>
        </section>

        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-100 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold mb-4">1</div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Webcam Hand Tracking</h3>
              <p className="text-slate-400 text-xs leading-relaxed">MediaPipe extracts 21 precise 3D hand coordinates frame-by-frame directly inside your browser.</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-4">2</div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Groq LLM Enhancement</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Raw gesture labels are converted into natural spoken sentences using Llama 3 via Groq API in sub-100ms.</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold mb-4">3</div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Speech Synthesis</h3>
              <p className="text-slate-400 text-xs leading-relaxed">The translated output is instantly vocalized using Web Speech API with real-time logging.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-500">
        Signa AI — Powered by MediaPipe & Groq Llama 3.3
      </footer>
    </div>
  );
}

export default App;
