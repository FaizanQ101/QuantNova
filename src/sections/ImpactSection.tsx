import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { value: 99.97, suffix: '%', label: 'Production systems', sublabel: 'uptime' },
  { value: 120, suffix: 'ms', label: 'Average inference', sublabel: 'response' },
  { value: 3, suffix: '×', label: 'Time-to-decision', sublabel: 'vs. baseline' },
];

const AnimatedNumber = ({
  value,
  suffix,
  isVisible,
}: {
  value: number;
  suffix: string;
  isVisible: boolean;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (value - startValue) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, isVisible]);

  const formatValue = () => {
    if (value < 10) return displayValue.toFixed(0);
    if (value >= 100) return displayValue.toFixed(2);
    return displayValue.toFixed(0);
  };

  return (
    <span>
      {suffix === '×' ? formatValue() : suffix === 'ms' ? '<' + formatValue() : formatValue()}
      {suffix}
    </span>
  );
};

const ImpactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const [metricsVisible, setMetricsVisible] = useState(false);

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

      // Metrics animation
      gsap.fromTo(
        metricsRef.current?.querySelectorAll('.metric-item') || [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: metricsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
            onEnter: () => setMetricsVisible(true),
          },
        }
      );

      // Testimonial animation
      gsap.fromTo(
        testimonialRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: testimonialRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-flowing z-[106] bg-[#0B1220] py-[10vh] px-[7vw]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left Column - Metrics */}
        <div>
          {/* Header */}
          <div ref={headerRef} className="mb-10" style={{ opacity: 0 }}>
            <span className="eyebrow block mb-4">IMPACT</span>
            <h2 className="text-[clamp(32px,3.6vw,52px)] font-bold text-[#F4F6FF] leading-[1.0]">
              Built for reliability.
            </h2>
          </div>

          {/* Metrics */}
          <div ref={metricsRef} className="space-y-8">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="metric-item flex items-baseline gap-4"
                style={{ opacity: 0 }}
              >
                <span className="text-[clamp(48px,5vw,72px)] font-bold text-[#4F6DFF] leading-none">
                  <AnimatedNumber
                    value={metric.value}
                    suffix={metric.suffix}
                    isVisible={metricsVisible}
                  />
                </span>
                <div className="flex flex-col">
                  <span className="text-[#A7B1D8] text-sm">{metric.label}</span>
                  <span className="text-[#F4F6FF] font-medium">
                    {metric.sublabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Testimonial */}
        <div
          ref={testimonialRef}
          className="glass-panel p-8 lg:p-10 flex flex-col justify-center"
          style={{ opacity: 0 }}
        >
          <Quote className="w-10 h-10 text-[#4F6DFF] mb-6" />
          <blockquote className="text-xl lg:text-2xl text-[#F4F6FF] leading-relaxed mb-8">
            "QuantNova turned a messy prototype into a production-grade
            forecasting tool in weeks—not months."
          </blockquote>
          <div className="flex items-center gap-4">
            <img
              src="/images/testimonial_avatar.jpg"
              alt="Elena Voss"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-[#F4F6FF]">Elena Voss</p>
              <p className="text-sm text-[#A7B1D8]">VP Product, Northpeak</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
