import { useEffect, useRef } from 'react';

export default function CategoryPills({
  categories,
  selectedCategory,
  onSelect,
  loading = false,
}) {
  const pillRefs = useRef({});
  const pills = ['all', ...categories];

  useEffect(() => {
    const el = pillRefs.current[selectedCategory];
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedCategory]);

  const label = (cat) => (cat === 'all' ? 'All' : cat);

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {loading && categories.length === 0 ? (
        <>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-shimmer h-8 w-24 rounded-full shrink-0" />
          ))}
        </>
      ) : (
        pills.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              ref={(el) => {
                pillRefs.current[cat] = el;
              }}
              type="button"
              onClick={() => onSelect(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full font-sans font-semibold text-xs uppercase tracking-[0.05em] transition-colors duration-150 ${
                isActive
                  ? 'bg-ink text-amber'
                  : 'bg-transparent text-muted hover:text-ink'
              }`}
            >
              {label(cat)}
            </button>
          );
        })
      )}
    </div>
  );
}
