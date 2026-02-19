import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for mobile and reduced motion preference
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };

    const checkMotion = () => {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    checkMobile();
    checkMotion();

    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-play entrance animation on load
  useEffect(() => {
    if (prefersReducedMotion) {
      // Skip animations, show content immediately
      gsap.set([bgRef.current, textBlockRef.current, imageCardRef.current], {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Background entrance
      tl.fromTo(
        bgRef.current,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: isMobile ? 0.6 : 0.9 },
        0
      );

      // Text block entrance
      tl.fromTo(
        textBlockRef.current?.querySelectorAll('.reveal-item') || [],
        { y: isMobile ? 20 : 28, opacity: 0 },
        { y: 0, opacity: 1, duration: isMobile ? 0.5 : 0.7, stagger: isMobile ? 0.05 : 0.08 },
        isMobile ? 0.1 : 0.2
      );

      // Image card entrance - skip on mobile
      if (!isMobile) {
        tl.fromTo(
          imageCardRef.current,
          { x: '10vw', opacity: 0, scale: 0.98 },
          { x: 0, opacity: 1, scale: 1, duration: 0.85 },
          0.3
        );
      } else {
        gsap.set(imageCardRef.current, { opacity: 0, display: 'none' });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile, prefersReducedMotion]);

  // Scroll-driven animation (pinned) - DISABLED on mobile
  useLayoutEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: isMobile ? false : 0.6,
          onLeaveBack: () => {
            gsap.set(textBlockRef.current, { x: 0, opacity: 1 });
            gsap.set(imageCardRef.current, { x: 0, opacity: 1 });
            gsap.set(bgRef.current, { scale: 1, opacity: 1 });
          },
        },
      });

      // EXIT phase (70% - 100%)
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
    }, section);

    return () => ctx.revert();
  }, [isMobile, prefersReducedMotion]);

  const scrollToWork = () => {
    const element = document.querySelector('#work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full gpu-accelerate"
        style={{ opacity: prefersReducedMotion ? 1 : 0 }}
      >
        <img
          src="/images/hero_city_bg.jpg"
          alt="City background"
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/80 to-transparent" />
        <div className="absolute inset-0 bg-[#070B14]/40" />
      </div>

      {/* Content Container - Mobile Optimized */}
      <div className="relative z-10 w-full h-full flex items-center px-4 sm:px-6 lg:px-[7vw] py-20 sm:py-0">
        {/* Text Block */}
        <div
          ref={textBlockRef}
          className="w-full max-w-[600px] mx-auto lg:mx-0 lg:w-[38vw] text-center lg:text-left"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <span className="eyebrow reveal-item block mb-3 sm:mb-4">QUANTNOVA</span>
          <h1 className="reveal-item text-[clamp(32px,8vw,72px)] sm:text-[clamp(36px,5vw,72px)] font-bold text-[#F4F6FF] leading-[0.95] mb-4 sm:mb-6">
            Intelligence,
            <br />
            <span className="text-gradient">engineered for results.</span>
          </h1>
          <p className="reveal-item text-base sm:text-lg text-[#A7B1D8] leading-relaxed mb-6 sm:mb-8 max-w-[42ch] mx-auto lg:mx-0">
            We design systems that think, adapt, and ship—so your teams can move
            faster with confidence.
          </p>
          <div className="reveal-item flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <button onClick={scrollToContact} className="btn-primary w-full sm:w-auto">
              Book a discovery call
              <ArrowRight size={18} />
            </button>
            <button
              onClick={scrollToWork}
              className="inline-flex items-center justify-center gap-1 text-[#A7B1D8] hover:text-[#4F6DFF] transition-colors py-2"
            >
              View selected work
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Image Card - Hidden on mobile, shown on lg+ */}
        <div
          ref={imageCardRef}
          className="hidden lg:block absolute right-[7vw] top-1/2 -translate-y-1/2 w-[39vw] h-[56vh] max-w-[560px] max-h-[520px] rounded-[28px] overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.45)] gpu-accelerate"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <img
            src="/images/hero_ai_card.jpg"
            alt="AI Technology"
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/60 via-transparent to-transparent" />
        </div>
      </div>

      {/* Scroll indicator - subtle hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-6 h-10 rounded-full border-2 border-[#A7B1D8]/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#A7B1D8]/50" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
