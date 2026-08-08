import React, { useState, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CameraView from './components/CameraView';
import TranslationPanel from './components/TranslationPanel';
import GestureGuide from './components/GestureGuide';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import HistoryLog from './components/HistoryLog';
import Footer from './components/Footer';
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
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white scroll-smooth">
      <Header userApiKey={userApiKey} setUserApiKey={setUserApiKey} />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Live Translator Interface Section */}
        <section id="translator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-16">
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
        </section>

        {/* Gesture Cheatsheet Section */}
        <section id="cheatsheet" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 scroll-mt-16">
          <GestureGuide />
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* About Section */}
        <About />

        {/* History Log Section */}
        <section id="history" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-16">
          <HistoryLog history={history} setHistory={setHistory} />
        </section>
      </main>

      {/* Modern Footer */}
      <Footer />
    </div>
  );
}

export default App;
