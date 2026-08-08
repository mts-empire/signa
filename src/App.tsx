import React, { useState, useRef } from 'react';
import Header from './components/Header';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
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

    // Move previous gesture to history log
    if (activeGestureRef.current && !activeGestureRef.current.includes('Searching')) {
      const historyEntry: HistoryItem = {
        id: Date.now().toString(),
        text: activeGestureRef.current,
        sentence: activeSentenceRef.current,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setHistory((prev) => [historyEntry, ...prev]);
    }

    // Set ONLY the new gesture as current
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
      {/* Navigation Header */}
      <Header userApiKey={userApiKey} setUserApiKey={setUserApiKey} />

      <main className="flex-grow">
        {/* Inline Hero Banner */}
        <section id="hero" className="py-12 px-6 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-400 mb-4">
            AI Sign Language Translation
          </h1>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Real-time hand landmark analysis combined with Groq LLM inference to translate gestures into natural spoken sentences.
          </p>
        </section>

        {/* Vision Tool Section */}
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

        {/* About Section */}
        <section id="about">
          <About />
        </section>

        {/* How It Works Section */}
        <section id="how-it-works">
          <HowItWorks />
        </section>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default App;
