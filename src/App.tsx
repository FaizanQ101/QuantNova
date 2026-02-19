import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './components/Navigation';
import Chatbot from './components/Chatbot';
import HeroSection from './sections/HeroSection';
import ApproachSection from './sections/ApproachSection';
import ResultsSection from './sections/ResultsSection';
import CapabilitiesSection from './sections/CapabilitiesSection';
import CaseStudiesSection from './sections/CaseStudiesSection';
import ProcessSection from './sections/ProcessSection';
import ImpactSection from './sections/ImpactSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for conditional snap behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Global snap scroll - DISABLED on mobile for better UX
  useEffect(() => {
    if (isMobile) return; // Skip snap on mobile

    // Wait for all sections to mount and create their ScrollTriggers
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter((st) => st.vars.pin)
        .sort((a, b) => a.start - b.start);

      const maxScroll = ScrollTrigger.maxScroll(window);

      if (!maxScroll || pinned.length === 0) return;

      // Build pinned ranges and snap targets from actual ScrollTriggers
      const pinnedRanges = pinned.map((st) => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center:
          (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      // Create global snap with reduced intensity for smoother feel
      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            // Check if within any pinned range (with small buffer)
            const inPinned = pinnedRanges.some(
              (r) => value >= r.start - 0.03 && value <= r.end + 0.03
            );

            if (!inPinned) return value; // flowing section: free scroll

            // Find nearest pinned center
            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );

            return target;
          },
          duration: { min: 0.1, max: 0.25 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [isMobile]);

  // Cleanup all ScrollTriggers on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <>
      {/* Grain Overlay - hidden on mobile */}
      <div className="grain-overlay hidden sm:block" />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main ref={mainRef} className="relative">
        {/* Pinned Sections - disabled on mobile */}
        <HeroSection />
        <ApproachSection />
        <ResultsSection />

        {/* Flowing Sections */}
        <CapabilitiesSection />
        <CaseStudiesSection />
        <ProcessSection />
        <ImpactSection />
        <ContactSection />
        <Footer />
      </main>

      {/* Chatbot */}
      <Chatbot />
    </>
  );
}

export default App;
