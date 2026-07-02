import { Link } from 'react-router-dom';

export default function BrandLogo({ to = '/', small = false }) {
  return (
    <Link to={to} aria-label="Addis Electric home" className="inline-flex items-center gap-2">
      <span
        className={`relative overflow-hidden rounded-md border border-border shadow-sm ${
          small ? 'w-8 h-8' : 'w-9 h-9'
        }`}
      >
        <img
          src="/card.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </span>
      <span className="font-condensed font-extrabold tracking-[0.01em] leading-none max-[380px]:hidden">
        <span className={`${small ? 'text-[18px]' : 'text-[20px]'} text-ink`}>Addis </span>
        <span className={`${small ? 'text-[18px]' : 'text-[20px]'} text-amber`}>Electric</span>
      </span>
    </Link>
  );
}
