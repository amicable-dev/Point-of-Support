import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useBooking } from '@/context/BookingContext';

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const reassuranceRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { openBooking } = useBooking();

  // Film grain canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isVisible = true;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    const drawGrain = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(drawGrain);
        return;
      }
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 12; // very subtle grain
      }
      ctx.putImageData(imageData, 0, 0);
      animId = requestAnimationFrame(drawGrain);
    };

    animId = requestAnimationFrame(drawGrain);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background fade in
      gsap.fromTo(
        bgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: 'power2.out' }
      );

      // Headline SplitText character stagger
      if (headlineRef.current) {
        const split = new SplitText(headlineRef.current, {
          type: 'chars',
          charsClass: 'hero-char',
        });
        gsap.set(split.chars, { opacity: 0, y: 15 });
        gsap.to(split.chars, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: 'power2.out',
          delay: 0.2,
        });
      }

      // Tagline and reassurance fade in
      gsap.fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.8 }
      );
      gsap.fromTo(
        reassuranceRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.0 }
      );

      // Parallax scroll effect
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          scale: 1.08,
          yPercent: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Headline fade on scroll
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          y: -60,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: '100px top',
            end: '300px top',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100dvh', minHeight: '600px' }}
    >
      {/* Background image */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 opacity-0"
        style={{
          backgroundImage: 'url(/assets/hero-portrait.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      />

      {/* Film grain canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ width: '100%', height: '100%', mixBlendMode: 'overlay', opacity: 0.5 }}
      />

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(242,242,242,0.25) 0%, rgba(242,242,242,0) 30%, rgba(242,242,242,0) 60%, rgba(242,242,242,0.3) 100%)',
        }}
      />

      {/* Headline */}
      <div className="absolute inset-0 z-[3] flex flex-col justify-center md:block md:pt-[25vh] px-[5%] pointer-events-none">
        <h1
          ref={headlineRef}
          className="w-full flex flex-col md:flex-row md:justify-between font-normal md:items-end gap-0.5 md:gap-1"
          style={{
            fontFamily: "'Geist Sans', sans-serif",
            fontSize: 'clamp(2rem, 10vw, 8rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
          }}
        >
          <span className="text-black">POINT</span>
          <span className="text-[#c4a96a]">OF SUPPORT</span>
        </h1>
        <p className="text-black/70 md:hidden max-w-[280px] mt-4"
          style={{
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
          }}
        >
          Sometimes the bravest thing you can do — is simply reach out.
        </p>
      </div>

      {/* Desktop top-left block */}
      <div
        ref={taglineRef}
        className="absolute z-[4] opacity-0 max-md:hidden"
        style={{ left: '15%', top: '12%' }}
      >
        <p className="text-[11px] uppercase tracking-[0.06em] text-black mb-3">
          [ contacts ]
        </p>
        <p
          className="text-black mb-5 max-w-[320px]"
          style={{
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            lineHeight: 1.5,
            letterSpacing: '-0.02em',
          }}
        >
          Sometimes the bravest thing you can do — is simply reach out.
        </p>
        <button
          onClick={openBooking}
          className="px-7 py-3.5 bg-[#c4a96a] text-black text-[13px] uppercase tracking-[0.08em] hover:bg-black hover:text-[#f2f2f2] transition-all duration-350 cursor-pointer border-none"
          style={{
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          [ contact us ]
        </button>
      </div>

      {/* Desktop top-right reassurance */}
      <div
        ref={reassuranceRef}
        className="absolute z-[4] opacity-0 text-right max-md:hidden"
        style={{ right: '12%', top: '14%' }}
      >
        <p
          className="text-black max-w-[280px]"
          style={{
            fontSize: 'clamp(14px, 1.5vw, 16px)',
            lineHeight: 1.6,
            letterSpacing: '-0.01em',
          }}
        >
          — You don&apos;t have to have it all figured out. Showing up is enough.
        </p>
      </div>

      {/* Mobile CTA */}
      <div className="absolute bottom-[10%] left-0 right-0 z-[4] flex justify-center md:hidden">
        <button
          onClick={openBooking}
          className="px-7 py-3.5 bg-[#c4a96a] text-black text-[13px] uppercase tracking-[0.08em] hover:bg-black hover:text-[#f2f2f2] transition-all duration-350 cursor-pointer border-none"
          style={{
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          [ contact us ]
        </button>
      </div>
    </section>
  );
}
