import React, { Suspense, useMemo, useEffect, useState } from 'react';

export type ModelType = 'blueprint' | 'abstract-structure' | 'house-silhouette';

export interface Scene3DProps {
  modelType?: ModelType;
  autoRotate?: boolean;
  intensity?: number;
  className?: string;
}

// Check for low-end devices or reduced motion preference
function usePerformanceCapabilities() {
  const [shouldUseFallback, setShouldUseFallback] = useState(false);

  useEffect(() => {
    // 1. Reduced motion media query check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. Hardware concurrency check
    const lowHardware = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 4) < 4;

    // 3. WebGL support check
    let webglSupported = true;
    try {
      const canvas = document.createElement('canvas');
      webglSupported = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      webglSupported = false;
    }

    if (prefersReducedMotion || lowHardware || !webglSupported) {
      setShouldUseFallback(true);
    }
  }, []);

  return shouldUseFallback;
}

// Lazy-loaded R3F Three Canvas component to prevent main bundle bloating
const LazyThreeCanvas = React.lazy(() => import('./ThreeCanvasInner'));

export default function Scene3D({
  modelType = 'house-silhouette',
  autoRotate = true,
  intensity = 1,
  className = 'w-full h-64 md:h-96',
}: Scene3DProps) {
  const isFallback = usePerformanceCapabilities();

  if (isFallback) {
    return <StaticFallbackScene modelType={modelType} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden rounded-architectural bg-neutral-charcoal/5 ${className}`}>
      <Suspense fallback={<StaticFallbackScene modelType={modelType} className={className} isPlaceholder />}>
        <LazyThreeCanvas modelType={modelType} autoRotate={autoRotate} intensity={intensity} />
      </Suspense>
    </div>
  );
}

function StaticFallbackScene({
  modelType,
  className,
  isPlaceholder = false,
}: {
  modelType: ModelType;
  className: string;
  isPlaceholder?: boolean;
}) {
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#2a2824] to-[#1c1b18] text-neutral-sand rounded-architectural border border-neutral-concrete/20 relative overflow-hidden ${className}`}
    >
      {/* Decorative architectural grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#c25e2e_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

      {/* SVG Silhouette representation */}
      <div className="relative z-10 space-y-4">
        {modelType === 'house-silhouette' && (
          <svg className="w-24 h-24 mx-auto text-primary-400 animate-pulse-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h14a1 1 0 001-1V10M9 21V12h6v9" />
          </svg>
        )}

        {modelType === 'blueprint' && (
          <svg className="w-24 h-24 mx-auto text-primary-400 animate-pulse-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 01-2-2h-2a2 2 0 01-2 2" />
          </svg>
        )}

        {modelType === 'abstract-structure' && (
          <svg className="w-24 h-24 mx-auto text-primary-400 animate-pulse-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )}

        <div className="space-y-1">
          <p className="font-serif text-lg tracking-wide text-white">
            {modelType.replace('-', ' ').toUpperCase()} ARCHITECTURE
          </p>
          <p className="text-xs text-neutral-400">
            {isPlaceholder ? 'Loading 3D Visualizer...' : 'Static Fallback Mode Active (Performance / Reduced Motion)'}
          </p>
        </div>
      </div>
    </div>
  );
}
