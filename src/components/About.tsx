import React from 'react';

export function About() {
  return (
    <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Mission & Engine
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            About Signa AI
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-2xl backdrop-blur-xl space-y-4">
            <h4 className="text-xl font-bold text-indigo-300">
              Inclusive Communication via Browser Vision
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Signa AI is designed to eliminate technical barriers in sign language translation. By combining low-latency computer vision algorithms with ultra-fast LLM inference, it delivers speech synthesis directly inside your modern browser without complex hardware setups.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              The platform accurately differentiates 26 unique sign gestures across anger, happiness, direction, numbers, and affection states.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-2">
              <span className="text-2xl font-black text-indigo-400">26+</span>
              <h5 className="text-xs font-bold text-slate-200">Supported Gestures</h5>
              <p className="text-[11px] text-slate-500">Comprehensive gesture array</p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-2">
              <span className="text-2xl font-black text-emerald-400">&lt;100ms</span>
              <h5 className="text-xs font-bold text-slate-200">Inference Delay</h5>
              <p className="text-[11px] text-slate-500">Sub-second local mesh parsing</p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-2">
              <span className="text-2xl font-black text-purple-400">100%</span>
              <h5 className="text-xs font-bold text-slate-200">Private Stream</h5>
              <p className="text-[11px] text-slate-500">Camera frames stay on client</p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-2">
              <span className="text-2xl font-black text-cyan-400">3D Vector</span>
              <h5 className="text-xs font-bold text-slate-200">Dual-Angle Tracking</h5>
              <p className="text-[11px] text-slate-500">Front & back palm support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
