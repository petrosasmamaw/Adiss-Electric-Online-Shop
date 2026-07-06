import { useEffect, useState } from 'react';
import { IconBolt } from '@tabler/icons-react';
import { getItemImages } from '../utils/itemImages';

const SLIDE_INTERVAL_MS = 3000;

export default function ProductImageCarousel({ item }) {
  const images = getItemImages(item);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [item.id, images.join('|')]);

  useEffect(() => {
    if (images.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="product-card-placeholder w-full h-full flex items-center justify-center">
        <IconBolt size={48} className="text-[#9AA8C4] opacity-50" />
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt={item.name}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div className="product-carousel h-full">
      <div
        className="product-carousel-track h-full"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {images.map((url) => (
          <img
            key={url}
            src={url}
            alt={item.name}
            className="product-carousel-slide"
          />
        ))}
      </div>

      <div className="product-carousel-dots" aria-hidden="true">
        {images.map((url, index) => (
          <span
            key={url}
            className={`product-carousel-dot ${index === activeIndex ? 'is-active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
