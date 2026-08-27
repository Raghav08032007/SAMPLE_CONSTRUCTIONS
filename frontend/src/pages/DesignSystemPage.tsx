import React, { useState } from 'react';
import Scene3D, { ModelType } from '../components/motion/Scene3D';
import { ScrollReveal, ScrollRevealGroup } from '../components/motion/ScrollReveal';
import { ImageGallery } from '../components/motion/ImageGallery';
import { BeforeAfterSlider } from '../components/motion/BeforeAfterSlider';
import { Sparkles, Layers, Sliders, Image, Box } from 'lucide-react';

const sampleImages = [
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Contemporary Luxury Villa in Chennai',
    isCover: true,
  },
  {
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    alt: 'Modern Open-Concept Living Room Architecture',
  },
  {
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Minimalist Architectural Exterior',
  },
  {
    url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Custom Master Suite with Warm Terracotta Tones',
  },
];

const sampleBefore = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80';
const sampleAfter = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

export default function DesignSystemPage() {
  const [modelType, setModelType] = useState<ModelType>('house-silhouette');
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* Page Header */}
      <ScrollReveal direction="down">
        <div className="border-b border-neutral-concrete pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 1 Motion Foundation</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-neutral-charcoal">
              Design System Showcase & QA
            </h1>
            <p className="text-neutral-600 mt-1">
              Visual isolation testing page for 3D visualizers, scroll animations, image galleries, and before/after sliders.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* 1. Scene3D Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Box className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-serif font-semibold text-neutral-charcoal">
              1. 3D Architectural Scene (&lt;Scene3D /&gt;)
            </h2>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
                className="rounded text-primary-500 focus:ring-primary-500"
              />
              <span>Auto Rotate</span>
            </label>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value as ModelType)}
              className="bg-white border border-neutral-concrete text-xs rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="house-silhouette">House Silhouette</option>
              <option value="blueprint">Blueprint</option>
              <option value="abstract-structure">Abstract Structure</option>
            </select>
          </div>
        </div>

        <Scene3D modelType={modelType} autoRotate={autoRotate} className="w-full h-80 md:h-[420px]" />
      </section>

      {/* 2. ScrollReveal & ScrollRevealGroup */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3">
          <Layers className="w-6 h-6 text-primary-500" />
          <h2 className="text-2xl font-serif font-semibold text-neutral-charcoal">
            2. Scroll Animations (&lt;ScrollReveal /&gt;)
          </h2>
        </div>

        <ScrollRevealGroup staggerChildren={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-architectural bg-white border border-neutral-concrete shadow-warm space-y-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-primary-500">Staggered Card 1</span>
            <h3 className="text-lg font-serif font-semibold">Architectural Design</h3>
            <p className="text-sm text-neutral-600">Custom floor plans and elevation modeling tailored for modern urban homes.</p>
          </div>

          <div className="p-6 rounded-architectural bg-white border border-neutral-concrete shadow-warm space-y-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-primary-500">Staggered Card 2</span>
            <h3 className="text-lg font-serif font-semibold">Turnkey Construction</h3>
            <p className="text-sm text-neutral-600">Complete end-to-end execution with premium material guarantees.</p>
          </div>

          <div className="p-6 rounded-architectural bg-white border border-neutral-concrete shadow-warm space-y-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-primary-500">Staggered Card 3</span>
            <h3 className="text-lg font-serif font-semibold">Renovation & Fitout</h3>
            <p className="text-sm text-neutral-600">Transforming existing structures with state-of-the-art spatial layouts.</p>
          </div>
        </ScrollRevealGroup>
      </section>

      {/* 3. ImageGallery Showcase */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3">
          <Image className="w-6 h-6 text-primary-500" />
          <h2 className="text-2xl font-serif font-semibold text-neutral-charcoal">
            3. Lightbox Gallery (&lt;ImageGallery /&gt;)
          </h2>
        </div>

        <ImageGallery images={sampleImages} layout="grid" />
      </section>

      {/* 4. BeforeAfterSlider Showcase */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3">
          <Sliders className="w-6 h-6 text-primary-500" />
          <h2 className="text-2xl font-serif font-semibold text-neutral-charcoal">
            4. Before & After Slider (&lt;BeforeAfterSlider /&gt;)
          </h2>
        </div>
        <p className="text-sm text-neutral-600">Drag handle left/right or use Left/Right Arrow keys when focused.</p>

        <BeforeAfterSlider
          beforeUrl={sampleBefore}
          afterUrl={sampleAfter}
          beforeLabel="OLD STRUCTURE"
          afterLabel="SRM HOMES REDESIGN"
          className="w-full h-80 md:h-[450px]"
        />
      </section>
    </div>
  );
}
