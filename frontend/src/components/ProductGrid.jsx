import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { IconBolt, IconSearch } from '@tabler/icons-react';
import { showToast } from '../store/toastSlice';
import { filterItems } from '../utils/filterItems';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

const GRID =
  'max-w-6xl mx-auto px-6 py-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

export default function ProductGrid() {
  const dispatch = useDispatch();
  const { items, loading, error, selectedCategory, searchQuery } = useSelector(
    (state) => state.items
  );

  const filteredItems = useMemo(
    () => filterItems(items, { search: searchQuery }),
    [items, searchQuery]
  );

  useEffect(() => {
    if (error) {
      dispatch(showToast(`Error: ${error}`, 'error', 5000));
    }
  }, [error, dispatch]);

  if (loading) {
    return (
      <div className={GRID}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p className="text-danger font-sans">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    const categoryLabel =
      selectedCategory === 'all' ? '' : `${selectedCategory} `;
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <IconBolt size={48} className="text-border mb-4" />
        <h2 className="font-condensed font-bold text-[22px] text-ink mb-1">
          No {categoryLabel}products yet
        </h2>
        <p className="font-sans text-[13px] text-muted">
          Check back soon — new items are added regularly
        </p>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <IconSearch size={48} className="text-border mb-4" />
        <h2 className="font-condensed font-bold text-[22px] text-ink mb-1">
          No results found
        </h2>
        <p className="font-sans text-[13px] text-muted">
          Try a different search term or category
        </p>
      </div>
    );
  }

  return (
    <div className={GRID}>
      {filteredItems.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}
