import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    img: '/assets/service-card-1.jpg',
    title: 'Individual Therapy',
    desc: 'One-on-one sessions to explore your inner world, process emotions, and find clarity.',
  },
  {
    img: '/assets/service-card-2.jpg',
    title: 'Couples Therapy',
    desc: 'Strengthen connection, navigate conflicts, and rebuild trust together.',
  },
  {
    img: '/assets/service-card-3.jpg',
    title: 'Online Sessions',
    desc: 'Flexible, secure video sessions from the comfort of your own space.',
  },
  {
    img: '/assets/service-card-4.jpg',
    title: 'Crisis Support',
    desc: 'Immediate support during acute emotional distress and life transitions.',
  },
  {
    img: '/assets/service-card-5.jpg',
    title: 'Group Workshops',
    desc: 'Shared experiences that foster connection, insight, and collective healing.',
  },
  {
    img: '/assets/service-card-6.jpg',
    title: 'Corporate Programs',
    desc: 'Mental wellness programs designed for teams and organizations.',
  },
];

export default function ServicesCarouselSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('.service-card');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardWidth = 360;
    container.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="w-full bg-sand overflow-hidden"
      style={{ padding: '150px 0 100px' }}
    >
      {/* Section label + heading */}
      <div className="px-5 mb-16">
        <ScrollReveal>
          <p className="text-[11px] uppercase tracking-[0.06em] text-[#1d1d1d] mb-4">
            [ services ]
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2
            className="text-black font-normal tracking-[-0.03em]"
            style={{
              fontSize: 'clamp(2rem, 4vw, 5rem)',
              lineHeight: 1.05,
              fontFamily: "'Geist Sans', sans-serif",
            }}
          >
            Ways We Can Help
          </h2>
        </ScrollReveal>
      </div>

      {/* Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-10 overflow-x-auto pb-4 px-5 scrollbar-hide"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {services.map((service, i) => (
          <div
            key={i}
            className="service-card flex-shrink-0 group cursor-pointer transition-transform duration-350 hover:-translate-y-1"
            style={{
              width: 'clamp(240px, 320px, 320px)',
              scrollSnapAlign: 'start',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              className="overflow-hidden mb-5"
              style={{
                boxShadow: '0 0 0 rgba(0,0,0,0)',
                transition: 'box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 8px 30px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 0 0 rgba(0,0,0,0)';
              }}
            >
              <img
                src={service.img}
                alt={service.title}
                loading="lazy"
                className="w-full object-cover transition-all duration-600 group-hover:scale-[1.03] group-hover:brightness-105"
                style={{
                  aspectRatio: '4/5',
                  transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
                }}
              />
            </div>
            <h3
              className="text-black text-2xl font-normal tracking-[-0.02em] mb-2"
              style={{ fontFamily: "'Geist Sans', sans-serif" }}
            >
              {service.title}
            </h3>
            <p
              className="text-[#1d1d1d] mb-3"
              style={{
                fontSize: '16px',
                lineHeight: 1.6,
                letterSpacing: '-0.01em',
              }}
            >
              {service.desc}
            </p>
            <ArrowRight className="w-5 h-5 text-[#1d1d1d] opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-0 group-hover:translate-x-1 transition-transform" />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <div className="flex justify-end gap-2 px-5 mt-8">
        <button
          onClick={() => scroll('left')}
          className="w-10 h-10 flex items-center justify-center border border-[#1d1d1d] text-[#1d1d1d] hover:border-black hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
          aria-label="Scroll left"
        >
          <span className="text-lg">&larr;</span>
        </button>
        <button
          onClick={() => scroll('right')}
          className="w-10 h-10 flex items-center justify-center border border-[#1d1d1d] text-[#1d1d1d] hover:border-black hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
          aria-label="Scroll right"
        >
          <span className="text-lg">&rarr;</span>
        </button>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
