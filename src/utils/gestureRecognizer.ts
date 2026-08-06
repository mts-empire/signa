import { Landmark } from '../types';

export function classifyGesture(landmarks: Landmark[]): string {
  if (!landmarks || landmarks.length < 21) return 'Searching for hand...';

  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const indexPip = landmarks[6];
  const middleTip = landmarks[12];
  const middlePip = landmarks[10];
  const ringTip = landmarks[16];
  const ringPip = landmarks[14];
  const pinkyTip = landmarks[20];
  const pinkyPip = landmarks[18];

  const distance = (p1: Landmark, p2: Landmark) =>
    Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

  const isIndexExtended = indexTip.y < indexPip.y;
  const isMiddleExtended = middleTip.y < middlePip.y;
  const isRingExtended = ringTip.y < ringPip.y;
  const isPinkyExtended = pinkyTip.y < pinkyPip.y;

  // 1. Thumb-to-Mouth or Chin Gesture (Water / Drink / Hunger)
  const thumbToWristDist = distance(thumbTip, wrist);
  const indexToWristDist = distance(indexTip, wrist);
  if (
    thumbTip.y < wrist.y &&
    thumbToWristDist > 0.25 &&
    !isIndexExtended &&
    !isMiddleExtended &&
    !isRingExtended &&
    !isPinkyExtended
  ) {
    // If thumb is pointing towards the upper face/mouth while fingers are curled
    return 'Water / Drink';
  }

  // 2. Thumbs Up (Approval / Yes / Good)
  if (
    thumbTip.y < indexPip.y &&
    thumbTip.y < wrist.y &&
    !isIndexExtended &&
    !isMiddleExtended &&
    !isRingExtended &&
    !isPinkyExtended
  ) {
    return 'Thumbs Up (Good / Yes)';
  }

  // 3. Open Palm (Hello / Stop)
  if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) {
    return 'Hello / Open Hand';
  }

  // 4. Fist (No / Hold)
  if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return 'Fist (No / Stop)';
  }

  // 5. Peace / Victory (Two fingers up)
  if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return 'Peace / Victory';
  }

  // 6. Pointing Sign
  if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return 'Pointing / You';
  }

  // 7. "I Love You" Sign (Thumb, Index, Pinky extended)
  if (isIndexExtended && !isMiddleExtended && !isRingExtended && isPinkyExtended) {
    return 'I Love You';
  }

  return 'Hand Detected';
}
