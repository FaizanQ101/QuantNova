import { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ResultsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for mobile and reduced motion
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const checkMotion = () => setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    checkMobile();
    checkMotion();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Entrance animation
  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      gsap.set([textBlockRef.current, imageCardRef.current, bgRef.current], { opacity: 1, x: 0, scale: 1 });
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Simple entrance animation for mobile, pinned for desktop
      if (isMobile) {
        gsap.fromTo(
          [textBlockRef.current, imageCardRef.current],
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
        gsap.set(bgRef.current, { opacity: 0.5 });
      } else {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=130%',
            pin: true,
            scrub: 0.6,
          },
        });

        // ENTRANCE (0% - 30%)
        scrollTl.fromTo(
          textBlockRef.current,
          { x: '-60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0
        );

        scrollTl.fromTo(
          imageCardRef.current,
          { x: '60vw', opacity: 0, scale: 0.96 },
          { x: 0, opacity: 1, scale: 1, ease: 'none' },
          0
        );

        scrollTl.fromTo(
          bgRef.current,
          { opacity: 0 },
          { opacity: 1, ease: 'none' },
          0
        );

        // EXIT (70% - 100%)
        scrollTl.fromTo(
          textBlockRef.current,
          { x: 0, opacity: 1 },
          { x: '-18vw', opacity: 0.25, ease: 'power2.in' },
          0.7
        );

        scrollTl.fromTo(
          imageCardRef.current,
          { x: 0, opacity: 1 },
          { x: '18vw', opacity: 0.25, ease: 'power2.in' },
          0.7
        );

        scrollTl.fromTo(
          bgRef.current,
          { scale: 1, opacity: 1 },
          { scale: 1.08, opacity: 0.6, ease: 'power2.in' },
          0.8
        );
      }
    }, section);

    return () => ctx.revert();
  }, [isMobile, prefersReducedMotion]);

  const scrollToWork = () => {
    const element = document.querySelector('#work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`relative w-full ${isMobile ? 'min-h-auto py-20' : 'h-screen'} overflow-hidden flex items-center justify-center`}
    >
      {/* Background Image - Subtle on mobile */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: isMobile ? 0.3 : 0 }}
      >
        <img
          src="/images/hero_city_bg.jpg"
          alt="City background"
          className="w-full h-full object-cover object-[70%_center]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/90 to-[#070B14]/70" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex items-center px-4 sm:px-6 lg:px-[7vw]">
        {/* Text Block */}
        <div
          ref={textBlockRef}
          className={`${
            isMobile
              ? 'relative w-full text-center px-2 order-2'
              : 'absolute left-[7vw] top-[26vh] w-[38vw] max-w-[560px]'
          }`}
          style={{ opacity: prefersReducedMotion ? 1 : isMobile ? 0 : 0 }}
        >
          <span className="eyebrow block mb-3 sm:mb-4">RESULTS</span>
          <h2 className="text-[clamp(28px,6vw,52px)] sm:text-[clamp(32px,3.6vw,52px)] font-bold text-[#F4F6FF] leading-[1.0] mb-4 sm:mb-6">
            Faster decisions.
            <br />
            <span className="text-gradient">Lower risk.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#A7B1D8] leading-relaxed mb-6 sm:mb-8 max-w-[46ch] mx-auto lg:mx-0">
            From forecasting pipelines to intelligent interfaces, we ship systems
            that reduce noise and increase velocity—without adding headcount.
          </p>
          <button
            onClick={scrollToWork}
            className="inline-flex items-center gap-1 text-[#4F6DFF] hover:text-[#8B9FFF] transition-colors text-sm sm:text-base"
          >
            Explore case studies
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Image Card - Stacked on mobile */}
        <div
          ref={imageCardRef}
          className={`${
            isMobile
              ? 'relative w-full max-w-md mx-auto mb-8 rounded-2xl h-[300px] order-1'
              : 'absolute left-[54vw] top-[22vh] w-[39vw] h-[56vh] max-w-[560px] max-h-[520px] rounded-[28px]'
          } overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.45)] gpu-accelerate`}
          style={{ opacity: prefersReducedMotion ? 1 : isMobile ? 0 : 0 }}
        >
          <img
            src="/images/results_card.jpg"
            alt="Results"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/60 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
