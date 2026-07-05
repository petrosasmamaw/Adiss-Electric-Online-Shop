import { Link } from 'react-router-dom';

export default function BrandLogo({ to = '/', small = false, imageSrc = '/card.jpg', noBorder = false, tagline = null }) {
  return (
    <Link to={to} aria-label="Addis Electric home" className="inline-flex items-center gap-2.5 min-w-0">
      <span
        className={`relative shrink-0 overflow-hidden rounded-md ${noBorder ? '' : 'border border-border shadow-sm'} ${
          small ? 'w-8 h-8' : 'w-9 h-9'
        }`}
      >
        <img
          src={imageSrc}
          alt=""
          className="w-full h-full object-cover"
        />
      </span>
      <span className={`flex flex-col min-w-0 ${tagline ? 'gap-0.5' : ''} max-[380px]:hidden`}>
        <span className="font-condensed font-extrabold tracking-[0.01em] leading-none">
          <span className={`${small ? 'text-[18px]' : 'text-[20px]'} text-ink`}>Addis </span>
          <span className={`${small ? 'text-[18px]' : 'text-[20px]'} text-amber`}>Electric</span>
        </span>
        {tagline && (
          <span className={`brand-tagline ${small ? 'brand-tagline--small' : ''}`}>
            {tagline}
          </span>
        )}
      </span>
    </Link>
  );
}
