import React, { useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';

interface CameraViewProps {
  onGestureDetected: (gesture: string) => void;
  setEngineStatus: (status: string) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onGestureDetected, setEngineStatus }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cameraInstance: any = null;

    const initializeMediaPipe = () => {
      if (!window.Hands || !window.Camera) {
        setEngineStatus('Waiting for MediaPipe scripts...');
        setTimeout(initializeMediaPipe, 500);
        return;
      }

      setEngineStatus('Initializing Hand Tracker...');

      const hands = new window.Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });

      hands.onResults((results: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          for (const landmarks of results.multiHandLandmarks) {
            if (window.drawConnectors && window.HAND_CONNECTIONS) {
              window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {
                color: '#3b82f6',
                lineWidth: 3,
              });
            }
            if (window.drawLandmarks) {
              window.drawLandmarks(ctx, landmarks, { color: '#60a5fa', lineWidth: 1, radius: 4 });
            }

            const indexTip = landmarks[8];
            const indexPip = landmarks[6];
            const middleTip = landmarks[12];
            const middlePip = landmarks[10];

            if (indexTip.y < indexPip.y && middleTip.y < middlePip.y) {
              onGestureDetected('Peace / Victory');
            } else if (indexTip.y < indexPip.y) {
              onGestureDetected('Pointing');
            } else {
              onGestureDetected('Hand Detected');
            }
          }
        } else {
          onGestureDetected('Searching for hand...');
        }
        ctx.restore();
      });

      if (videoRef.current) {
        cameraInstance = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await hands.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });
        cameraInstance.start();
        setEngineStatus('Camera Active & Ready');
      }
    };

    initializeMediaPipe();

    return () => {
      if (cameraInstance) cameraInstance.stop();
    };
  }, []);

  return (
    <div className="relative w-full aspect-video bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} width={640} height={480} className="w-full h-full object-cover" />
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/50 flex items-center space-x-2 text-xs text-slate-300">
        <Camera className="w-4 h-4 text-blue-400" />
        <span>Live Processing Engine</span>
      </div>
    </div>
  );
};
