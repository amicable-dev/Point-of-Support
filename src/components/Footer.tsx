import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <>
      {/* Footer Main */}
      <footer className="bg-black w-full">
        <div className="px-5 pt-20 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-5">
            {/* Left column */}
            <div>
              <h3
                className="text-[#f2f2f2] text-2xl font-normal tracking-[-0.02em] mb-3"
                style={{ fontFamily: "'Geist Sans', sans-serif" }}
              >
                POINT OF SUPPORT
              </h3>
              <p className="text-[11px] uppercase tracking-[0.06em] text-[#b5b3ad] mb-6">
                Therapy & counselling for meaningful change.
              </p>
              <div className="flex gap-4">
                <span className="text-[11px] uppercase tracking-[0.06em] text-[#b5b3ad] flex items-center gap-1">
                  Instagram <ArrowUpRight className="w-3 h-3" />
                </span>
                <span className="text-[11px] uppercase tracking-[0.06em] text-[#b5b3ad] flex items-center gap-1">
                  Telegram <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Center column */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.06em] text-[#b5b3ad] mb-4">
                Navigate
              </p>
              <ul className="space-y-2">
                {['Mission', 'About', 'Services', 'Contacts', 'Journal'].map(
                  (item) => (
                    <li key={item}>
                      <span className="text-base text-[#b5b3ad] hover:text-[#f2f2f2] transition-colors duration-300 cursor-pointer">
                        {item}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Right column */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.06em] text-[#b5b3ad] mb-4">
                Services
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'Individual Therapy',
                  'Couples Therapy',
                  'Online Sessions',
                  'Crisis Support',
                  'Corporate Programs',
                ].map((item) => (
                  <li key={item}>
                    <span className="text-base text-[#b5b3ad] hover:text-[#f2f2f2] transition-colors duration-300 cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.06em] text-[#b5b3ad]">
                  hello@pointofsupport.in
                </p>
                <p className="text-[11px] uppercase tracking-[0.06em] text-[#b5b3ad]">
                  +91 98765 43210
                </p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col md:flex-row justify-between items-center mt-16 pt-5"
            style={{ borderTop: '1px solid #303030' }}
          >
            <p className="text-[11px] uppercase tracking-[0.06em] text-[#b5b3ad]">
              &copy; 2025 Point of Support
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[11px] uppercase tracking-[0.06em] text-[#b5b3ad] hover:text-[#f2f2f2] transition-colors duration-300 cursor-pointer bg-transparent border-none flex items-center gap-1 mt-3 md:mt-0"
            >
              Back to top <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </footer>

      {/* Footer Sub */}
      <div className="bg-sand w-full">
        <div className="px-5 py-10 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex gap-4">
            <span className="text-[11px] uppercase tracking-[0.06em] text-[#1d1d1d] cursor-pointer hover:text-black transition-colors">
              Privacy Policy
            </span>
            <span className="text-[11px] uppercase tracking-[0.06em] text-[#1d1d1d] cursor-pointer hover:text-black transition-colors">
              Terms of Use
            </span>
          </div>
          <p className="text-[11px] uppercase tracking-[0.06em] text-[#1d1d1d]">
            Mumbai, India
          </p>
        </div>
      </div>
    </>
  );
}
