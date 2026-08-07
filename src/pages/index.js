import { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import GestureTool from '../components/GestureTool';
import About from '../components/About';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

export default function Home() {
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Header Section with Key Input */}
      <Header apiKey={apiKey} setApiKey={setApiKey} />

      <main>
        {/* 2. Hero Section */}
        <section id="hero">
          <Hero />
        </section>

        {/* 3. Actual Tool Section */}
        <section id="tool" className="py-16 px-4 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Live Vision Terminal</h2>
            <p className="text-slate-400 text-sm">
              Real-time gesture analysis powered by computer vision & Groq AI
            </p>
          </div>
          <GestureTool customApiKey={apiKey} />
        </section>

        {/* 4. About Section */}
        <section id="about">
          <About />
        </section>

        {/* 5. How It Works Section */}
        <section id="how-it-works">
          <HowItWorks />
        </section>
      </main>

      {/* 6. Footer Section */}
      <Footer />
    </div>
  );
}
