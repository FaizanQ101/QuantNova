import { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Twitter, Github } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMotion = () => setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    checkMotion();
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      gsap.set(footerRef.current?.querySelectorAll('.footer-item') || [], { opacity: 1, y: 0 });
      return;
    }

    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        footer.querySelectorAll('.footer-item'),
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, footer);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative z-[8] bg-[#070B14] py-12 sm:py-16 lg:py-[8vh] px-4 sm:px-6 lg:px-[7vw] border-t border-[rgba(167,177,216,0.08)]"
    >
      <div className="flex flex-col lg:flex-row justify-between gap-10 sm:gap-12 mb-10 sm:mb-12">
        {/* Logo & Tagline */}
        <div className="footer-item" style={{ opacity: 0 }}>
          <a
            href="#"
            className="font-['Sora'] text-xl sm:text-2xl font-bold text-[#F4F6FF] tracking-tight block mb-3"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            QuantNova
          </a>
          <p className="text-[#A7B1D8] text-sm sm:text-base max-w-[32ch]">
            Intelligence, engineered for results.
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-item" style={{ opacity: 0 }}>
          <span className="eyebrow block mb-3 sm:mb-4">NAVIGATION</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2 sm:gap-y-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-sm sm:text-base text-[#A7B1D8] hover:text-[#F4F6FF] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Social */}
        <div className="footer-item" style={{ opacity: 0 }}>
          <span className="eyebrow block mb-3 sm:mb-4">CONNECT</span>
          <div className="flex gap-3 sm:gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[rgba(167,177,216,0.1)] flex items-center justify-center text-[#A7B1D8] hover:bg-[#4F6DFF] hover:text-white transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[rgba(167,177,216,0.1)] flex items-center justify-center text-[#A7B1D8] hover:bg-[#4F6DFF] hover:text-white transition-all"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[rgba(167,177,216,0.1)] flex items-center justify-center text-[#A7B1D8] hover:bg-[#4F6DFF] hover:text-white transition-all"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-item pt-6 sm:pt-8 border-t border-[rgba(167,177,216,0.08)] flex flex-col sm:flex-row justify-between items-center gap-4" style={{ opacity: 0 }}>
        <p className="text-xs sm:text-sm text-[#A7B1D8] text-center sm:text-left">
          © 2026 QuantNova. All rights reserved.
        </p>
        <button className="text-xs sm:text-sm text-[#A7B1D8] hover:text-[#F4F6FF] transition-colors">
          Privacy Policy
        </button>
      </div>
    </footer>
  );
};

export default Footer;
