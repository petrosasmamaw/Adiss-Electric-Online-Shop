export function filterItems(items, { search = '', category = 'all' } = {}) {
  let result = items;

  if (category && category !== 'all') {
    result = result.filter((item) => item.category === category);
  }

  const q = search.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }

  return result;
}
