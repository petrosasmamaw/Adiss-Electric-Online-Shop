import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconBolt, IconPlus, IconEdit, IconTrash, IconSearch } from '@tabler/icons-react';
import {
  fetchAdminItems,
  deleteItem,
  openItemModal,
} from '../../store/adminSlice';
import { fetchCategories } from '../../store/categoriesSlice';
import { showToast } from '../../store/toastSlice';
import { formatPrice, getPriceRangeFromItem } from '../../utils/formatPrice';
import { filterItems } from '../../utils/filterItems';
import { getItemImages } from '../../utils/itemImages';
import CategoryPills from '../CategoryPills';
import ItemSearchBar from '../ItemSearchBar';
import ItemFormModal from './ItemFormModal';

function Thumbnail({ imageUrl, name }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-10 h-10 object-cover rounded-lg bg-smoke border border-border"
      />
    );
  }
  return (
    <div className="w-10 h-10 bg-smoke border border-border rounded-lg flex items-center justify-center">
      <IconBolt size={14} className="text-muted/70" />
    </div>
  );
}

const badgeClass =
  'inline-block bg-transparent border border-ink text-ink text-[9px] font-bold uppercase tracking-[0.05em] px-2 py-0.5 rounded-full';

function formatItemRange(item) {
  const { low, high } = getPriceRangeFromItem(item);
  return `${formatPrice(low)} - ${formatPrice(high)}`;
}

export default function ItemsManager() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.admin);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = useMemo(
    () => filterItems(items, { search: searchQuery, category: selectedCategory }),
    [items, searchQuery, selectedCategory]
  );

  useEffect(() => {
    dispatch(fetchAdminItems())
      .unwrap()
      .catch((err) => dispatch(showToast(`Error: ${err}`, 'error', 5000)));
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = (item) => {
    if (window.confirm(`Delete "${item.name}"?`)) {
      dispatch(deleteItem(item.id))
        .unwrap()
        .then(() => dispatch(showToast('Item deleted.', 'neutral')))
        .catch((err) => dispatch(showToast(`Error: ${err}`, 'error', 5000)));
    }
  };

  const hasFilters = searchQuery.trim() !== '' || selectedCategory !== 'all';

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-condensed font-bold text-[24px] text-ink">Items</h1>
        <button
          type="button"
          onClick={() => dispatch(openItemModal(null))}
          className="bg-amber text-ink px-4 py-2 rounded-md font-sans font-bold text-[13px] uppercase tracking-[0.04em] hover:bg-amber2 transition-colors duration-150 flex items-center gap-1.5"
        >
          <IconPlus size={16} /> Add Item
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border p-4 mb-5 space-y-3">
        <ItemSearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
          loading={categoriesLoading}
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-14 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-danger font-sans">{error}</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-border py-16 text-center">
          <IconBolt size={36} className="text-border mx-auto mb-3" />
          <p className="font-sans text-[13px] text-muted">No items yet. Add your first item.</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-border py-16 text-center">
          <IconSearch size={36} className="text-border mx-auto mb-3" />
          <p className="font-sans text-[13px] text-muted">
            {hasFilters ? 'No items match your search or filter.' : 'No items found.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-border overflow-hidden">
            <table className="w-full font-sans">
              <thead>
                <tr className="bg-smoke border-b border-border">
                  <th className="text-left px-4 py-3 font-bold text-[11px] text-muted uppercase tracking-[0.06em]">Image</th>
                  <th className="text-left px-4 py-3 font-bold text-[11px] text-muted uppercase tracking-[0.06em]">Name</th>
                  <th className="text-left px-4 py-3 font-bold text-[11px] text-muted uppercase tracking-[0.06em]">Category</th>
                  <th className="text-left px-4 py-3 font-bold text-[11px] text-muted uppercase tracking-[0.06em]">Price</th>
                  <th className="text-left px-4 py-3 font-bold text-[11px] text-muted uppercase tracking-[0.06em]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border hover:bg-smoke transition-colors duration-100"
                  >
                    <td className="px-4 py-3">
                      <Thumbnail imageUrl={getItemImages(item)[0]} name={item.name} />
                    </td>
                    <td className="px-4 py-3 font-semibold text-[13px] text-ink">{item.name}</td>
                    <td className="px-4 py-3">
                      <span className={badgeClass}>{item.category}</span>
                    </td>
                    <td className="px-4 py-3 font-condensed font-bold text-[15px] text-amber">
                      {formatItemRange(item)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => dispatch(openItemModal(item))}
                          className="w-8 h-8 rounded-md bg-amber-tint text-amber2 hover:bg-amber/20 transition-colors flex items-center justify-center"
                          aria-label="Edit"
                        >
                          <IconEdit size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="w-8 h-8 rounded-md bg-[#FDEAEA] text-danger hover:bg-danger/20 transition-colors flex items-center justify-center"
                          aria-label="Delete"
                        >
                          <IconTrash size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-border p-4">
                <div className="flex gap-3 mb-3">
                  <Thumbnail imageUrl={getItemImages(item)[0]} name={item.name} />
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-semibold text-[14px] text-ink truncate">
                      {item.name}
                    </p>
                    <span className={`${badgeClass} mt-1`}>{item.category}</span>
                    <p className="font-condensed font-bold text-[16px] text-amber mt-1">
                      {formatItemRange(item)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => dispatch(openItemModal(item))}
                    className="flex-1 h-11 rounded-md bg-amber-tint text-amber2 text-[13px] font-bold uppercase tracking-[0.03em] hover:bg-amber/20 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <IconEdit size={15} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="flex-1 h-11 rounded-md bg-[#FDEAEA] text-danger text-[13px] font-bold uppercase tracking-[0.03em] hover:bg-danger/20 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <IconTrash size={15} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ItemFormModal />
    </div>
  );
}
