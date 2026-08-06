import React from 'react';
import { History, Clock } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryLogProps {
  history: HistoryItem[];
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ history }) => {
  return (
    <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center space-x-2 mb-4">
        <History className="w-5 h-5 text-blue-400" />
        <h2 className="text-sm font-bold text-slate-200 tracking-wide">Translation History</h2>
      </div>

      {history.length === 0 ? (
        <p className="text-xs text-slate-500 italic">No saved translations yet.</p>
      ) : (
        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
          {history.map((item) => (
            <div key={item.id} className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl text-xs space-y-1">
              <p className="text-slate-200 font-medium">{item.text}</p>
              <div className="flex items-center space-x-1 text-[10px] text-slate-500">
                <Clock className="w-3 h-3" />
                <span>{item.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
