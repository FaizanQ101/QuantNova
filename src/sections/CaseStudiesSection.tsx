import { useRef, useLayoutEffect } from 'react';
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

      // Cards animation
      const cards = cardsRef.current?.querySelectorAll('.case-card');
      if (cards) {
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { y: 80, opacity: 0, scale: 0.98 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          // Parallax for image inside card
          const img = card.querySelector('.card-image');
          if (img) {
            gsap.fromTo(
              img,
              { y: -12 },
              {
                y: 12,
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
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

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
      className="section-flowing z-[104] bg-[#070B14] py-[10vh] px-[7vw]"
    >
      {/* Header */}
      <div ref={headerRef} className="max-w-[52vw] mb-12" style={{ opacity: 0 }}>
        <span className="eyebrow block mb-4">SELECTED WORK</span>
        <h2 className="text-[clamp(32px,3.6vw,52px)] font-bold text-[#F4F6FF] leading-[1.0] mb-4">
          Systems we've shipped.
        </h2>
      </div>

      {/* Case Study Cards */}
      <div ref={cardsRef} className="flex flex-col gap-8">
        {caseStudies.map((study, index) => (
          <div
            key={index}
            className="case-card relative h-[50vh] min-h-[400px] max-h-[500px] rounded-[28px] overflow-hidden group cursor-pointer transition-transform duration-300 hover:-translate-y-2"
            style={{ opacity: 0 }}
          >
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={study.image}
                alt={study.title}
                className="card-image w-full h-[calc(100%+24px)] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/50 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="glass-panel inline-flex items-center gap-3 px-4 py-3 mb-4">
                <study.icon className="w-5 h-5 text-[#4F6DFF]" />
                <span className="text-sm font-medium text-[#F4F6FF]">
                  {study.result}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="eyebrow block mb-2">{study.industry}</span>
                  <h3 className="text-2xl md:text-3xl font-semibold text-[#F4F6FF]">
                    {study.title}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#4F6DFF] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12">
        <button onClick={scrollToContact} className="btn-secondary">
          Request a portfolio walkthrough
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
