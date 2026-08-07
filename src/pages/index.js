import Header from '../components/Header';
import Hero from '../components/Hero';
import GestureTool from '../components/GestureTool';
import About from '../components/About';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-indigo-500 selection:text-white">
      <Header />
      <main>
        <Hero />
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <GestureTool />
        </section>
        <About />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
