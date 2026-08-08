// src/App.tsx
import React, { useState, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CameraView from './components/CameraView';
import TranslationPanel from './components/TranslationPanel';
import HistoryLog from './components/HistoryLog';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import { HistoryItem } from './types';
import { speak } from './utils/speech';

export function App() {
  const [isMuted, setIsMuted] = useState(false);
  const [engineStatus, setEngineStatus] = useState('Engine Active');
  
  // Single active gesture slot (NO concatenation)
  const [currentGesture, setCurrentGesture] = useState<string>('');
  const [currentSentence, setCurrentSentence] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const [userApiKey, setUserApiKey] = useState(
    localStorage.getItem('GROQ_USER_KEY') || ''
  );

  // Refs to track previous active values accurately during state updates
  const activeGestureRef = useRef<string>('');
  const activeSentenceRef = useRef<string>('');

  // Triggered when a new gesture is recognized by CameraView
  const handleGestureCaptured = (newGesture: string, newSentence: string) => {
    // 1. Ignore empty detections or duplicate triggers of the currently active gesture
    if (!newGesture || newGesture.includes('Searching') || newGesture === activeGestureRef.current) {
      return;
    }

    // 2. MOVE PREVIOUS GESTURE TO HISTORY LOG (if one exists)
    if (activeGestureRef.current && !activeGestureRef.current.includes('Searching')) {
      const historyEntry: HistoryItem = {
        id: Date.now().toString(),
        text: activeGestureRef.current,
        sentence: activeSentenceRef.current,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      
      setHistory((prev) => [historyEntry, ...prev]);
    }

    // 3. SET ONLY THE NEW GESTURE AS ACTIVE
    activeGestureRef.current = newGesture;
    activeSentenceRef.current = newSentence;
    
    setCurrentGesture(newGesture);
    setCurrentSentence(newSentence);

    // 4. Speak ONLY the newly generated sentence
    if (!isMuted && newSentence) {
      speak(newSentence);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans">
      <Header userApiKey={userApiKey} setUserApiKey={setUserApiKey} />

      <main className="flex-grow">
        <Hero />

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

          {/* History Section */}
          <div className="mt-8">
            <HistoryLog history={history} setHistory={setHistory} />
          </div>
        </section>

        <About />
        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}

export default App;
