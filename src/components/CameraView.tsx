import React, { useEffect, useRef } from 'react';
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
  const gestureBufferRef = useRef<string[]>([]);

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
        setEngineStatus('Initializing Vision Engine...');
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
            const lm = results.multiHandLandmarks[0];

            // Render skeleton overlay
            ctx.fillStyle = '#818cf8';
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 2.5;

            for (let i = 0; i < lm.length; i++) {
              const x = lm[i].x * canvas.width;
              const y = lm[i].y * canvas.height;
              ctx.beginPath();
              ctx.arc(x, y, 4, 0, 2 * Math.PI);
              ctx.fill();
            }

            const rawGesture = classifyHandGesture(lm);
            const now = Date.now();

            if (rawGesture) {
              gestureBufferRef.current.push(rawGesture);
              if (gestureBufferRef.current.length > 5) {
                gestureBufferRef.current.shift();
              }

              // Smooth gesture identification
              const counts: Record<string, number> = {};
              gestureBufferRef.current.forEach((g) => {
                counts[g] = (counts[g] || 0) + 1;
              });

              let dominant = '';
              let maxCount = 0;
              for (const [g, count] of Object.entries(counts)) {
                if (count > maxCount) {
                  maxCount = count;
                  dominant = g;
                }
              }

              if (maxCount >= 3 && dominant !== lastGestureRef.current && (now - lastTimeRef.current > 1400)) {
                lastGestureRef.current = dominant;
                lastTimeRef.current = now;

                setEngineStatus(`Detected: ${dominant}`);

                refineSentenceWithGroq(dominant, userApiKey).then((sentence) => {
                  onGestureDetected(dominant, sentence);
                });
              }
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
        console.error('MediaPipe Error:', err);
        setEngineStatus('Camera Active');
      }
    }

    initMediaPipe();

    return () => {
      if (cameraInstance) cameraInstance.stop();
      if (handsInstance) handsInstance.close();
    };
  }, [userApiKey]);

  return (
    <div className="relative w-full aspect-video bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl group">
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
      <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/60 text-xs text-slate-200 font-mono flex items-center gap-2 shadow-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        AI Mesh Tracking
      </div>
    </div>
  );
}

function dist(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function classifyHandGesture(lm: any[]): string {
  if (!lm || lm.length < 21) return '';

  const wrist = lm[0];

  // Extension states relative to wrist distance
  const indexExt = dist(lm[8], wrist) > dist(lm[6], wrist) * 1.1;
  const middleExt = dist(lm[12], wrist) > dist(lm[10], wrist) * 1.1;
  const ringExt = dist(lm[16], wrist) > dist(lm[14], wrist) * 1.1;
  const pinkyExt = dist(lm[20], wrist) > dist(lm[18], wrist) * 1.1;
  const thumbExt = dist(lm[4], lm[17]) > dist(lm[2], lm[17]) * 1.15;

  // Inter-fingertip distances
  const thumbIndexDist = dist(lm[4], lm[8]);
  const indexMiddleDist = dist(lm[8], lm[12]);
  const middleRingDist = dist(lm[12], lm[16]);
  const ringPinkyDist = dist(lm[16], lm[20]);

  // Orientation
  const thumbUp = lm[4].y < lm[2].y && lm[4].y < wrist.y;
  const thumbDown = lm[4].y > lm[2].y && lm[4].y > wrist.y;

  // Italian Chef Kiss
  if (thumbIndexDist < 0.07 && dist(lm[4], lm[12]) < 0.07 && dist(lm[4], lm[16]) < 0.07) {
    return 'Italian Chef Kiss / What?';
  }

  // OK Sign vs Pinch
  if (thumbIndexDist < 0.065) {
    if (middleExt && ringExt && pinkyExt) return 'OK Sign / Perfect';
    if (!middleExt && !ringExt && !pinkyExt) return 'Pinch / A Little Bit';
  }

  // Vulcan Salute
  if (indexExt && middleExt && ringExt && pinkyExt && indexMiddleDist < 0.05 && ringPinkyDist < 0.05 && middleRingDist > 0.08) {
    return 'Vulcan Salute / Live Long';
  }

  // Spider-Man vs I Love You
  if (thumbExt && indexExt && pinkyExt) {
    if (dist(lm[12], wrist) < dist(lm[10], wrist) && dist(lm[16], wrist) < dist(lm[14], wrist)) {
      return 'Spider-Man Web Slinger';
    }
    if (!middleExt && !ringExt) return 'I Love You';
  }

  // Call Me
  if (thumbExt && pinkyExt && !indexExt && !middleExt && !ringExt) {
    return 'Call Me / Phone';
  }

  // Fancy Pinky
  if (pinkyExt && !indexExt && !middleExt && !ringExt && !thumbExt) {
    return 'Fancy Pinky / Tea Time';
  }

  // Middle Finger / Anger
  if (middleExt && !indexExt && !ringExt && !pinkyExt) {
    return 'Middle Finger / Frustration';
  }

  // Quiet / Shh
  if (indexExt && !middleExt && !ringExt && !pinkyExt && lm[8].y < lm[6].y && Math.abs(lm[8].x - lm[6].x) < 0.08) {
    return 'Quiet / Shh / Silent';
  }

  // Gun Gesture vs Pointing
  if (indexExt && !middleExt && !ringExt && !pinkyExt) {
    if (thumbExt && thumbUp) return 'Gun Gesture / Pew Pew';
    return 'Pointing / Look There';
  }

  // Two Finger Point
  if (indexExt && middleExt && indexMiddleDist < 0.05 && !ringExt && !pinkyExt) {
    return 'Two-Finger Point';
  }

  // Peace / Victory
  if (indexExt && middleExt && !ringExt && !pinkyExt) {
    return 'Peace / Victory / Joy';
  }

  // Rock On
  if (indexExt && pinkyExt && !middleExt && !ringExt && !thumbExt) {
    return 'Rock On / Excitement / Party';
  }

  // Counting 3 & 4
  if (indexExt && middleExt && ringExt && !pinkyExt) return 'Number 3 / Trio';
  if (indexExt && middleExt && ringExt && pinkyExt && !thumbExt) return 'Number 4 / Four';

  // Open Palm vs Spread
  if (indexExt && middleExt && ringExt && pinkyExt && thumbExt) {
    if (indexMiddleDist > 0.08 && ringPinkyDist > 0.08) return 'Fingers Spread / High Five';
    return 'Open Palm / Hello / Wave';
  }

  // Flat Palm / Calm Down
  if (indexExt && middleExt && ringExt && pinkyExt && Math.abs(lm[8].y - lm[20].y) < 0.04) {
    return 'Flat Palm / Calm Down / Wait';
  }

  // Thumbs Up / Down / Fist
  if (!indexExt && !middleExt && !ringExt && !pinkyExt) {
    if (thumbUp && thumbExt) return 'Thumbs Up / Good / Like';
    if (thumbDown && thumbExt) return 'Thumbs Down / Bad / Dislike';
    return 'Fist / Punch / Anger';
  }

  // Claw
  if (!indexExt && !middleExt && !ringExt && !pinkyExt && dist(lm[8], wrist) > dist(lm[5], wrist)) {
    return 'Claw / Anger / Grab';
  }

  return '';
}

export default CameraView;
