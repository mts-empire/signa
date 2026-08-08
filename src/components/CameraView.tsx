import React, { useEffect, useRef, useState } from 'react';
import { refineSentenceWithGroq } from '../utils/groq';

interface CameraViewProps {
  onGestureDetected: (gesture: string, sentence: string) => void;
  setEngineStatus: (status: string) => void;
  userApiKey?: string;
}

declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}

export function CameraView({ onGestureDetected, setEngineStatus, userApiKey }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastGestureRef = useRef<string>('');
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    let cameraInstance: any = null;
    let handsInstance: any = null;

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = 'anonymous';
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    async function initMediaPipe() {
      try {
        setEngineStatus('Loading AI Vision Models...');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');

        if (!videoRef.current || !canvasRef.current) return;

        const hands = new window.Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6
        });

        hands.onResults((results: any) => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.save();
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];

            ctx.fillStyle = '#6366f1';
            ctx.strokeStyle = '#818cf8';
            ctx.lineWidth = 3;

            for (let i = 0; i < landmarks.length; i++) {
              const x = landmarks[i].x * canvas.width;
              const y = landmarks[i].y * canvas.height;
              ctx.beginPath();
              ctx.arc(x, y, 4, 0, 2 * Math.PI);
              ctx.fill();
            }

            const detectedGesture = classifyHandGesture(landmarks);
            const now = Date.now();

            if (detectedGesture && detectedGesture !== lastGestureRef.current && (now - lastTimeRef.current > 1800)) {
              lastGestureRef.current = detectedGesture;
              lastTimeRef.current = now;

              setEngineStatus(`Detected: ${detectedGesture}`);

              refineSentenceWithGroq(detectedGesture, userApiKey).then((sentence) => {
                onGestureDetected(detectedGesture, sentence);
              });
            }
          }
          ctx.restore();
        });

        handsInstance = hands;

        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && handsInstance) {
              await handsInstance.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });

        camera.start();
        cameraInstance = camera;
        setEngineStatus('Engine Active - Show Hand');
      } catch (err) {
        console.error('MediaPipe Init Error:', err);
        setEngineStatus('Camera Active');
        startCameraFallback();
      }
    }

    async function startCameraFallback() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        setEngineStatus('Camera Access Error');
      }
    }

    initMediaPipe();

    return () => {
      if (cameraInstance) cameraInstance.stop();
      if (handsInstance) handsInstance.close();
    };
  }, [userApiKey]);

  return (
    <div className="relative w-full aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover transform -scale-x-100"
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 pointer-events-none"
      />
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Live Feed & Hand Mesh
      </div>
    </div>
  );
}

function classifyHandGesture(lm: any[]): string {
  if (!lm || lm.length < 21) return '';

  const isExtended = (tipIdx: number, pipIdx: number) => lm[tipIdx].y < lm[pipIdx].y;
  const thumbExtended = lm[4].x < lm[3].x || lm[4].y < lm[3].y;
  const indexExtended = isExtended(8, 6);
  const middleExtended = isExtended(12, 10);
  const ringExtended = isExtended(16, 14);
  const pinkyExtended = isExtended(20, 18);

  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    return 'Open Palm / Hello';
  }
  if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended && lm[4].y < lm[2].y) {
    return 'Thumbs Up / Good';
  }
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
    return 'Peace / Victory';
  }
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return 'Pointing / Look';
  }
  if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return 'Fist / Stop';
  }
  if (thumbExtended && indexExtended && pinkyExtended && !middleExtended && !ringExtended) {
    return 'Love / I Love You';
  }

  return 'Gesture Recognized';
}

export default CameraView;
