export function formatPrice(price) {
  const num = Number(price);
  if (Number.isNaN(num)) return 'ETB 0.00';
  return `ETB ${num.toLocaleString('en-ET', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getPriceRangeFromItem(item) {
  const low = Number(item?.lower_price ?? item?.price);
  const high = Number(item?.upper_price ?? item?.price);
  if (Number.isNaN(low) || Number.isNaN(high)) return { low: 0, high: 0 };
  if (high < low) return { low: high, high: low };
  return { low, high };
}

export function formatPublicPriceRange(item) {
  const { low, high } = getPriceRangeFromItem(item);
  return `${formatPrice(low)} - ${formatPrice(high)}`;
}
