import { useState } from 'react';
import NavigationOverlay from './NavigationOverlay';
import { useBooking } from '@/context/BookingContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openBooking } = useBooking();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[100] h-14 flex items-center bg-black/30 backdrop-blur-sm"
      >
        <div
          className="w-full h-full grid grid-cols-3 items-center px-5"
          style={{ borderBottom: '1px solid rgba(210, 207, 204, 0.15)' }}
        >
          {/* Left column */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(true)}
              className="group flex flex-col gap-[11px] cursor-pointer py-2"
              aria-label="Open menu"
            >
              <span className="block w-5 h-0.5 bg-white transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="block w-5 h-0.5 bg-white" />
              <span className="block w-5 h-0.5 bg-white transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <nav className="hidden md:flex items-center gap-4">
              <button
                onClick={() => scrollTo('philosophy')}
                className="text-white text-[11px] uppercase tracking-[0.04em] hover:text-[#c4a96a] transition-colors duration-300 cursor-pointer bg-transparent border-none"
              >
                mission
              </button>
              <span className="w-[3px] h-[3px] rounded-full bg-[#b5b3ad]" />
              <button
                onClick={() => scrollTo('founders')}
                className="text-white text-[11px] uppercase tracking-[0.04em] hover:text-[#c4a96a] transition-colors duration-300 cursor-pointer bg-transparent border-none"
              >
                about
              </button>
            </nav>
          </div>

          {/* Center column */}
          <div className="flex justify-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-white text-[11px] uppercase tracking-[0.12em] cursor-pointer bg-transparent border-none"
            >
              POINT OF SUPPORT
            </button>
          </div>

          {/* Right column */}
          <div className="hidden md:flex items-center justify-end gap-4">
            <button
              onClick={() => scrollTo('services')}
              className="text-white text-[11px] uppercase tracking-[0.04em] hover:text-[#c4a96a] transition-colors duration-300 cursor-pointer bg-transparent border-none"
            >
              services
            </button>
            <span className="w-[3px] h-[3px] rounded-full bg-[#b5b3ad]" />
              <button
                onClick={openBooking}
                className="text-white text-[11px] uppercase tracking-[0.04em] hover:text-[#c4a96a] transition-colors duration-300 cursor-pointer bg-transparent border-none"
              >
                contacts
              </button>
          </div>
        </div>
      </header>

      <NavigationOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
