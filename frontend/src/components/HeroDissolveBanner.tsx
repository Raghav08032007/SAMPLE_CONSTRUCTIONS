import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, ShieldCheck } from 'lucide-react';

interface SlideItem {
  id: number;
  title: string;
  subtitle: string;
  location: string;
  category: string;
  image: string;
}

const HERO_SLIDES: SlideItem[] = [
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

export default function HeroDissolveBanner() {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-dissolve transition every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[85vh] bg-neutral-charcoal group overflow-hidden flex flex-col justify-between">
      {/* Layer 1: Edge-to-Edge 100% Full-Width Dissolving Background Images */}
      {HERO_SLIDES.map((slide, idx) => {
        const isActive = idx === currentIdx;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-[1600ms] ease-in-out ${
              isActive
                ? 'opacity-100 scale-100 z-0 filter-none'
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
            {/* Premium Gradient Dark Overlay for crystal clear typography on laptop & mobile */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-charcoal/95 via-neutral-charcoal/75 to-neutral-charcoal/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-charcoal/90 via-transparent to-black/30" />
          </div>
        );
      })}

      {/* Layer 2: Main Hero Content (Perfectly Aligned Container for Laptops & Mobile) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex-1 flex flex-col justify-between py-12 lg:py-16 space-y-8">
        
        {/* Top/Middle Text Content */}
        <div className="space-y-6 max-w-3xl pt-2">
          <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary-500/20 backdrop-blur-md text-primary-300 text-xs font-bold uppercase tracking-wider border border-primary-400/30">
            <ShieldCheck className="w-4 h-4 text-primary-400" />
            <span>Pioneering Architectural Luxury</span>
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white leading-tight sm:leading-[1.15] tracking-wide">
            We Build Homes That <span className="text-primary-400 underline decoration-primary-500/50">Define Generations</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-neutral-200 leading-relaxed font-sans max-w-2xl">
            From bespoke residential villas to modern commercial landmark structures, SRM Homes blends timeless architectural aesthetics with uncompromised engineering precision.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2 sm:pt-4">
            <Link
              to="/contact"
              className="px-7 py-4 rounded-architectural bg-primary-500 hover:bg-primary-600 text-white font-semibold flex items-center justify-center space-x-2 shadow-warm-lg hover:shadow-warm transition-all transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              <span>Get a Free Quote</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/projects"
              className="px-7 py-4 rounded-architectural bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 backdrop-blur-md shadow-warm-sm transition-all text-center text-sm sm:text-base"
            >
              Explore Portfolio
            </Link>
          </div>
        </div>

        {/* Layer 3: Active Project Showcase Bar & Slider Controls */}
        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="px-2.5 py-0.5 bg-primary-500 text-white text-[10px] font-bold uppercase tracking-wider rounded">
                {HERO_SLIDES[currentIdx].category}
              </span>
              <div className="flex items-center space-x-1 text-xs text-neutral-300 font-medium bg-black/40 px-2.5 py-0.5 rounded backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5 text-primary-400" />
                <span>{HERO_SLIDES[currentIdx].location}</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-serif font-bold text-white transition-all duration-700">
              Featured Design: {HERO_SLIDES[currentIdx].title}
            </p>
          </div>

          {/* Navigation Controls & Dot Indicators */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                aria-label="Previous Slide"
                className="p-2.5 rounded-full bg-white/10 hover:bg-primary-500 text-white backdrop-blur-md transition-all duration-300 border border-white/10"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Slide"
                className="p-2.5 rounded-full bg-white/10 hover:bg-primary-500 text-white backdrop-blur-md transition-all duration-300 border border-white/10"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-700 ${
                    idx === currentIdx ? 'w-8 bg-primary-400' : 'w-2 bg-white/30 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
