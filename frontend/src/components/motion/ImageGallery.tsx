import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export interface GalleryImage {
  url: string;
  alt?: string;
  isCover?: boolean;
  blurDataUrl?: string;
}

export interface ImageGalleryProps {
  images: GalleryImage[];
  layout?: 'grid' | 'masonry' | 'lightbox';
  className?: string;
}

export function ImageGallery({
  images,
  layout = 'grid',
  className = '',
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="p-8 border border-dashed border-neutral-concrete rounded-architectural text-center text-neutral-400">
        No project images available.
      </div>
    );
  }

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const nextImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  // Touch swipe support for mobile lightbox
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || selectedIndex === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (deltaX > 50) {
      prevImage();
    } else if (deltaX < -50) {
      nextImage();
    }
    setTouchStartX(null);
  };

  return (
    <div className={className}>
      {/* Grid or Masonry Layout */}
      <div
        className={
          layout === 'masonry'
            ? 'columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
        }
      >
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
            className="relative group overflow-hidden rounded-architectural bg-neutral-concrete/40 cursor-pointer shadow-warm-sm"
            onClick={() => openLightbox(idx)}
          >
            <LazyImage url={img.url} alt={img.alt || `Gallery Image ${idx + 1}`} />
            {img.isCover && (
              <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs px-2.5 py-1 rounded-md font-semibold tracking-wider uppercase shadow-md">
                Cover Photo
              </span>
            )}
            <div className="absolute inset-0 bg-neutral-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="w-8 h-8 text-white drop-shadow-md" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-neutral-charcoal/95 backdrop-blur-lg flex items-center justify-center p-4"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-3 text-neutral-sand hover:text-white bg-neutral-charcoal/50 hover:bg-neutral-charcoal rounded-full transition-colors z-50"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            {images.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-neutral-sand hover:text-white bg-neutral-charcoal/50 hover:bg-neutral-charcoal rounded-full transition-colors z-50 hidden sm:block"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {/* Image Container with Crossfade Transition */}
            <div className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-architectural">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedIndex}
                  src={images[selectedIndex].url}
                  alt={images[selectedIndex].alt || 'Gallery View'}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-full max-h-[85vh] object-contain mx-auto rounded-architectural shadow-2xl"
                />
              </AnimatePresence>
              <p className="text-center text-xs text-neutral-400 mt-2 font-medium">
                {selectedIndex + 1} / {images.length} — {images[selectedIndex].alt || 'SRM Homes Architectural Photo'}
              </p>
            </div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-neutral-sand hover:text-white bg-neutral-charcoal/50 hover:bg-neutral-charcoal rounded-full transition-colors z-50 hidden sm:block"
                aria-label="Next Image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LazyImage({ url, alt }: { url: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-64 overflow-hidden bg-neutral-concrete/60">
      <img
        src={url}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-500 ${
          loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-105'
        }`}
      />
    </div>
  );
}
