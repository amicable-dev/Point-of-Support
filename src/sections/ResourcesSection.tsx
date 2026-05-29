import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const resources = [
  {
    img: '/assets/resource-card-1.jpg',
    title: 'Understanding Anxiety: A Practical Guide',
    desc: 'A comprehensive guide to recognizing, understanding, and managing anxiety in daily life.',
    format: 'PDF',
  },
  {
    img: '/assets/resource-card-2.jpg',
    title: 'The Art of Self-Compassion',
    desc: 'Learn to treat yourself with the same kindness you would offer a dear friend.',
    format: 'PDF',
  },
];

export default function ResourcesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Word-by-word highlight animation
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    const words = heading.querySelectorAll('.word');
    if (words.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { color: '#b5b3ad' },
        {
          color: '#000000',
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const splitToWords = (text: string) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="word inline-block" style={{ color: '#b5b3ad' }}>
        {word}&nbsp;
      </span>
    ));
  };

  return (
    <section
      ref={sectionRef}
      id="resources"
      className="w-full bg-[#f2f2f2] overflow-hidden"
      style={{ padding: '150px 0' }}
    >
      <div className="px-5 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left column - label, heading, description, button */}
        <div>
          <ScrollReveal>
            <p className="text-[11px] uppercase tracking-[0.06em] text-[#1d1d1d] mb-4">
              [ resources ]
            </p>
          </ScrollReveal>

          <h2
            ref={headingRef}
            className="font-normal tracking-[-0.03em] mb-6 max-w-[400px]"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              lineHeight: 1.1,
              fontFamily: "'Geist Sans', sans-serif",
            }}
          >
            {splitToWords('Investment in Your Psychological Well-being and Quality of Life.')}
          </h2>

          <ScrollReveal delay={0.2}>
            <p
              className="text-[#1d1d1d] max-w-[360px] mb-6"
              style={{
                fontSize: '16px',
                lineHeight: 1.6,
                letterSpacing: '-0.01em',
              }}
            >
              Knowledge is the first step toward inner harmony. In this section
              you will find a curated collection of verified materials to help
              you better understand yourself, improve emotional intelligence,
              and develop stress resilience.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <button
              className="px-7 py-3.5 bg-[#c4a96a] text-black text-[13px] uppercase tracking-[0.08em] hover:bg-black hover:text-[#f2f2f2] transition-all duration-350 cursor-pointer border-none"
              style={{
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              [ materials ]
            </button>
          </ScrollReveal>
        </div>

        {/* Resource cards */}
        {resources.map((resource, i) => (
          <ScrollReveal key={i} delay={0.2 + i * 0.2}>
            <div
              className="group cursor-pointer bg-sand transition-all duration-350 hover:-translate-y-1"
              style={{
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 0 0 rgba(0,0,0,0)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 8px 30px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 0 0 rgba(0,0,0,0)';
              }}
            >
              <div className="overflow-hidden">
                <img
                  src={resource.img}
                  alt={resource.title}
                  loading="lazy"
                  className="w-full object-cover transition-all duration-600 group-hover:scale-[1.03]"
                  style={{
                    aspectRatio: '16/10',
                    transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <h3
                    className="text-black text-xl font-normal tracking-[-0.02em] flex-1"
                    style={{ fontFamily: "'Geist Sans', sans-serif" }}
                  >
                    {resource.title}
                  </h3>
                  <ArrowRight className="w-5 h-5 text-[#1d1d1d] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
                </div>
                <p
                  className="text-[#1d1d1d] mb-3"
                  style={{
                    fontSize: '16px',
                    lineHeight: 1.6,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {resource.desc}
                </p>
                <span
                  className="inline-block text-[11px] uppercase tracking-[0.06em] text-[#c4a96a] px-2 py-1"
                  style={{ border: '1px solid #c4a96a' }}
                >
                  {resource.format}
                </span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
