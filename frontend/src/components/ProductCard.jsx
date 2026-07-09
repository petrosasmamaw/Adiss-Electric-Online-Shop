import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconPhone, IconShoppingCart } from '@tabler/icons-react';
import { openContactModal, openOrderModal } from '../store/modalSlice';
import { formatPublicPriceRange } from '../utils/formatPrice';
import { getItemImages } from '../utils/itemImages';
import ProductImageCarousel from './ProductImageCarousel';
import ProductImageModal from './ProductImageModal';

export default function ProductCard({ item }) {
  const dispatch = useDispatch();
  const priceVisible = useSelector((state) => state.controls.price_visible);
  const images = getItemImages(item);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageModalIndex, setImageModalIndex] = useState(0);

  const handleContact = () => {
    dispatch(openContactModal(item));
  };

  const handleOrder = () => {
    dispatch(openOrderModal(item));
  };

  const handleImageClick = (index) => {
    setImageModalIndex(index);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };

  return (
    <>
      <article className="product-card bg-white rounded-xl border border-[#E6E8ED] overflow-hidden flex flex-col">
        <div className="product-card-image h-[180px] bg-[#F8F6F5] relative overflow-hidden rounded-t-xl border-b border-[#ECEAE8]">
          <ProductImageCarousel
            item={item}
            onImageClick={handleImageClick}
            paused={imageModalOpen}
          />
          <span className="product-card-badge absolute top-2 left-2 bg-[#E4EAFA] text-[#4A6BB5] text-[9px] font-bold uppercase tracking-[0.05em] px-2 py-0.5 rounded-full transition-colors duration-200 pointer-events-none">
            {item.category}
          </span>
        </div>

        <div className="px-3.5 py-3 flex-1 bg-white">
          <h3 className="product-card-title font-sans font-semibold text-[13px] text-[#111111] leading-snug line-clamp-2 mb-1 transition-colors duration-200">
            {item.name}
          </h3>
          {priceVisible ? (
            <div className="mt-1 pt-2 border-t border-[#F0F2F6] flex items-end justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#6B7280] mb-0.5">
                  Price + tax
                </p>
                <p className="font-condensed font-bold text-[15px] text-[#0056B3] leading-tight">
                  {formatPublicPriceRange(item)}
                </p>
              </div>
              <img
                src="/whitelogo.png"
                alt=""
                className="product-card-brand-logo shrink-0"
                aria-hidden="true"
              />
            </div>
          ) : (
            <div className="mt-1 pt-2 border-t border-[#F0F2F6] flex items-center justify-between gap-2">
              <p className="font-sans font-semibold text-[11px] text-[#6B7280] min-w-0">
                Price not available, contact admin
              </p>
              <img
                src="/whitelogo.png"
                alt=""
                className="product-card-brand-logo shrink-0"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        <div className="flex gap-1.5 px-3.5 pb-3.5 bg-white">
          <button
            type="button"
            onClick={handleContact}
            className="flex-1 h-8 rounded-md border border-[#3D6DB8] bg-white text-[#3D6DB8] text-[11px] font-bold uppercase tracking-[0.03em] hover:bg-[#F0F4FF] transition-colors duration-150 flex items-center justify-center gap-1"
          >
            <IconPhone size={13} /> Contact
          </button>
          <button
            type="button"
            onClick={handleOrder}
            className="flex-1 h-8 rounded-md bg-[#0056B3] border-none text-white text-[11px] font-bold uppercase tracking-[0.03em] hover:bg-[#004494] transition-colors duration-150 flex items-center justify-center gap-1"
          >
            <IconShoppingCart size={13} /> Order
          </button>
        </div>
      </article>

      <ProductImageModal
        isOpen={imageModalOpen}
        onClose={handleCloseImageModal}
        images={images}
        initialIndex={imageModalIndex}
        itemName={item.name}
      />
    </>
  );
}
