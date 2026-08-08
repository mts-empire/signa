import React from 'react';
import { HistoryItem } from '../types';

interface HistoryLogProps {
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
}

export default function HistoryLog({ history, setHistory }: HistoryLogProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Translation History Log
        </h3>
        {history.length > 0 && (
          <button
            onClick={() => setHistory([])}
            className="text-xs text-rose-400 hover:text-rose-300 transition"
          >
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-slate-500 text-xs italic py-3 text-center bg-slate-950/40 rounded-xl border border-slate-900">
          No previous gestures logged. When a new gesture is detected, the old one will shift here automatically.
        </p>
      ) : (
        <div className="space-y-2.5 max-h-52 overflow-y-auto pr-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 px-2 py-1 rounded border border-indigo-800/60">
                  {item.text}
                </span>
                {item.sentence && (
                  <span className="text-sm text-slate-300">
                    "{item.sentence}"
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-500 shrink-0">
                {item.timestamp}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
