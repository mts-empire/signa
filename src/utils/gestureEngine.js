// src/utils/gestureEngine.js

function calcDist(p1, p2) {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) +
    Math.pow(p1.y - p2.y, 2) +
    Math.pow(p1.z - p2.z, 2)
  );
}

export function classifyLandmarks(landmarks) {
  if (!landmarks || landmarks.length < 21) return "No hand detected";

  // Key Landmarks
  const wrist = landmarks[0];
  const thumbTip = landmarks[4], thumbMcp = landmarks[2];
  const indexTip = landmarks[8], indexMcp = landmarks[5], indexPip = landmarks[6];
  const middleTip = landmarks[12], middleMcp = landmarks[9], middlePip = landmarks[10];
  const ringTip = landmarks[16], ringMcp = landmarks[13];
  const pinkyTip = landmarks[20], pinkyMcp = landmarks[17];

  // Extension States
  const indexExt = indexTip.y < indexMcp.y;
  const middleExt = middleTip.y < middleMcp.y;
  const ringExt = ringTip.y < ringMcp.y;
  const pinkyExt = pinkyTip.y < pinkyMcp.y;
  const thumbExt = Math.abs(thumbTip.x - wrist.x) > 0.15;

  // Spatial Distances
  const thumbIndexDist = calcDist(thumbTip, indexTip);
  const thumbMiddleDist = calcDist(thumbTip, middleTip);

  // --- 25 GESTURE DETECTION LOGIC ---

  // 1. Quiet / Shh (Index on mouth level, others folded)
  if (indexExt && !middleExt && !ringExt && !pinkyExt && Math.abs(indexTip.x - wrist.x) < 0.05 && indexTip.y < wrist.y - 0.2) {
    return "Quiet";
  }

  // 2. OK Sign (Thumb and Index tips touch, others extended)
  if (thumbIndexDist < 0.05 && middleExt && ringExt && pinkyExt) {
    return "OK Sign";
  }

  // 3. Pinch Gesture (Thumb and Index close, others folded)
  if (thumbIndexDist < 0.06 && !middleExt && !ringExt && !pinkyExt) {
    return "Pinch";
  }

  // 4. Call Me (Thumb and Pinky extended, middle fingers folded)
  if (thumbExt && pinkyExt && !indexExt && !middleExt && !ringExt) {
    return "Call Me";
  }

  // 5. Pointing (Only index finger extended)
  if (indexExt && !middleExt && !ringExt && !pinkyExt) {
    return "Pointing";
  }

  // 6. Finger Wag (Index extended and tilted sideways)
  if (indexExt && !middleExt && !ringExt && !pinkyExt && Math.abs(indexTip.x - indexMcp.x) > 0.08) {
    return "Finger Wag";
  }

  // 7. Thumbs Up
  if (thumbTip.y < thumbMcp.y - 0.1 && !indexExt && !middleExt && !ringExt && !pinkyExt) {
    return "Thumbs Up";
  }

  // 8. Thumbs Down
  if (thumbTip.y > wrist.y + 0.05 && !indexExt && !middleExt && !ringExt && !pinkyExt) {
    return "Thumbs Down";
  }

  // 9. Drinking Water (Thumb tilted toward upper face/mouth level)
  if (thumbTip.y < indexMcp.y && thumbIndexDist < 0.08 && !ringExt && !pinkyExt) {
    return "Drinking Water";
  }

  // 10. Eating / Food (All fingertips gathered tightly)
  if (thumbIndexDist < 0.06 && thumbMiddleDist < 0.06 && !indexExt) {
    return "Eating Food";
  }

  // 11. Beckoning / Come Here (Index curved forward, others folded)
  if (indexTip.y > indexPip.y && indexExt && !middleExt && !ringExt) {
    return "Come Here";
  }

  // 12. Paying / Money (Thumb rubbing index fingertip)
  if (thumbIndexDist < 0.04 && Math.abs(thumbTip.y - indexTip.y) < 0.02) {
    return "Paying Money";
  }

  // 13. Fingers Crossed (Index and Middle crossed)
  if (indexExt && middleExt && Math.abs(indexTip.x - middleTip.x) < 0.02) {
    return "Fingers Crossed";
  }

  // 14. Air Quotes (Index and Middle semi-bent)
  if (indexExt && middleExt && !ringExt && !pinkyExt && indexTip.y > indexPip.y) {
    return "Air Quotes";
  }

  // 15. Finger Snap (Middle finger touching thumb base)
  if (thumbMiddleDist < 0.04 && indexExt) {
    return "Finger Snap";
  }

  // 16. Fist Bump (All fingers tightly folded)
  if (!indexExt && !middleExt && !ringExt && !pinkyExt && !thumbExt) {
    return "Fist Bump";
  }

  // 17. Stop / Halt (All fingers fully extended upward)
  if (indexExt && middleExt && ringExt && pinkyExt && thumbTip.y < indexMcp.y) {
    return "Stop";
  }

  // 18. Open Palm Wave (All fingers extended, palm open)
  if (indexExt && middleExt && ringExt && pinkyExt) {
    return "Open Palm Wave";
  }

  // 19. High Five (Hand raised high, open palm)
  if (indexExt && middleExt && ringExt && pinkyExt && wrist.y < 0.3) {
    return "High Five";
  }

  // 20. Hand Heart (Thumbs and index fingers touching)
  if (thumbIndexDist < 0.05 && calcDist(thumbTip, landmarks[4]) < 0.05) {
    return "Hand Heart";
  }

  // 21. Hand on Chest (Wrist near chest level, fingers flat)
  if (indexExt && middleExt && wrist.y > 0.6) {
    return "Hand on Chest";
  }

  // 22. Facepalm (Hand covering upper portion of frame)
  if (wrist.y < 0.2 && !indexExt) {
    return "Facepalm";
  }

  // 23. Palms Up Shrug (Open hand facing upward)
  if (indexExt && middleExt && thumbTip.x > indexTip.x) {
    return "Palms Up Shrug";
  }

  // 24. Clapping (Hand positioned horizontally center)
  if (indexExt && middleExt && Math.abs(wrist.x - 0.5) < 0.05) {
    return "Clapping";
  }

  // 25. Rubbing Hands (Hand angled inward)
  if (indexExt && middleExt && ringExt && !pinkyExt) {
    return "Rubbing Hands";
  }

  return "Analyzing Gesture...";
}
