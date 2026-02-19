import { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, TrendingDown, Clock, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const caseStudies = [
  {
    image: '/images/case_study_1.jpg',
    title: 'Demand Forecasting Platform',
    industry: 'Retail',
    result: 'Reduced overstock by 23% in 90 days',
    icon: TrendingDown,
  },
  {
    image: '/images/case_study_2.jpg',
    title: 'Customer Support Copilot',
    industry: 'SaaS',
    result: 'Cut ticket resolution time by 40%',
    icon: Clock,
  },
  {
    image: '/images/case_study_3.jpg',
    title: 'Risk Scoring Dashboard',
    industry: 'Fintech',
    result: 'Sub-second decisions with full explainability',
    icon: Shield,
  },
];

const CaseStudiesSection = () => {
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
      gsap.set([headerRef.current, cardsRef.current?.querySelectorAll('.case-card') || []], { opacity: 1, y: 0 });
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

      // Cards animation
      const cards = cardsRef.current?.querySelectorAll('.case-card');
      if (cards) {
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          // Simplified parallax for desktop
          if (window.innerWidth >= 1024) {
            const img = card.querySelector('.card-image');
            if (img) {
              gsap.fromTo(
                img,
                { y: -8 },
                {
                  y: 8,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                  },
                }
              );
            }
          }
        });
      }
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative z-[4] bg-[#070B14] py-16 sm:py-20 lg:py-[10vh] px-4 sm:px-6 lg:px-[7vw]"
    >
      {/* Header */}
      <div ref={headerRef} className="max-w-full lg:max-w-[52vw] mb-8 sm:mb-12" style={{ opacity: 0 }}>
        <span className="eyebrow block mb-3 sm:mb-4">SELECTED WORK</span>
        <h2 className="text-[clamp(26px,5vw,52px)] sm:text-[clamp(32px,3.6vw,52px)] font-bold text-[#F4F6FF] leading-[1.0] mb-3 sm:mb-4">
          Systems we've shipped.
        </h2>
      </div>

      {/* Case Study Cards */}
      <div ref={cardsRef} className="flex flex-col gap-6 sm:gap-8">
        {caseStudies.map((study, index) => (
          <div
            key={index}
            className="case-card relative h-[350px] sm:h-[45vh] sm:min-h-[400px] sm:max-h-[500px] rounded-2xl sm:rounded-[28px] overflow-hidden group cursor-pointer touch-pan-y"
            style={{ opacity: 0 }}
          >
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={study.image}
                alt={study.title}
                className="card-image w-full h-[calc(100%+16px)] sm:h-[calc(100%+24px)] object-cover transition-transform duration-500 group-hover:scale-105 gpu-accelerate"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/60 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
              <div className="glass-panel inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 mb-3 sm:mb-4">
                <study.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#4F6DFF]" />
                <span className="text-xs sm:text-sm font-medium text-[#F4F6FF] truncate max-w-[200px] sm:max-w-none">
                  {study.result}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex-1 min-w-0">
                  <span className="eyebrow block mb-1 sm:mb-2">{study.industry}</span>
                  <h3 className="text-lg sm:text-2xl lg:text-3xl font-semibold text-[#F4F6FF] truncate">
                    {study.title}
                  </h3>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#4F6DFF] flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 ml-4">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 sm:mt-12">
        <button onClick={scrollToContact} className="btn-secondary w-full sm:w-auto">
          Request a portfolio walkthrough
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
