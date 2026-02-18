import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Twitter, Github } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        footer.querySelectorAll('.footer-item'),
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
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
  }, []);

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
      className="section-flowing z-[108] bg-[#070B14] py-[8vh] px-[7vw] border-t border-[rgba(167,177,216,0.08)]"
    >
      <div className="flex flex-col lg:flex-row justify-between gap-10 mb-12">
        {/* Logo & Tagline */}
        <div className="footer-item" style={{ opacity: 0 }}>
          <a
            href="#"
            className="font-['Sora'] text-2xl font-bold text-[#F4F6FF] tracking-tight block mb-3"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            QuantNova
          </a>
          <p className="text-[#A7B1D8] max-w-[32ch]">
            Intelligence, engineered for results.
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-item" style={{ opacity: 0 }}>
          <span className="eyebrow block mb-4">NAVIGATION</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-[#A7B1D8] hover:text-[#F4F6FF] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Social */}
        <div className="footer-item" style={{ opacity: 0 }}>
          <span className="eyebrow block mb-4">CONNECT</span>
          <div className="flex gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[rgba(167,177,216,0.1)] flex items-center justify-center text-[#A7B1D8] hover:bg-[#4F6DFF] hover:text-white transition-all"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[rgba(167,177,216,0.1)] flex items-center justify-center text-[#A7B1D8] hover:bg-[#4F6DFF] hover:text-white transition-all"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[rgba(167,177,216,0.1)] flex items-center justify-center text-[#A7B1D8] hover:bg-[#4F6DFF] hover:text-white transition-all"
            >
              <Github size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-item pt-8 border-t border-[rgba(167,177,216,0.08)] flex flex-col sm:flex-row justify-between items-center gap-4" style={{ opacity: 0 }}>
        <p className="text-sm text-[#A7B1D8]">
          © 2026 QuantNova. All rights reserved.
        </p>
        <button className="text-sm text-[#A7B1D8] hover:text-[#F4F6FF] transition-colors">
          Privacy Policy
        </button>
      </div>
    </footer>
  );
};

export default Footer;
