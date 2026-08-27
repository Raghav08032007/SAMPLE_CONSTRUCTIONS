import React, { useState, useRef, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';

export interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number; // 0 to 100
  className?: string;
}

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeLabel = 'BEFORE',
  afterLabel = 'AFTER (SRM HOMES)',
  initialPosition = 50,
  className = '',
}: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth spring motion for slider position
  const springPos = useSpring(sliderPos, { stiffness: 400, damping: 35 });

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
    springPos.set(percentage);
  }, [springPos]);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPos((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="slider"
      aria-label="Before and After Construction Comparison Slider"
      aria-valuenow={Math.round(sliderPos)}
      aria-valuemin={0}
      aria-valuemax={100}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className={`relative overflow-hidden rounded-architectural select-none cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-warm-lg ${className}`}
    >
      {/* After Image (Background Layer) */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={afterUrl}
          alt="After renovation/construction"
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-4 right-4 bg-primary-500/90 text-white text-xs font-semibold px-3 py-1.5 rounded-md backdrop-blur-sm tracking-wider uppercase">
          {afterLabel}
        </span>
      </div>

      {/* Before Image (Clipped Overlay Layer) */}
      <div
        className="absolute inset-0 h-full overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeUrl}
          alt="Before renovation"
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
        />
        <span className="absolute bottom-4 left-4 bg-neutral-charcoal/80 text-neutral-sand text-xs font-semibold px-3 py-1.5 rounded-md backdrop-blur-sm tracking-wider uppercase">
          {beforeLabel}
        </span>
      </div>

      {/* Divider Bar & Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20"
        style={{ left: `${sliderPos}%` }}
      >
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-primary-600 shadow-warm-lg flex items-center justify-center border-2 border-primary-500"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MoveHorizontal className="w-5 h-5" />
        </motion.div>
      </div>
    </div>
  );
}
