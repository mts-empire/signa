export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-900">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-800">
          <div className="text-2xl font-bold text-indigo-400 mb-2">01</div>
          <h4 className="font-bold mb-2">Show Gesture</h4>
          <p className="text-slate-400 text-sm">Make any of the 25 standard daily hand gestures in front of the camera.</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-800">
          <div className="text-2xl font-bold text-indigo-400 mb-2">02</div>
          <h4 className="font-bold mb-2">Groq AI Translation</h4>
          <p className="text-slate-400 text-sm">The engine identifies the gesture and Groq converts it into a full sentence.</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-800">
          <div className="text-2xl font-bold text-indigo-400 mb-2">03</div>
          <h4 className="font-bold mb-2">Voice Synthesis</h4>
          <p className="text-slate-400 text-sm">The system speaks the sentence aloud in real time.</p>
        </div>
      </div>
    </section>
  );
}
