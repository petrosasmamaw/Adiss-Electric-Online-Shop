import { useDispatch, useSelector } from 'react-redux';
import { setCategory, setSearchQuery } from '../store/itemsSlice';
import CategoryPills from './CategoryPills';
import ItemSearchBar from './ItemSearchBar';

export default function CategoryFilter() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);
  const { selectedCategory, searchQuery } = useSelector((state) => state.items);

  return (
    <div className="bg-white border-y border-[#E8ECF4] shadow-[0_1px_0_rgba(0,86,179,0.04)]">
      <div className="max-w-6xl mx-auto px-6 py-3 space-y-3">
        <ItemSearchBar
          value={searchQuery}
          onChange={(value) => dispatch(setSearchQuery(value))}
        />
        <CategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={(cat) => dispatch(setCategory(cat))}
          loading={loading}
        />
      </div>
    </div>
  );
}
