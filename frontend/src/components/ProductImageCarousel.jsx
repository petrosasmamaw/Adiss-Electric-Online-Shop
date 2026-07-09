import { useEffect, useState } from 'react';
import { IconBolt } from '@tabler/icons-react';
import { getItemImages } from '../utils/itemImages';

const SLIDE_INTERVAL_MS = 3000;

export default function ProductImageCarousel({ item, onImageClick, paused = false }) {
  const images = getItemImages(item);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [item.id, images.join('|')]);

  useEffect(() => {
    if (images.length <= 1 || paused) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [images.length, paused]);

  const handleOpen = () => {
    if (images.length === 0) return;
    onImageClick?.(activeIndex);
  };

  if (images.length === 0) {
    return (
      <div className="product-card-placeholder w-full h-full flex items-center justify-center">
        <IconBolt size={48} className="text-[#9AA8C4] opacity-50" />
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="product-card-image-btn w-full h-full block cursor-zoom-in"
        aria-label={`View ${item.name} image`}
      >
        <img
          src={images[0]}
          alt={item.name}
          className="w-full h-full object-cover pointer-events-none"
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="product-card-image-btn product-carousel h-full w-full block cursor-zoom-in"
      aria-label={`View ${item.name} images`}
    >
      <div
        className="product-carousel-track h-full"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {images.map((url) => (
          <img
            key={url}
            src={url}
            alt={item.name}
            className="product-carousel-slide pointer-events-none"
          />
        ))}
      </div>

      <div className="product-carousel-dots pointer-events-none" aria-hidden="true">
        {images.map((url, index) => (
          <span
            key={url}
            className={`product-carousel-dot ${index === activeIndex ? 'is-active' : ''}`}
          />
        ))}
      </div>
    </button>
  );
}
