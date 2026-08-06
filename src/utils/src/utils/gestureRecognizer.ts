import { Landmark, DetectionResult } from '../types';

export const detectGesture = (landmarks: Landmark[]): DetectionResult => {
  if (!landmarks || landmarks.length < 21) {
    return { gesture: 'No hand detected', confidence: 0 };
  }

  // Key landmark indices
  const thumbTip = landmarks[4];
  const thumbIp = landmarks[3];
  const indexTip = landmarks[8];
  const indexPip = landmarks[6];
  const middleTip = landmarks[12];
  const middlePip = landmarks[10];
  const ringTip = landmarks[16];
  const ringPip = landmarks[14];
  const pinkyTip = landmarks[20];
  const pinkyPip = landmarks[18];
  const wrist = landmarks[0];

  const isIndexExtended = indexTip.y < indexPip.y;
  const isMiddleExtended = middleTip.y < middlePip.y;
  const isRingExtended = ringTip.y < ringPip.y;
  const isPinkyExtended = pinkyTip.y < pinkyPip.y;
  const isThumbExtended = thumbTip.x < thumbIp.x; // Assumes right hand / standard front view

  // Logic mapping for basic signs
  if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) {
    return { gesture: 'Hello / Open Hand', confidence: 0.95 };
  }

  if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return { gesture: 'Peace / Victory', confidence: 0.92 };
  }

  if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return { gesture: 'Pointing / One', confidence: 0.90 };
  }

  if (isThumbExtended && isIndexExtended && isPinkyExtended && !isMiddleExtended && !isRingExtended) {
    return { gesture: 'I Love You', confidence: 0.94 };
  }

  if (thumbTip.y < indexPip.y && !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return { gesture: 'Thumbs Up / Yes', confidence: 0.93 };
  }

  if (thumbTip.y > wrist.y && !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return { gesture: 'Thumbs Down / No', confidence: 0.91 };
  }

  if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return { gesture: 'Fist / Letter A', confidence: 0.88 };
  }

  return { gesture: 'Translating...', confidence: 0.50 };
};
