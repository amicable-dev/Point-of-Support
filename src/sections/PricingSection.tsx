import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '@/components/ScrollReveal';
import { useBooking } from '@/context/BookingContext';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Individual',
    price: '₹1,500',
    period: '/ session',
    desc: 'One-on-one sessions tailored to your needs. 50 minutes of focused support.',
    features: [
      'Personalized therapy plan',
      'Flexible scheduling',
      'Secure video or in-person',
      'Free 30-min first session',
    ],
  },
  {
    name: 'Couples',
    price: '₹2,500',
    period: '/ session',
    desc: 'Strengthen connection, navigate conflicts, and rebuild trust together.',
    features: [
      'Joint & individual sessions',
      'Communication tools',
      '80-minute sessions',
      'Free initial consultation',
    ],
    highlighted: true,
  },
  {
    name: 'Online',
    price: '₹1,200',
    period: '/ session',
    desc: 'Access support from anywhere in India. Same care, remote delivery.',
    features: [
      'Secure video platform',
      'Flexible rescheduling',
      'No commute needed',
      'Free 30-min first session',
    ],
  },
];

export default function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { openBooking } = useBooking();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll('.pricing-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%', once: true },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="w-full bg-black overflow-hidden py-16 md:py-28"
    >
      <div className="px-5">
        <ScrollReveal>
          <p className="text-[11px] uppercase tracking-[0.06em] text-[#b5b3ad] mb-4">
            [ investment ]
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2
            className="text-[#f2f2f2] font-normal tracking-[-0.03em] mb-4"
            style={{
              fontSize: 'clamp(2rem, 4vw, 5rem)',
              lineHeight: 1.05,
              fontFamily: "'Geist Sans', sans-serif",
            }}
          >
            Therapy is an investment in yourself.
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p
            className="text-[#b5b3ad] max-w-[500px] mb-14"
            style={{ fontSize: '16px', lineHeight: 1.6, letterSpacing: '-0.01em' }}
          >
            Transparent pricing, no hidden fees. Every plan includes a free 30-minute
            first conversation to see if we&apos;re the right fit.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`pricing-card opacity-0 flex flex-col ${
                plan.highlighted ? 'bg-[#c4a96a]' : 'bg-[#1d1d1d]'
              }`}
              style={{ padding: 'clamp(28px, 3vw, 40px) clamp(20px, 3vw, 32px)' }}
            >
              <p
                className="text-[11px] uppercase tracking-[0.08em] mb-1"
                style={{ color: plan.highlighted ? '#000' : '#b5b3ad' }}
              >
                {plan.name}
              </p>
              <div className="flex items-baseline gap-1 mb-4">
                <span
                  className="text-4xl font-normal tracking-[-0.03em]"
                  style={{
                    fontFamily: "'Geist Sans', sans-serif",
                    color: plan.highlighted ? '#000' : '#f2f2f2',
                  }}
                >
                  {plan.price}
                </span>
                <span
                  className="text-[13px]"
                  style={{ color: plan.highlighted ? 'rgba(0,0,0,0.6)' : '#b5b3ad' }}
                >
                  {plan.period}
                </span>
              </div>
              <p
                className="text-sm mb-6"
                style={{
                  lineHeight: 1.6,
                  color: plan.highlighted ? 'rgba(0,0,0,0.7)' : '#b5b3ad',
                }}
              >
                {plan.desc}
              </p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 flex-shrink-0 w-1 h-1 rounded-full"
                      style={{ backgroundColor: plan.highlighted ? '#000' : '#c4a96a' }}
                    />
                    <span
                      className="text-[13px]"
                      style={{
                        lineHeight: 1.4,
                        color: plan.highlighted ? 'rgba(0,0,0,0.8)' : '#d2cfcc',
                      }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={openBooking}
                className={`w-full py-3.5 text-[13px] uppercase tracking-[0.08em] cursor-pointer border-none transition-all duration-350 ${
                  plan.highlighted
                    ? 'bg-black text-[#f2f2f2] hover:bg-[#f2f2f2] hover:text-black'
                    : 'bg-[#c4a96a] text-black hover:bg-[#f2f2f2]'
                }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                Book Free Session
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
