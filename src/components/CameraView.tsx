import React, { useEffect, useRef } from 'react';
import { refineSentenceWithGroq } from '../utils/groq';

interface CameraViewProps {
  onGestureDetected: (gesture: string, sentence: string) => void;
  setEngineStatus: (status: string) => void;
  userApiKey?: string;
}

export function CameraView({ onGestureDetected, setEngineStatus, userApiKey }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        setEngineStatus('Initializing Camera...');
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setEngineStatus('Engine Active');
      } catch (err) {
        console.error('Camera access error:', err);
        setEngineStatus('Camera Access Denied');
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [setEngineStatus]);

  return (
    <div className="relative w-full aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono">
        Live Feed
      </div>
    </div>
  );
}

export default CameraView;

