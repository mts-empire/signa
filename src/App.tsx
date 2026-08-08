import React, { useState, useRef } from 'react';
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
      <header className="border-b border-slate-800/80 bg-slate-950/50 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Signa AI
          </span>
        </div>
      </header>

      <main className="flex-grow">
        <section id="hero" className="py-10 px-6 text-center max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-400 mb-3">
            AI Sign Language Translation
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            Real-time gesture analysis combined with Groq LLM inference to translate signs into natural spoken sentences.
          </p>
        </section>

        <section id="tool" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
      </main>
    </div>
  );
}

export default App;
