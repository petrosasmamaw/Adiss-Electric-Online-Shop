import { IconPhone } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { formatPhoneDisplay } from '../utils/phone';

export default function Hero() {
  const contactPhones = useSelector((state) => state.controls.contact_phones);

  return (
    <section className="hero-section pt-[5rem] pb-11 px-4 sm:px-6 md:pt-[5.5rem] md:pb-12 lg:pt-[5.75rem] lg:pb-14">
      <svg
        className="hero-pattern"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="1.1" fill="#FFFFFF" fillOpacity="0.09" />
            <path d="M0 24h48M24 0v48" stroke="#FFFFFF" strokeOpacity="0.04" strokeWidth="0.6" />
          </pattern>
          <pattern id="hero-schematic" width="220" height="220" patternUnits="userSpaceOnUse">
            <g fill="none" strokeWidth="0.8">
              <circle cx="110" cy="110" r="92" stroke="#FFFFFF" strokeOpacity="0.06" />
              <circle cx="110" cy="110" r="68" stroke="#FFFFFF" strokeOpacity="0.05" />
              <circle cx="110" cy="110" r="44" stroke="#D90429" strokeOpacity="0.12" />
              <path d="M22 110a88 88 0 0 1 176 0" stroke="#FFFFFF" strokeOpacity="0.06" />
              <path d="M22 110a88 88 0 0 0 176 0" stroke="#FFFFFF" strokeOpacity="0.06" />
              <line x1="110" y1="94" x2="110" y2="220" stroke="#D90429" strokeOpacity="0.14" />
            </g>
          </pattern>
          <radialGradient id="hero-vignette" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
        <rect width="100%" height="100%" fill="url(#hero-schematic)" />
        <rect width="100%" height="100%" fill="url(#hero-vignette)" />
      </svg>

      <div className="relative max-w-6xl mx-auto z-[1]">
        <div className="hero-content max-w-4xl">
          <h1 className="hero-title hero-headline-glow">
            <span className="hero-title-line">Your trusted</span>
            <span className="hero-title-line">
              <span className="text-amber">Electrical</span> supplier
            </span>
          </h1>

          <p className="hero-description font-sans">
            Cables, switches, bulbs and more — quality products for home and business.
          </p>

          <span className="hero-accent-line" aria-hidden="true" />

          <div className="hero-contact-row">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-mark" aria-hidden="true" />
              <span>Ethiopia</span>
            </div>

            {contactPhones.length > 0 && (
              <ul className="hero-phone-list">
                {contactPhones.map((phone) => (
                  <li key={phone}>
                    <a href={`tel:${phone}`} className="hero-phone-chip">
                      <span className="hero-phone-icon" aria-hidden="true">
                        <IconPhone size={14} stroke={2.25} />
                      </span>
                      <span className="hero-phone-number">{formatPhoneDisplay(phone)}</span>
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
