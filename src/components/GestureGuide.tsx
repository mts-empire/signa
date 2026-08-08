import React from 'react';

const gestureCategories = [
  {
    category: '😡 Anger & Intensity',
    items: ['Fist / Punch / Anger', 'Claw / Anger / Grab', 'Middle Finger / Frustration', 'Flat Palm / Calm Down / Wait']
  },
  {
    category: '😊 Happiness & Celebration',
    items: ['Open Palm / Hello / Wave', 'Thumbs Up / Good / Like', 'Peace / Victory / Joy', 'Rock On / Excitement / Party', 'Fingers Spread / High Five']
  },
  {
    category: '❤️ Love & Affection',
    items: ['I Love You', 'Spider-Man Web Slinger', 'OK Sign / Perfect']
  },
  {
    category: '👈 Indication & Direction',
    items: ['Pointing / Look There', 'Two-Finger Point', 'Gun Gesture / Pew Pew', 'Quiet / Shh / Silent']
  },
  {
    category: '💬 Everyday & Numbers',
    items: ['Call Me / Phone', 'Italian Chef Kiss / What?', 'Pinch / A Little Bit', 'Fancy Pinky / Tea Time', 'Thumbs Down / Dislike', 'Vulcan Salute', 'Number 3 / Trio', 'Number 4 / Four']
  }
];

export function GestureGuide() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
      <h3 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
        <span>🖐️</span> Supported Gestures Cheatsheet (26 Gestures)
      </h3>
      <p className="text-xs text-slate-400 mb-6">
        Perform any gesture below in front of the camera (works from both front and back palm angles).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gestureCategories.map((cat, idx) => (
          <div key={idx} className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">
              {cat.category}
            </h4>
            <ul className="space-y-1.5">
              {cat.items.map((item, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GestureGuide;
