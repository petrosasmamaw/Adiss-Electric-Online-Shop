import { useEffect, useRef } from 'react';

export default function StatusFilterPills({ options, selected, onSelect }) {
  const pillRefs = useRef({});

  useEffect(() => {
    const el = pillRefs.current[selected];
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selected]);

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {options.map(({ value, label }) => {
        const isActive = selected === value;
        return (
          <button
            key={value}
            ref={(el) => {
              pillRefs.current[value] = el;
            }}
            type="button"
            onClick={() => onSelect(value)}
            className={`shrink-0 px-4 py-1.5 rounded-full border font-sans font-semibold text-xs uppercase tracking-[0.05em] transition-colors duration-150 ${
              isActive
                ? 'bg-transparent border-ink text-ink'
                : 'bg-transparent border-transparent text-muted hover:text-ink'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
