export default function Hero() {
  return (
    <section className="hero-section pt-20 pb-8 px-6 md:pt-24 md:pb-10">
      {/* Schematic line pattern — concentric arcs + power nodes */}
      <svg
        className="hero-pattern"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="hero-schematic"
            width="220"
            height="220"
            patternUnits="userSpaceOnUse"
          >
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

      {/* Large watermark bolt — line art */}
      <svg
        className="hidden md:block absolute pointer-events-none"
        style={{ right: '4%', top: '50%', transform: 'translateY(-50%)' }}
        width="220"
        height="220"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M58 8L28 52H46L40 92L72 48H54L58 8Z"
          stroke="#FFFFFF"
          strokeOpacity="0.08"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M58 8L28 52H46L40 92L72 48H54L58 8Z"
          stroke="#D90429"
          strokeOpacity="0.12"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      </svg>

      <div className="relative max-w-6xl mx-auto z-[1]">
        <p className="text-amber text-[10px] font-bold tracking-[0.18em] uppercase flex items-center gap-2 mb-2">
          <span className="inline-block w-5 h-[1.5px] bg-amber" />
          Ethiopia
        </p>

        <h1 className="font-condensed font-extrabold text-[38px] md:text-[52px] leading-[0.95] text-white tracking-[-0.01em] mb-2">
          YOUR TRUSTED <br className="md:hidden" />
          <span className="text-amber">ELECTRICAL</span> SUPPLIER
        </h1>

        <p className="text-[#D8E2F8] text-[13px] leading-relaxed max-w-sm">
          Cables, switches, bulbs and more — quality products for home and business.
        </p>

        <div className="mt-5 w-[60px] h-[2px] bg-amber rounded" />
      </div>
    </section>
  );
}
