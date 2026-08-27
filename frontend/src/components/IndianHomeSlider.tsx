import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SlideItem {
  id: number;
  title: string;
  subtitle: string;
  location: string;
  image: string;
  category: string;
}

const INDIAN_SLIDES: SlideItem[] = [
  {
    id: 1,
    title: 'The Chettinad Terracotta Villa',
    subtitle: 'Modern passive climate cooling with heritage clay jali screens & open sky courtyard',
    location: 'Anna Nagar, Chennai',
    category: 'Luxury Residential',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 2,
    title: 'Contemporary ECR Coastal Residence',
    subtitle: 'Sun-drenched double-height living spaces with teak wood louvers & infinity pool',
    location: 'ECR Coast, Chennai',
    category: 'Coastal Villa',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 3,
    title: 'Tropical Courtyard Haven',
    subtitle: 'Traditional South Indian thotti-katta inner courtyard blended with modern glass facades',
    location: 'Coimbatore, Tamil Nadu',
    category: 'Modern Heritage',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 4,
    title: 'Apex Architectural Glass Mansion',
    subtitle: 'Sleek geometric cantilevered structural design with sustainable solar roof panels',
    location: 'OMR Corridor, Chennai',
    category: 'Contemporary Mansion',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
  },
];

export default function IndianHomeSlider() {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Automatic slide dissolution transition every 3.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % INDIAN_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? INDIAN_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % INDIAN_SLIDES.length);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6">
      <div className="relative h-[440px] sm:h-[520px] md:h-[580px] w-full overflow-hidden rounded-architectural shadow-warm-lg border border-neutral-concrete group bg-neutral-charcoal">
        {/* Cross-Dissolve Image Slides */}
        {INDIAN_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIdx;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
                isActive
                  ? 'opacity-100 scale-100 z-10 filter-none'
                  : 'opacity-0 scale-105 z-0 blur-sm pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full object-cover transition-transform duration-[4000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-charcoal/95 via-neutral-charcoal/40 to-transparent" />
            </div>
          );
        })}

        {/* Text Content with Dissolve Fade Effect */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-10 text-white space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-primary-500 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow transition-opacity duration-700">
              {INDIAN_SLIDES[currentIdx].category}
            </span>
            <div className="flex items-center space-x-1.5 text-xs text-neutral-300 font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-md">
              <MapPin className="w-3.5 h-3.5 text-primary-400" />
              <span>{INDIAN_SLIDES[currentIdx].location}</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-white tracking-wide leading-tight transition-all duration-700">
            {INDIAN_SLIDES[currentIdx].title}
          </h2>

          <p className="text-xs sm:text-sm text-neutral-200 max-w-2xl font-sans leading-relaxed transition-all duration-700">
            {INDIAN_SLIDES[currentIdx].subtitle}
          </p>

          <div className="pt-2 flex items-center space-x-4">
            <Link
              to="/projects"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white text-neutral-charcoal hover:bg-primary-500 hover:text-white font-semibold text-xs rounded-architectural transition-all duration-300 shadow-md"
            >
              <span>Explore Project Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Previous & Next Controls */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 hover:bg-primary-500 text-white backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 hover:bg-primary-500 text-white backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Progress Bar & Indicators */}
        <div className="absolute bottom-6 right-6 z-30 flex items-center space-x-2">
          {INDIAN_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`h-2.5 rounded-full transition-all duration-700 ${
                idx === currentIdx ? 'w-8 bg-primary-500' : 'w-2.5 bg-white/40 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
