import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import ProcessSection from './sections/ProcessSection';
import LiveSignalsSection from './sections/LiveSignalsSection';
import CaseStudiesSection from './sections/CaseStudiesSection';
import PhilosophySection from './sections/PhilosophySection';
import FinalCTASection from './sections/FinalCTASection';
import Navigation from './components/Navigation';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for all sections to mount before setting up global snap
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative bg-viralab-navy">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main content */}
      <main className="relative">
        <HeroSection />
        <ServicesSection />
        <ProcessSection />
        <LiveSignalsSection />
        <CaseStudiesSection />
        <PhilosophySection />
        <FinalCTASection />
      </main>

      {/* Simple Footer */}
      <footer className="relative bg-viralab-navy py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold text-white">VIRALAB</span>
              <span className="text-viralab-gray text-sm">© 2026</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#services" className="text-viralab-gray hover:text-white text-sm transition-colors">Services</a>
              <a href="#cases" className="text-viralab-gray hover:text-white text-sm transition-colors">Cases</a>
              <a href="#process" className="text-viralab-gray hover:text-white text-sm transition-colors">Process</a>
              <a href="/start" className="text-[#FF2D8F] hover:text-white text-sm transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-viralab-gray/40 text-xs">
              Built with 🔬 in the Lab. Designed to spread.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
