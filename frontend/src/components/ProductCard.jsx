import { useDispatch, useSelector } from 'react-redux';
import { IconBolt, IconPhone, IconShoppingCart } from '@tabler/icons-react';
import { openContactModal, openOrderModal } from '../store/modalSlice';
import { formatPublicPriceRange } from '../utils/formatPrice';

export default function ProductCard({ item }) {
  const dispatch = useDispatch();
  const priceVisible = useSelector((state) => state.controls.price_visible);

  const handleContact = () => {
    dispatch(openContactModal(item));
  };

  const handleOrder = () => {
    dispatch(openOrderModal(item));
  };

  return (
    <article className="bg-white rounded-xl border border-border overflow-hidden cursor-pointer hover:border-ink transition-colors duration-150 flex flex-col">
      <div className="h-[180px] bg-smoke relative overflow-hidden rounded-t-xl border-b border-border">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <IconBolt size={48} className="text-muted opacity-40" />
          </div>
        )}
        <span className="absolute top-2 left-2 bg-transparent border border-ink text-ink text-[9px] font-bold uppercase tracking-[0.05em] px-2 py-0.5 rounded-full">
          {item.category}
        </span>
      </div>

      <div className="px-3.5 py-3 flex-1">
        <h3 className="font-sans font-semibold text-[13px] text-ink leading-snug line-clamp-2 mb-1">
          {item.name}
        </h3>
        {priceVisible ? (
          <p className="font-condensed font-bold text-[20px] text-amber mb-2.5">
            {formatPublicPriceRange(item)}
          </p>
        ) : (
          <p className="font-sans font-semibold text-[12px] text-muted mb-2.5">
            Price not available, contact admin
          </p>
        )}
      </div>

      <div className="flex gap-1.5 px-3.5 pb-3.5">
        <button
          type="button"
          onClick={handleContact}
          className="flex-1 h-8 rounded-md border border-border bg-transparent text-ink text-[11px] font-bold uppercase tracking-[0.03em] hover:border-ink transition-colors duration-150 flex items-center justify-center gap-1"
        >
          <IconPhone size={13} /> Contact
        </button>
        <button
          type="button"
          onClick={handleOrder}
          className="flex-1 h-8 rounded-md bg-amber border-none text-ink text-[11px] font-bold uppercase tracking-[0.03em] hover:bg-amber2 transition-colors duration-150 flex items-center justify-center gap-1"
        >
          <IconShoppingCart size={13} /> Order
        </button>
      </div>
    </article>
  );
}
