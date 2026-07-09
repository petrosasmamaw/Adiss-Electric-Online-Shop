import { useEffect, useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';

export default function ProductImageModal({ isOpen, onClose, images, initialIndex = 0, itemName }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && images.length > 1) {
        setActiveIndex((i) => (i - 1 + images.length) % images.length);
      }
      if (e.key === 'ArrowRight' && images.length > 1) {
        setActiveIndex((i) => (i + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[activeIndex];
  const hasMultiple = images.length > 1;

  return (
    <div
      className={`product-image-modal fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${itemName} image preview`}
    >
      <div className="absolute inset-0 bg-black/85" aria-hidden="true" />

      <button
        type="button"
        onClick={onClose}
        className="product-image-modal-close absolute top-3 right-3 sm:top-5 sm:right-5 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
        aria-label="Close image preview"
      >
        <IconX size={22} stroke={2} />
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((i) => (i - 1 + images.length) % images.length);
            }}
            className="product-image-modal-nav product-image-modal-nav--prev absolute left-2 sm:left-4 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            <IconChevronLeft size={22} stroke={2} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((i) => (i + 1) % images.length);
            }}
            className="product-image-modal-nav product-image-modal-nav--next absolute right-2 sm:right-4 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            <IconChevronRight size={22} stroke={2} />
          </button>
        </>
      )}

      <div
        className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage}
          alt={itemName}
          className="product-image-modal-img max-h-[70vh] sm:max-h-[78vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
        />

        {hasMultiple && (
          <p className="text-white/80 text-xs sm:text-sm font-medium">
            {activeIndex + 1} / {images.length}
          </p>
        )}

        <p className="text-white text-sm sm:text-base font-semibold text-center px-4 line-clamp-2 max-w-lg">
          {itemName}
        </p>
      </div>
    </div>
  );
}
