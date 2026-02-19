import { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, Brain, Layout, Code } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  {
    icon: Brain,
    title: 'AI Strategy & Roadmapping',
    description: 'Define the right bets, data needs, and rollout plan.',
  },
  {
    icon: Layout,
    title: 'Intelligent Product Design',
    description: 'Interfaces that make complex models feel simple.',
  },
  {
    icon: Code,
    title: 'ML Engineering & Integration',
    description: 'Reliable pipelines, monitoring, and shipping discipline.',
  },
];

const CapabilitiesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMotion = () => setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    checkMotion();
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      gsap.set([headerRef.current, cardsRef.current?.querySelectorAll('.capability-card') || []], { opacity: 1, y: 0 });
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation with stagger
      const cards = cardsRef.current?.querySelectorAll('.capability-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative z-[3] bg-[#0B1220] py-16 sm:py-20 lg:py-[10vh] px-4 sm:px-6 lg:px-[7vw]"
    >
      {/* Header */}
      <div ref={headerRef} className="max-w-full lg:max-w-[46vw] mb-10 sm:mb-12" style={{ opacity: 0 }}>
        <span className="eyebrow block mb-3 sm:mb-4">CAPABILITIES</span>
        <h2 className="text-[clamp(26px,5vw,52px)] sm:text-[clamp(32px,3.6vw,52px)] font-bold text-[#F4F6FF] leading-[1.0] mb-3 sm:mb-4">
          Strategy, systems, and interfaces.
        </h2>
        <p className="text-base sm:text-lg text-[#A7B1D8] leading-relaxed max-w-[50ch]">
          End-to-end support—from first principles to production.
        </p>
      </div>

      {/* Cards Grid */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
      >
        {capabilities.map((cap, index) => (
          <div
            key={index}
            className="capability-card glass-card p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(79,109,255,0.35)] group touch-pan-y"
            style={{ opacity: 0 }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[rgba(79,109,255,0.15)] flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[rgba(79,109,255,0.25)] transition-colors">
              <cap.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#4F6DFF]" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-[#F4F6FF] mb-2 sm:mb-3">
              {cap.title}
            </h3>
            <p className="text-sm sm:text-base text-[#A7B1D8] leading-relaxed">{cap.description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 sm:mt-12">
        <button className="btn-secondary w-full sm:w-auto">
          <Download size={18} />
          Download capabilities (PDF)
        </button>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
