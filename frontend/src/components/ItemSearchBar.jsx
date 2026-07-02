import { IconSearch, IconX } from '@tabler/icons-react';

export default function ItemSearchBar({ value, onChange, placeholder = 'Search by name or category…' }) {
  return (
    <div className="relative">
      <IconSearch
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-10 pr-10 rounded-md bg-white border border-border font-sans text-[13px] text-ink placeholder:text-muted focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none transition-colors duration-150"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-muted hover:text-ink transition-colors duration-150"
          aria-label="Clear search"
        >
          <IconX size={16} />
        </button>
      )}
    </div>
  );
}
