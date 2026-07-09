import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Hero from '../components/Hero';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import { fetchItems } from '../store/itemsSlice';
import { fetchCategories } from '../store/categoriesSlice';
import { fetchControls } from '../store/controlsSlice';

export default function Storefront() {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.items.selectedCategory);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchControls());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchItems(selectedCategory));
  }, [dispatch, selectedCategory]);

  return (
    <main>
      <Hero />
      <div className="px-6">
        <div className="section-divider" />
      </div>
      <CategoryFilter />
      <div className="px-6">
        <div className="section-divider" />
      </div>
      <ProductGrid />
      <footer className="px-6 pb-10 pt-2">
        <p className="text-center text-[11px] text-muted leading-relaxed max-w-2xl mx-auto">
          Addis Electric Shop Online - created by Petros Asmamaw (0989886956)
        </p>
      </footer>
    </main>
  );
}
