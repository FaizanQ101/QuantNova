import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ResultsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

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
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToWork = () => {
    const element = document.querySelector('#work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="section-pinned z-[102] flex items-center justify-center"
    >
      {/* Background Image */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0 }}>
        <img
          src="/images/hero_city_bg.jpg"
          alt="City background"
          className="w-full h-full object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/80 to-transparent" />
        <div className="absolute inset-0 bg-[#070B14]/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex items-center">
        {/* Text Block (Left) */}
        <div
          ref={textBlockRef}
          className="absolute left-[7vw] top-[26vh] w-[38vw] max-w-[560px]"
          style={{ opacity: 0 }}
        >
          <span className="eyebrow block mb-4">RESULTS</span>
          <h2 className="text-[clamp(32px,3.6vw,52px)] font-bold text-[#F4F6FF] leading-[1.0] mb-6">
            Faster decisions.
            <br />
            <span className="text-gradient">Lower risk.</span>
          </h2>
          <p className="text-lg text-[#A7B1D8] leading-relaxed mb-8 max-w-[46ch]">
            From forecasting pipelines to intelligent interfaces, we ship systems
            that reduce noise and increase velocity—without adding headcount.
          </p>
          <button
            onClick={scrollToWork}
            className="inline-flex items-center gap-1 text-[#4F6DFF] hover:text-[#8B9FFF] transition-colors"
          >
            Explore case studies
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Image Card (Right) */}
        <div
          ref={imageCardRef}
          className="absolute left-[54vw] top-[22vh] w-[39vw] h-[56vh] max-w-[560px] max-h-[520px] rounded-[28px] overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
          style={{ opacity: 0 }}
        >
          <img
            src="/images/results_card.jpg"
            alt="Results"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/60 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
