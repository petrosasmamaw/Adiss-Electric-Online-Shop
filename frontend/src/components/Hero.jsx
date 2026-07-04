import { IconBolt, IconPhone } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { formatPhoneDisplay } from '../utils/phone';

export default function Hero() {
  const contactPhones = useSelector((state) => state.controls.contact_phones);

  return (
    <section className="hero-section pt-[5rem] pb-10 px-4 sm:px-6 md:pt-[5.5rem] md:pb-11 lg:pt-28 lg:pb-14">
      <svg
        className="hero-pattern"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="hero-schematic" width="220" height="220" patternUnits="userSpaceOnUse">
            <g fill="none" strokeWidth="0.8">
              <circle cx="110" cy="110" r="92" stroke="#FFFFFF" strokeOpacity="0.07" />
              <circle cx="110" cy="110" r="68" stroke="#FFFFFF" strokeOpacity="0.06" />
              <circle cx="110" cy="110" r="44" stroke="#D90429" strokeOpacity="0.14" />
              <circle cx="110" cy="110" r="20" stroke="#FFFFFF" strokeOpacity="0.05" />
              <path d="M22 110a88 88 0 0 1 176 0" stroke="#FFFFFF" strokeOpacity="0.08" />
              <path d="M22 110a88 88 0 0 0 176 0" stroke="#FFFFFF" strokeOpacity="0.08" />
              <line x1="110" y1="94" x2="110" y2="220" stroke="#D90429" strokeOpacity="0.18" />
              <circle cx="110" cy="91" r="6" stroke="#D90429" strokeOpacity="0.35" />
              <circle cx="110" cy="91" r="2.5" fill="#D90429" fillOpacity="0.45" />
              <circle cx="0" cy="0" r="70" stroke="#FFFFFF" strokeOpacity="0.04" />
              <circle cx="220" cy="220" r="70" stroke="#FFFFFF" strokeOpacity="0.04" />
              <path
                d="M168 36l-8 16h6l-4 18 14-20h-6l8-14z"
                stroke="#FFFFFF"
                strokeOpacity="0.1"
                strokeLinejoin="round"
              />
            </g>
          </pattern>
          <radialGradient id="hero-vignette" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-schematic)" />
        <rect width="100%" height="100%" fill="url(#hero-vignette)" />
      </svg>

      <div className="relative max-w-6xl mx-auto z-[1]">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-10 xl:gap-x-14 lg:items-start">
          <div className="w-full min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="hero-brand-pill">
                <span className="w-1.5 h-1.5 rounded-full bg-amber shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/90">
                  Ethiopia
                </span>
              </div>
              <div className="hero-since-badge">
                <span className="hero-since-icon">
                  <IconBolt size={12} className="text-amber" stroke={2.5} />
                </span>
                <div className="hero-since-copy">
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] text-[#F5B8C4] whitespace-nowrap">
                    Trusted Solutions
                  </span>
                  <span className="text-white/30 text-[10px] leading-none">·</span>
                  <span className="font-condensed font-bold text-[13px] md:text-[15px] text-white whitespace-nowrap">
                    Solutions since <span className="text-amber">2021</span>
                  </span>
                </div>
              </div>
            </div>

            <h1 className="hero-headline-glow font-condensed font-extrabold text-[36px] sm:text-[44px] md:text-[52px] lg:text-[58px] xl:text-[64px] leading-[0.95] text-white tracking-[-0.02em] lg:whitespace-nowrap">
              ADDIS <span className="text-amber">ELECTRIC</span>
            </h1>

            <h2 className="mt-3 lg:mt-4 font-condensed font-bold text-[20px] sm:text-[24px] md:text-[28px] lg:text-[30px] xl:text-[32px] leading-[1.08] text-white/95 tracking-[-0.01em]">
              Your trusted{' '}
              <span className="text-amber">electrical</span> supplier
            </h2>
          </div>

          <div className="hero-visual-mark lg:col-start-2 lg:row-start-1 lg:self-center" aria-hidden="true">
            <svg width="188" height="188" viewBox="0 0 100 100" fill="none">
              <path
                d="M58 8L28 52H46L40 92L72 48H54L58 8Z"
                stroke="#FFFFFF"
                strokeOpacity="0.14"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M58 8L28 52H46L40 92L72 48H54L58 8Z"
                stroke="#D90429"
                strokeOpacity="0.28"
                strokeWidth="0.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="hero-body-stack mt-5 lg:mt-3">
          <p className="hero-description font-sans">
            Cables, switches, bulbs and more — quality products for home and business.
          </p>

          <div className="hero-footer-row">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-[2px] bg-amber rounded-full" />
              <div className="w-4 h-[2px] bg-white/25 rounded-full" />
            </div>

            {contactPhones.length > 0 && (
              <ul className="flex flex-row flex-wrap gap-2 min-w-0">
                {contactPhones.map((phone) => (
                  <li key={phone}>
                    <a
                      href={`tel:${phone}`}
                      className="hero-phone-chip text-[#E8EEF9] text-[10px] sm:text-[11px] font-semibold"
                    >
                      <IconPhone size={12} className="text-amber shrink-0" stroke={2} />
                      {formatPhoneDisplay(phone)}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
