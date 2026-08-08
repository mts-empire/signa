import React from 'react';

export function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Real-Time Video Stream',
      description: 'Your web camera feeds live frames directly into the browser memory without transmitting video to any external server.'
    },
    {
      step: '02',
      title: '3D Mesh Vector Detection',
      description: 'MediaPipe tracks 21 individual hand keypoints using Euclidean distance vectors, recognizing front and back palm poses.'
    },
    {
      step: '03',
      title: 'LLM Natural Language Output',
      description: 'Groq Llama 3.3 refines raw gesture tokens into complete spoken context and synthesizes natural audio output.'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Architecture
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            How Signa AI Processing Works
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, index) => (
            <div
              key={index}
              className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-xl relative hover:border-indigo-500/40 transition-all duration-300 group"
            >
              <div className="text-3xl font-black text-indigo-500/20 group-hover:text-indigo-400/40 transition-colors mb-4 font-mono">
                {item.step}
              </div>
              <h4 className="text-base font-bold text-slate-100 mb-2">
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
