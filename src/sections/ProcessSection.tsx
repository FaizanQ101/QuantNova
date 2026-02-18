import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Zap, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Discover',
    description: 'Map decisions, data, and constraints.',
  },
  {
    number: '02',
    icon: Zap,
    title: 'Prototype',
    description: 'Build the smallest useful system—fast.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Scale',
    description: 'Harden, integrate, and measure outcomes.',
  },
];

const ProcessSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

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

      // Steps animation with stagger
      const stepItems = stepsRef.current?.querySelectorAll('.step-item');
      const accentLines = stepsRef.current?.querySelectorAll('.accent-line');

      if (stepItems) {
        gsap.fromTo(
          stepItems,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stepsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (accentLines) {
        gsap.fromTo(
          accentLines,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stepsRef.current,
              start: 'top 70%',
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
      id="process"
      className="section-flowing z-[105] bg-[#070B14] py-[10vh] px-[7vw]"
    >
      {/* Header */}
      <div ref={headerRef} className="max-w-[46vw] mb-12" style={{ opacity: 0 }}>
        <span className="eyebrow block mb-4">PROCESS</span>
        <h2 className="text-[clamp(32px,3.6vw,52px)] font-bold text-[#F4F6FF] leading-[1.0] mb-4">
          From prototype to production.
        </h2>
        <p className="text-lg text-[#A7B1D8] leading-relaxed max-w-[50ch]">
          A clear rhythm: understand, validate, ship—then improve.
        </p>
      </div>

      {/* Steps Grid */}
      <div
        ref={stepsRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
      >
        {steps.map((step, index) => (
          <div key={index} className="relative flex">
            {/* Accent Line (except for last item) */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-full w-[calc(100%-2rem)] h-px">
                <div
                  className="accent-line absolute inset-0 bg-gradient-to-r from-[rgba(167,177,216,0.18)] to-transparent origin-left"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>
            )}

            <div className="step-item flex-1" style={{ opacity: 0 }}>
              {/* Number */}
              <span className="font-mono text-sm text-[#4F6DFF] mb-4 block">
                {step.number}
              </span>

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-[rgba(79,109,255,0.12)] flex items-center justify-center mb-5">
                <step.icon className="w-7 h-7 text-[#4F6DFF]" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-[#F4F6FF] mb-3">
                {step.title}
              </h3>
              <p className="text-[#A7B1D8] leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProcessSection;
