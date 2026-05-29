import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';

const serviceOptions = [
  'Individual Therapy',
  'Couples Therapy',
  'Online Session',
  'Crisis Support',
  'Group Workshop',
  'Corporate Program',
];

export default function BookingModal() {
  const { isOpen, closeBooking } = useBooking();
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    preferredDate: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.set(overlay, { display: 'flex' });
      gsap.to(overlay, { opacity: 1, duration: 0.4, ease: 'power3.out' });
      gsap.fromTo(
        panel,
        { opacity: 0, scale: 0.96, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.1 }
      );
    } else {
      document.body.style.overflow = '';
      gsap.to(panel, {
        opacity: 0, scale: 0.96, y: 10, duration: 0.3, ease: 'power3.in',
      });
      gsap.to(overlay, {
        opacity: 0, duration: 0.3, delay: 0.15, ease: 'power3.in',
        onComplete: () => { gsap.set(overlay, { display: 'none' }); },
      });
    }

    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setError('Please fill in your name, phone & email.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitted(true);
    setTimeout(() => { closeBooking(); setSubmitted(false); setForm({ name: '', phone: '', email: '', service: '', preferredDate: '', message: '' }); }, 3000);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] bg-black/70 hidden opacity-0 items-center justify-center p-5"
      onClick={(e) => { if (e.target === e.currentTarget) closeBooking(); }}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-[520px] max-h-[90vh] overflow-y-auto bg-[#f2f2f2]"
      >
        {/* Close button */}
        <button
          onClick={closeBooking}
          className="absolute top-4 right-4 z-10 cursor-pointer bg-transparent border-none p-2 hover:opacity-60 transition-opacity"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5 text-[#1d1d1d]" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center justify-center px-10 py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-[#c4a96a] flex items-center justify-center mb-5">
              <span className="text-black text-xl">&check;</span>
            </div>
            <h3
              className="text-black text-2xl font-normal tracking-[-0.02em] mb-3"
              style={{ fontFamily: "'Geist Sans', sans-serif" }}
            >
              Request Sent
            </h3>
            <p className="text-[#1d1d1d] text-base" style={{ lineHeight: 1.6 }}>
              We'll reach out within 24 hours to confirm your session.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-8 py-12 md:px-10">
            <h2
              className="text-black text-3xl font-normal tracking-[-0.03em] mb-2"
              style={{ fontFamily: "'Geist Sans', sans-serif" }}
            >
              Book a Session
            </h2>
            <p
              className="text-[11px] uppercase tracking-[0.06em] text-[#b5b3ad] mb-8"
            >
              Free 30-minute first conversation
            </p>

            {error && (
              <p className="text-[#d32f2f] text-[13px] mb-4 px-4 py-3 bg-[#ffebee]">
                {error}
              </p>
            )}

            <div className="space-y-5">
              <div>
                <label className="text-[11px] uppercase tracking-[0.06em] text-[#1d1d1d] block mb-1.5">Full Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-white border-none text-[#1d1d1d] text-base outline-none"
                  style={{ fontFamily: "'Geist Sans', sans-serif" }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.06em] text-[#1d1d1d] block mb-1.5">Phone *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-white border-none text-[#1d1d1d] text-base outline-none"
                    style={{ fontFamily: "'Geist Sans', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.06em] text-[#1d1d1d] block mb-1.5">Email *</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-white border-none text-[#1d1d1d] text-base outline-none"
                    style={{ fontFamily: "'Geist Sans', sans-serif" }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.06em] text-[#1d1d1d] block mb-1.5">Service</label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-none text-[#1d1d1d] text-base outline-none rounded-none appearance-none cursor-pointer"
                  style={{ fontFamily: "'Geist Sans', sans-serif" }}
                >
                  <option value="">Select a service...</option>
                  {serviceOptions.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.06em] text-[#1d1d1d] block mb-1.5">Preferred Date</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={form.preferredDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-none text-[#1d1d1d] text-base outline-none"
                  style={{ fontFamily: "'Geist Sans', sans-serif" }}
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.06em] text-[#1d1d1d] block mb-1.5">Message (optional)</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="What brings you here?"
                  className="w-full px-4 py-3 bg-white border-none text-[#1d1d1d] text-base outline-none resize-none"
                  style={{ fontFamily: "'Geist Sans', sans-serif" }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#c4a96a] text-black text-[13px] uppercase tracking-[0.08em] hover:bg-black hover:text-[#f2f2f2] transition-all duration-350 cursor-pointer border-none mt-2"
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                Send Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
