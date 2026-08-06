export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export interface DetectionResult {
  gesture: string;
  confidence: number;
}

export interface HistoryItem {
  id: string;
  text: string;
  timestamp: string;
}

// Global window declarations for MediaPipe CDN scripts
declare global {
  interface Window {
    Hands: any;
    Camera: any;
    drawLandmarks: any;
    drawConnectors: any;
    HAND_CONNECTIONS: any;
  }
}
