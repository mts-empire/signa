import React from 'react';

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800/50">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[200px] bg-purple-600/15 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md animate-bounce">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          Sub-100ms Hand Landmark AI Vision
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-300 leading-tight">
          Translating Hand Gestures into Speech in Real Time
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Signa AI bridges accessibility gaps using high-speed MediaPipe 3D coordinate vision and Groq Llama 3.3 language models for accurate, natural conversation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => scrollToSection('translator')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 hover:opacity-90 hover:scale-[1.02] transition-all"
          >
            Launch Live Translator
          </button>
          <button
            onClick={() => scrollToSection('cheatsheet')}
            className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-xs hover:bg-slate-800 hover:border-slate-700 transition-all"
          >
            View 26 Gestures Cheatsheet
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
