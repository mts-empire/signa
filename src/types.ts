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
