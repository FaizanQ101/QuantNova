import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  // Auto-play entrance animation on load
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Background entrance
      tl.fromTo(
        bgRef.current,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 0.9 },
        0
      );

      // Text block entrance
      tl.fromTo(
        textBlockRef.current?.querySelectorAll('.reveal-item') || [],
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
        0.2
      );

      // Image card entrance
      tl.fromTo(
        imageCardRef.current,
        { x: '10vw', opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, duration: 0.85 },
        0.3
      );

      // Bokeh orbs entrance
      tl.fromTo(
        [orb1Ref.current, orb2Ref.current, orb3Ref.current],
        { opacity: 0 },
        { opacity: 0.35, duration: 0.6, stagger: 0.1 },
        0.5
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven animation (pinned)
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset all elements to visible when scrolling back to top
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
  }, []);

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
      className="section-pinned z-[100] flex items-center justify-center"
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0 }}
      >
        <img
          src="/images/hero_city_bg.jpg"
          alt="City background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/80 to-transparent" />
        <div className="absolute inset-0 bg-[#070B14]/40" />
      </div>

      {/* Bokeh Orbs */}
      <div
        ref={orb1Ref}
        className="bokeh-orb w-[300px] h-[300px] left-[45vw] top-[15vh] animate-drift"
        style={{ opacity: 0 }}
      />
      <div
        ref={orb2Ref}
        className="bokeh-orb w-[200px] h-[200px] left-[70vw] top-[60vh] animate-drift-slow"
        style={{ opacity: 0 }}
      />
      <div
        ref={orb3Ref}
        className="bokeh-orb w-[150px] h-[150px] left-[50vw] top-[70vh] animate-drift-slower"
        style={{ opacity: 0 }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex items-center">
        {/* Text Block (Left) */}
        <div
          ref={textBlockRef}
          className="absolute left-[7vw] top-[26vh] w-[38vw] max-w-[600px]"
        >
          <span className="eyebrow reveal-item block mb-4">QUANTNOVA</span>
          <h1 className="reveal-item text-[clamp(40px,4.5vw,72px)] font-bold text-[#F4F6FF] leading-[0.95] mb-6">
            Intelligence,
            <br />
            <span className="text-gradient">engineered for results.</span>
          </h1>
          <p className="reveal-item text-lg text-[#A7B1D8] leading-relaxed mb-8 max-w-[42ch]">
            We design systems that think, adapt, and ship—so your teams can move
            faster with confidence.
          </p>
          <div className="reveal-item flex flex-wrap items-center gap-4">
            <button onClick={scrollToContact} className="btn-primary">
              Book a discovery call
              <ArrowRight size={18} />
            </button>
            <button
              onClick={scrollToWork}
              className="inline-flex items-center gap-1 text-[#A7B1D8] hover:text-[#4F6DFF] transition-colors"
            >
              View selected work
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Image Card (Right) */}
        <div
          ref={imageCardRef}
          className="absolute left-[54vw] top-[22vh] w-[39vw] h-[56vh] max-w-[560px] max-h-[520px] rounded-[28px] overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
          style={{ opacity: 0 }}
        >
          <img
            src="/images/hero_ai_card.jpg"
            alt="AI Technology"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/60 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
