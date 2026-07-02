export default function Hero() {
  return (
    <section
      className="relative overflow-hidden pt-20 pb-8 px-6 md:pt-24 md:pb-10"
      style={{
        background:
          'radial-gradient(120% 120% at 85% 15%, #273C75 0%, #142459 45%, #0B1020 100%)',
      }}
    >
      {/* Circuit-board trace pattern (electrical theme) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="hero-circuit"
            width="140"
            height="140"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(0 0)"
          >
            <g
              fill="none"
              stroke="#D90429"
              strokeOpacity="0.10"
              strokeWidth="1.5"
            >
              <path d="M10 30 H60 V70 H110" />
              <path d="M30 10 V50 H80 V130" />
              <path d="M110 20 V60 H140" />
              <path d="M0 100 H40 V130" />
              <path d="M70 100 H120 V60" />
            </g>
            <g fill="#D90429" fillOpacity="0.18">
              <circle cx="60" cy="70" r="3" />
              <circle cx="80" cy="50" r="3" />
              <circle cx="30" cy="50" r="2.5" />
              <circle cx="110" cy="60" r="2.5" />
              <circle cx="40" cy="100" r="2.5" />
              <circle cx="120" cy="60" r="3" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-circuit)" />
      </svg>

      {/* Soft red glow accent */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: '-80px',
          top: '-60px',
          width: '320px',
          height: '320px',
          background:
            'radial-gradient(circle, rgba(217,4,41,0.18) 0%, rgba(217,4,41,0) 70%)',
        }}
      />

      {/* Decorative concentric circles */}
      <div
        className="hidden md:block"
        style={{
          position: 'absolute',
          right: '-20px',
          top: '-20px',
          width: '180px',
          height: '180px',
          border: '40px solid rgba(217,4,41,0.07)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        className="hidden md:block"
        style={{
          position: 'absolute',
          right: '30px',
          top: '30px',
          width: '100px',
          height: '100px',
          border: '20px solid rgba(217,4,41,0.05)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* Faint oversized lightning bolt watermark */}
      <svg
        className="hidden md:block absolute pointer-events-none"
        style={{ right: '6%', bottom: '-30px' }}
        width="240"
        height="240"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M13 2L4 14H11L10 22L20 10H13L13 2Z"
          fill="#D90429"
          fillOpacity="0.05"
        />
      </svg>

      <div className="relative max-w-6xl mx-auto">
        <p className="text-amber text-[10px] font-bold tracking-[0.18em] uppercase flex items-center gap-2 mb-2">
          <span className="inline-block w-5 h-[1.5px] bg-amber" />
          Ethiopia
        </p>

        <h1 className="font-condensed font-extrabold text-[38px] md:text-[52px] leading-[0.95] text-white tracking-[-0.01em] mb-2">
          YOUR TRUSTED <br className="md:hidden" />
          <span className="text-amber">ELECTRICAL</span> SUPPLIER
        </h1>

        <p className="text-[#CBD5F1] text-[13px] leading-relaxed max-w-sm">
          Cables, switches, bulbs and more — quality products for home and business.
        </p>

        <div className="mt-5 w-[60px] h-[2px] bg-amber rounded" />
      </div>
    </section>
  );
}
