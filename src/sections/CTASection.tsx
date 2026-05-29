import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Lock, Calendar } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';

gsap.registerPlugin(ScrollTrigger);

const trustIndicators = [
  { icon: Check, text: 'Free 30-min first session' },
  { icon: Lock, text: '100% confidential, HIPAA-compliant' },
  { icon: Calendar, text: 'Flexible slots — online & in-person' },
];

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const { openBooking } = useBooking();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Section fade in
      gsap.fromTo(
        section,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Word-by-word heading reveal
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll('.word');
        gsap.fromTo(
          words,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      // Body text
      gsap.fromTo(
        bodyRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bodyRef.current,
            start: 'top 85%',
            once: true,
          },
          delay: 0.5,
        }
      );

      // Buttons
      gsap.fromTo(
        buttonsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: buttonsRef.current,
            start: 'top 90%',
            once: true,
          },
          delay: 0.7,
        }
      );

      // Trust indicators
      if (trustRef.current) {
        const items = trustRef.current.children;
        gsap.fromTo(
          items,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: trustRef.current,
              start: 'top 90%',
              once: true,
            },
            delay: 0.9,
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const headingWords = 'Ready to Begin?'.split(' ');

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative w-full overflow-hidden opacity-0"
      style={{ minHeight: '80vh' }}
    >
      {/* Background image / video poster */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/assets/cta-poster.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-[3] flex flex-col items-center justify-center text-center px-5 min-h-[80vh]">
        <div className="max-w-[800px]">
          <h2
            ref={headingRef}
            className="text-[#f2f2f2] font-normal tracking-[-0.03em] mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: 1.0,
              fontFamily: "'Geist Sans', sans-serif",
            }}
          >
            {headingWords.map((word, i) => (
              <span key={i} className="word inline-block opacity-0">
                {word}&nbsp;
              </span>
            ))}
          </h2>

          <p
            ref={bodyRef}
            className="text-[#b5b3ad] max-w-[560px] mx-auto mb-10 opacity-0"
            style={{
              fontSize: '20px',
              lineHeight: 1.5,
              letterSpacing: '-0.02em',
            }}
          >
            The first conversation is free — no pressure, no commitment.
            Just a safe space to explore what brought you here and how we might
            walk forward together. Sessions available in English, Hindi & Marathi.
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-10 opacity-0">
            <button
              onClick={openBooking}
              className="px-7 py-3.5 bg-[#c4a96a] text-black text-[13px] uppercase tracking-[0.08em] hover:bg-[#f2f2f2] hover:text-black transition-all duration-350 cursor-pointer border-none"
              style={{
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              Book a Session
            </button>
            <button
              className="px-7 py-3.5 bg-transparent text-[#f2f2f2] text-[13px] uppercase tracking-[0.08em] border cursor-pointer hover:border-[#f2f2f2] hover:bg-[rgba(255,255,255,0.08)] transition-all duration-350"
              style={{
                borderColor: 'rgba(255,255,255,0.3)',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              Learn More
            </button>
          </div>

          <div
            ref={trustRef}
            className="flex flex-wrap justify-center gap-6 md:gap-10"
          >
            {trustIndicators.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 opacity-0"
              >
                <item.icon className="w-4 h-4 text-[#c4a96a]" />
                <span className="text-[11px] uppercase tracking-[0.06em] text-[#b5b3ad]">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
