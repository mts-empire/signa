import { Landmark } from '../types';

export function classifyGesture(landmarks: Landmark[]): string {
  if (!landmarks || landmarks.length < 21) return 'Searching for hand...';

  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const indexMcp = landmarks[5];
  const middleTip = landmarks[12];
  const middleMcp = landmarks[9];
  const ringTip = landmarks[16];
  const ringMcp = landmarks[13];
  const pinkyTip = landmarks[20];
  const pinkyMcp = landmarks[17];

  // Calculate Euclidean Distance between 2 3D points
  const dist = (p1: Landmark, p2: Landmark) =>
    Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow((p1.z || 0) - (p2.z || 0), 2));

  // Determine relative finger extensions
  const isIndexExtended = dist(indexTip, wrist) > dist(indexMcp, wrist) * 1.3;
  const isMiddleExtended = dist(middleTip, wrist) > dist(middleMcp, wrist) * 1.3;
  const isRingExtended = dist(ringTip, wrist) > dist(ringMcp, wrist) * 1.3;
  const isPinkyExtended = dist(pinkyTip, wrist) > dist(pinkyMcp, wrist) * 1.3;

  // Thumb Extension & Distance
  const thumbIndexDist = dist(thumbTip, indexTip);
  const thumbWristDist = dist(thumbTip, wrist);

  // 1. Water / Drink / Mouth Gesture (Thumb towards face/mouth with fingers curled)
  if (thumbWristDist > 0.22 && !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    if (thumbTip.y < indexMcp.y) {
      return 'Water / Drink';
    }
  }

  // 2. OK Sign (Thumb & Index tip touching, other fingers open)
  if (thumbIndexDist < 0.06 && isMiddleExtended && isRingExtended && isPinkyExtended) {
    return 'OK Sign';
  }

  // 3. Hello / Open Palm (All 5 fingers fully extended)
  if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) {
    return 'Hello / Open Hand';
  }

  // 4. Thumbs Up (Good / Yes)
  if (thumbTip.y < indexMcp.y && !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return 'Thumbs Up (Yes / Good)';
  }

  // 5. Thumbs Down (No / Bad)
  if (thumbTip.y > wrist.y && !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return 'Thumbs Down (No)';
  }

  // 6. Peace / Victory (Two fingers)
  if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return 'Peace / Victory';
  }

  // 7. Pointing / You
  if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return 'Pointing / You';
  }

  // 8. I Love You (Thumb, Index, Pinky extended)
  if (isIndexExtended && !isMiddleExtended && !isRingExtended && isPinkyExtended) {
    return 'I Love You';
  }

  // 9. Call Me / Phone (Thumb and Pinky extended)
  if (!isIndexExtended && !isMiddleExtended && !isRingExtended && isPinkyExtended) {
    return 'Call Me';
  }

  // 10. Fist / Stop (All fingers closed)
  if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return 'Fist / Stop';
  }

  return 'Hand Detected';
}
