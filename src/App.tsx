import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CameraView } from './components/CameraView';
import { TranslationPanel } from './components/TranslationPanel';
import { HistoryLog } from './components/HistoryLog';
import { HistoryItem } from './types';

export function App() {
  const [isMuted, setIsMuted] = useState(false);
  const [engineStatus, setEngineStatus] = useState('Initializing Engine...');
  const [currentGesture, setCurrentGesture] = useState('Searching for hand...');
  const [transcript, setTranscript] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleManualCapture = (gesture: string) => {
    if (!gesture || gesture.includes('Searching')) return;
    setTranscript((prev) => (prev ? `${prev} ${gesture}` : gesture));
  };

  const handleSaveToHistory = (text: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans">
      <Navbar isMuted={isMuted} setIsMuted={setIsMuted} status={engineStatus} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CameraView
            onGestureDetected={setCurrentGesture}
            onCapture={handleManualCapture}
            setEngineStatus={setEngineStatus}
            currentGesture={currentGesture}
          />
          <HistoryLog history={history} />
        </div>

        <div className="lg:col-span-1">
          <TranslationPanel
            currentGesture={currentGesture}
            transcript={transcript}
            setTranscript={setTranscript}
            isMuted={isMuted}
            onSaveToHistory={handleSaveToHistory}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
