import { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase, FORM_SUBMISSIONS_TABLE } from '@/lib/supabase';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkMotion = () => setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    checkMotion();
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      gsap.set([textRef.current, formRef.current], { opacity: 1, x: 0, y: 0 });
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Text animation
      gsap.fromTo(
        textRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Form animation
      gsap.fromTo(
        formRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Submit to Supabase
      const { error: supabaseError } = await supabase
        .from(FORM_SUBMISSIONS_TABLE)
        .insert([
          {
            name: formData.name,
            email: formData.email,
            company: formData.company || null,
            message: formData.message,
            created_at: new Date().toISOString(),
          },
        ]);

      if (supabaseError) {
        throw supabaseError;
      }

      // Success - reset form and show success message
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to send message. Please try again or email us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-[7] bg-[#070B14] py-16 sm:py-20 lg:py-[10vh] px-4 sm:px-6 lg:px-[7vw]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16">
        {/* Left Column - Text */}
        <div ref={textRef} style={{ opacity: 0 }}>
          <span className="eyebrow block mb-3 sm:mb-4">CONTACT</span>
          <h2 className="text-[clamp(28px,6vw,52px)] sm:text-[clamp(32px,3.6vw,52px)] font-bold text-[#F4F6FF] leading-[1.0] mb-4 sm:mb-6">
            Let's build something{' '}
            <span className="text-gradient">precise.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#A7B1D8] leading-relaxed mb-6 sm:mb-8 max-w-[42ch]">
            Tell us what you're shipping. We'll reply within 2 business days.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-[#A7B1D8]">
            <Mail className="w-5 h-5 text-[#4F6DFF] flex-shrink-0" />
            <div className="flex flex-wrap items-center gap-2">
              <span>Or email:</span>
              <a
                href="mailto:hello@quantnova.studio"
                className="text-[#F4F6FF] hover:text-[#4F6DFF] transition-colors"
              >
                hello@quantnova.studio
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div ref={formRef} style={{ opacity: 0 }}>
          {isSubmitted ? (
            <div className="glass-panel p-8 sm:p-10 text-center">
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-[#4F6DFF] mx-auto mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-semibold text-[#F4F6FF] mb-3">
                Message sent!
              </h3>
              <p className="text-[#A7B1D8] text-sm sm:text-base">
                Thank you for reaching out. We'll get back to you within 2
                business days.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="glass-panel p-6 sm:p-8 lg:p-10 space-y-5 sm:space-y-6"
            >
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#A7B1D8] text-sm sm:text-base">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-[rgba(7,11,20,0.6)] border-[rgba(167,177,216,0.2)] text-[#F4F6FF] placeholder:text-[#A7B1D8]/50 focus:border-[#4F6DFF] focus:ring-[#4F6DFF]/20 rounded-xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#A7B1D8] text-sm sm:text-base">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-[rgba(7,11,20,0.6)] border-[rgba(167,177,216,0.2)] text-[#F4F6FF] placeholder:text-[#A7B1D8]/50 focus:border-[#4F6DFF] focus:ring-[#4F6DFF]/20 rounded-xl h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-[#A7B1D8] text-sm sm:text-base">
                  Company
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Your company name"
                  value={formData.company}
                  onChange={handleChange}
                  className="bg-[rgba(7,11,20,0.6)] border-[rgba(167,177,216,0.2)] text-[#F4F6FF] placeholder:text-[#A7B1D8]/50 focus:border-[#4F6DFF] focus:ring-[#4F6DFF]/20 rounded-xl h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-[#A7B1D8] text-sm sm:text-base">
                  Project Summary
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your project, goals, and timeline..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="bg-[rgba(7,11,20,0.6)] border-[rgba(167,177,216,0.2)] text-[#F4F6FF] placeholder:text-[#A7B1D8]/50 focus:border-[#4F6DFF] focus:ring-[#4F6DFF]/20 rounded-xl resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send message
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
