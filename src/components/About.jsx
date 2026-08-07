export default function About() {
  return (
    <section id="about" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-900">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4">Architecture</h2>
        <p className="text-slate-400">Combines edge gesture recognition with Groq LLM processing.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <h3 className="text-lg font-bold mb-2 text-indigo-400">1. Spatial Math Engine</h3>
          <p className="text-slate-400 text-sm">Translates 21 3D joint landmarks into gesture classifications across 25 supported inputs.</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <h3 className="text-lg font-bold mb-2 text-violet-400">2. Groq Llama 3 Inference</h3>
          <p className="text-slate-400 text-sm">Converts discrete gesture words into contextually accurate natural spoken sentences.</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <h3 className="text-lg font-bold mb-2 text-pink-400">3. Web Speech Synthesis</h3>
          <p className="text-slate-400 text-sm">Reads the generated sentence aloud directly through the browser audio interface.</p>
        </div>
      </div>
    </section>
  );
}
