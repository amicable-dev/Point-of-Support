import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: 'Mission', id: 'philosophy' },
  { label: 'About', id: 'founders' },
  { label: 'Services', id: 'services' },
  { label: 'Contacts', id: 'cta' },
  { label: 'Journal', id: 'resources' },
];

export default function NavigationOverlay({ isOpen, onClose }: NavigationOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const links = linksRef.current;
    if (!overlay || !links) return;

    const linkEls = Array.from(links.children);

    if (isOpen) {
      gsap.set(overlay, { display: 'flex' });
      gsap.to(overlay, { opacity: 1, duration: 0.6, ease: 'power3.out' });
      gsap.fromTo(
        linkEls,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          delay: 0.2,
          ease: 'power3.out',
        }
      );
    } else {
      gsap.to(linkEls, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        stagger: 0.03,
        ease: 'power3.in',
      });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.4,
        delay: 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
        },
      });
    }
  }, [isOpen]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] bg-black hidden opacity-0"
      style={{ display: 'none' }}
    >
      <div className="absolute top-0 right-0 p-5">
        <button
          onClick={onClose}
          className="group flex flex-col gap-[11px] cursor-pointer py-2"
          aria-label="Close menu"
        >
          <span className="block w-5 h-px bg-white transition-transform duration-300 rotate-45 translate-y-[6px]" />
          <span className="block w-5 h-px bg-white transition-transform duration-300 -rotate-45 -translate-y-[6px]" />
        </button>
      </div>

      <div
        ref={linksRef}
        className="flex flex-col items-start justify-center h-full px-10 md:px-20 gap-4"
      >
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => scrollTo(link.id)}
            className="group flex items-center gap-4 text-[#f2f2f2] text-4xl md:text-6xl font-normal tracking-[-0.03em] hover:text-[#c4a96a] transition-colors duration-300 cursor-pointer bg-transparent border-none text-left"
            style={{ fontFamily: "'Geist Sans', sans-serif" }}
          >
            <ArrowRight className="w-6 h-6 md:w-8 md:h-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
}
