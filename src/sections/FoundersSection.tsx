import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '@/components/ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

export default function FoundersSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);

  // Portrait entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (portraitRef.current) {
        gsap.fromTo(
          portraitRef.current,
          { opacity: 0, scale: 1.05 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 3D tilt on mouse move
  useEffect(() => {
    const img = portraitImgRef.current;
    if (!img) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = img.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      img.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
    };

    const handleMouseLeave = () => {
      img.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
    };

    img.addEventListener('mousemove', handleMouseMove);
    img.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      img.removeEventListener('mousemove', handleMouseMove);
      img.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="founders"
      className="w-full bg-sand overflow-hidden"
      style={{ padding: '150px 0' }}
    >
      <div className="px-5 flex flex-col md:flex-row gap-10 md:gap-[60px]">
        {/* Portrait - 55% */}
        <div ref={portraitRef} className="md:w-[55%] opacity-0">
          <img
            ref={portraitImgRef}
            src="/assets/founder-portrait.jpg"
            alt="Dr. Ananya Sharma - Clinical Psychologist & Founder"
            loading="lazy"
            className="w-full object-cover transition-transform duration-500 ease-out"
            style={{ aspectRatio: '1/1' }}
          />
        </div>

        {/* Content - 45% */}
        <div className="md:w-[45%] flex flex-col justify-center">
          <ScrollReveal>
            <p className="text-[11px] uppercase tracking-[0.06em] text-[#1d1d1d] mb-4">
              [ about ]
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h2
              className="text-black font-normal tracking-[-0.03em] mb-2"
              style={{
                fontSize: 'clamp(2rem, 4vw, 5rem)',
                lineHeight: 1.05,
                fontFamily: "'Geist Sans', sans-serif",
              }}
            >
              Dr. Ananya Sharma
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <p
              className="text-[#c4a96a] text-[11px] uppercase tracking-[0.08em] mb-6"
            >
              Clinical Psychologist & Founder, Mumbai
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.35}>
            <p
              className="text-[#1d1d1d] max-w-[480px] mb-8"
              style={{
                fontSize: '16px',
                lineHeight: 1.6,
                letterSpacing: '-0.01em',
              }}
            >
              For over a decade, I have walked alongside people navigating
              the deepest questions of their lives. My practice is rooted in the
              belief that therapy is not about fixing what is broken — it is
              about discovering what has always been whole. I hold a degree in
              Clinical Psychology from NIMHANS, Bangalore, and have trained in
              integrative approaches that blend cognitive, existential, and
              humanistic methods with deep respect for India's diverse cultural
              context. Every session is a collaboration. Every breakthrough
              belongs to you.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.45}>
            <div className="space-y-0 mb-10">
              {[
                'NIMHANS, Bangalore — Clinical Psychology (M.Phil)',
                '10+ years of private practice across Mumbai & Bangalore',
                'Integrative therapy — CBT, Existential, Humanistic',
              ].map((item, i) => (
                <div
                  key={i}
                  className="py-4"
                  style={{ borderTop: '1px solid #d2cfcc' }}
                >
                  <p className="text-[11px] uppercase tracking-[0.06em] text-[#b5b3ad]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.55}>
            <button
              className="px-7 py-3.5 bg-transparent text-black text-[13px] uppercase tracking-[0.08em] border border-black hover:bg-black hover:text-[#f2f2f2] transition-all duration-350 cursor-pointer"
              style={{
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              Learn more about our approach
            </button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
