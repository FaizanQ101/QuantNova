import { useRef, useLayoutEffect } from 'react';
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

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation with stagger
      const cards = cardsRef.current?.querySelectorAll('.capability-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="section-flowing z-[103] bg-[#0B1220] py-[10vh] px-[7vw]"
    >
      {/* Header */}
      <div ref={headerRef} className="max-w-[46vw] mb-12" style={{ opacity: 0 }}>
        <span className="eyebrow block mb-4">CAPABILITIES</span>
        <h2 className="text-[clamp(32px,3.6vw,52px)] font-bold text-[#F4F6FF] leading-[1.0] mb-4">
          Strategy, systems, and interfaces.
        </h2>
        <p className="text-lg text-[#A7B1D8] leading-relaxed max-w-[50ch]">
          End-to-end support—from first principles to production.
        </p>
      </div>

      {/* Cards Grid */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
      >
        {capabilities.map((cap, index) => (
          <div
            key={index}
            className="capability-card glass-card p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(79,109,255,0.35)] group"
            style={{ opacity: 0 }}
          >
            <div className="w-12 h-12 rounded-xl bg-[rgba(79,109,255,0.15)] flex items-center justify-center mb-6 group-hover:bg-[rgba(79,109,255,0.25)] transition-colors">
              <cap.icon className="w-6 h-6 text-[#4F6DFF]" />
            </div>
            <h3 className="text-xl font-semibold text-[#F4F6FF] mb-3">
              {cap.title}
            </h3>
            <p className="text-[#A7B1D8] leading-relaxed">{cap.description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12">
        <button className="btn-secondary">
          <Download size={18} />
          Download capabilities (PDF)
        </button>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
