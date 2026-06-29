import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Hero from '../components/Hero';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import { fetchItems } from '../store/itemsSlice';
import { fetchCategories } from '../store/categoriesSlice';

export default function Storefront() {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.items.selectedCategory);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchItems(selectedCategory));
  }, [dispatch, selectedCategory]);

  return (
    <main>
      <Hero />
      <div className="px-6">
        <div className="current-rule" />
      </div>
      <CategoryFilter />
      <div className="px-6">
        <div className="current-rule" />
      </div>
      <ProductGrid />
    </main>
  );
}
