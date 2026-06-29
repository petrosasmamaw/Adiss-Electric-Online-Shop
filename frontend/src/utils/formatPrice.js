export function formatPrice(price) {
  const num = Number(price);
  if (Number.isNaN(num)) return 'ETB 0.00';
  return `ETB ${num.toLocaleString('en-ET', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
