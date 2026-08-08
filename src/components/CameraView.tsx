import React, { useRef, useEffect } from 'react';
import { Camera, Hand, Sparkles } from 'lucide-react';
import { classifyGesture } from '../utils/gestureRecognizer';

interface CameraViewProps {
  onGestureDetected: (gesture: string) => void;
  onCapture: (gesture: string) => void;
  setEngineStatus: (status: string) => void;
  currentGesture: string;
}

export const CameraView: React.FC<CameraViewProps> = ({
  onGestureDetected,
  onCapture,
  setEngineStatus,
  currentGesture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cameraInstance: any = null;

    const init = () => {
      if (!window.Hands || !window.Camera) {
        setEngineStatus('Loading AI Tracking Engine...');
        setTimeout(init, 500);
        return;
      }

      setEngineStatus('Engine Active');
      const hands = new window.Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.75,
        minTrackingConfidence: 0.75,
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
          const landmarks = results.multiHandLandmarks[0];

          if (window.drawConnectors && window.HAND_CONNECTIONS) {
            window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {
              color: '#3b82f6',
              lineWidth: 3,
            });
          }
          if (window.drawLandmarks) {
            window.drawLandmarks(ctx, landmarks, { color: '#a855f7', lineWidth: 1, radius: 4 });
          }

          const detected = classifyGesture(landmarks);
          onGestureDetected(detected);
        } else {
          onGestureDetected('Searching for hand...');
        }
        ctx.restore();
      });

      if (videoRef.current) {
        cameraInstance = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) await hands.send({ image: videoRef.current });
          },
          width: 640,
          height: 480,
        });
        cameraInstance.start();
      }
    };

    init();
    return () => {
      if (cameraInstance) cameraInstance.stop();
    };
  }, []);

  return (
    <div className="relative w-full aspect-video bg-[#0d1322] border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl group">
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} width={640} height={480} className="w-full h-full object-cover" />

      {/* Top Floating Badge */}
      <div className="absolute top-4 left-4 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/60 text-xs font-semibold text-slate-200 shadow-md">
        <Camera className="w-4 h-4 text-purple-400 animate-pulse" />
        <span>Live Vision Engine</span>
      </div>

      {/* Manual Capture Action Bar */}
      <div className="absolute bottom-4 inset-x-4 flex items-center justify-between bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 p-3 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3 px-2">
          <Hand className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-bold text-slate-100">{currentGesture}</span>
        </div>

        <button
          onClick={() => onCapture(currentGesture)}
          disabled={currentGesture.includes('Searching')}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Capture Gesture</span>
        </button>
      </div>
    </div>
  );
};
export default CameraView;

