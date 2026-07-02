export function formatPrice(price) {
  const num = Number(price);
  if (Number.isNaN(num)) return 'ETB 0.00';
  return `ETB ${num.toLocaleString('en-ET', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function roundToNearest10(value) {
  return Math.round(value / 10) * 10;
}

function stableSeed(itemId) {
  const s = String(itemId ?? '');
  let hash = 0;
  for (let i = 0; i < s.length; i += 1) {
    hash = (hash * 31 + s.charCodeAt(i)) % 1000;
  }
  return hash / 1000; // 0..0.999
}

export function getPublicPriceRange(price, itemId) {
  const base = Number(price);
  if (Number.isNaN(base) || base <= 0) return { low: 0, high: 0 };

  // Deterministic variation per item: 10-18% lower, 10-18% upper.
  const seed = stableSeed(itemId);
  const lowerPct = 0.10 + seed * 0.08;
  const upperPct = 0.10 + (1 - seed) * 0.08;

  let low = roundToNearest10(base * (1 - lowerPct));
  let high = roundToNearest10(base * (1 + upperPct));

  if (low < 10) low = 10;
  if (high <= low) high = low + 20;

  return { low, high };
}

export function formatPublicPriceRange(price, itemId) {
  const { low, high } = getPublicPriceRange(price, itemId);
  return `${formatPrice(low)} - ${formatPrice(high)}`;
}
