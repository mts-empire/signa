import React, { useState, useRef } from 'react';
import Header from './components/Header';
import CameraView from './components/CameraView';
import TranslationPanel from './components/TranslationPanel';
import HistoryLog from './components/HistoryLog';
import GestureGuide from './components/GestureGuide';
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
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header userApiKey={userApiKey} setUserApiKey={setUserApiKey} />

      <main className="flex-grow">
        <section className="py-12 px-6 text-center max-w-4xl mx-auto">
          <div className="inline-block mb-3 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            Sub-100ms Gesture AI Inference
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-400 mb-4 tracking-tight">
            AI Sign Language Translator
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Real-time 3D hand landmark recognition powered by MediaPipe and Groq Llama 3.3.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
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

          <div className="mb-8">
            <GestureGuide />
          </div>

          <div className="mb-8">
            <HistoryLog history={history} setHistory={setHistory} />
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-500">
        Signa AI — Real-Time Sign Language Translation System
      </footer>
    </div>
  );
}

export default App;
