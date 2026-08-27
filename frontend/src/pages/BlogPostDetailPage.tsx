import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

export default function BlogPostDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <Link to="/blog" className="inline-flex items-center space-x-2 text-xs font-semibold text-neutral-500 hover:text-primary-500">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Articles</span>
      </Link>

      <div className="space-y-4">
        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider rounded">
          Architectural Guide
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-charcoal leading-tight">
          Top 5 Architectural Trends Shaping Modern Chennai Villas in 2026
        </h1>
        <div className="flex items-center space-x-4 text-xs text-neutral-500 font-medium border-y border-neutral-concrete py-3">
          <span className="flex items-center space-x-1">
            <User className="w-3.5 h-3.5 text-primary-500" />
            <span>Er. S. Ramanathan (Principal Architect)</span>
          </span>
          <span className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-primary-500" />
            <span>August 15, 2026</span>
          </span>
        </div>
      </div>

      <img
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
        alt="Modern Villa Architecture"
        className="w-full h-80 md:h-[420px] object-cover rounded-architectural shadow-warm"
      />

      <div className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed space-y-6 text-base font-sans">
        <p>
          Building a luxury home in coastal Tamil Nadu requires balancing high humidity, seasonal monsoons, and intense tropical heat with contemporary aesthetics. Over the past year, SRM Homes has spearheaded several architectural innovations:
        </p>

        <h3 className="text-xl font-serif font-bold text-neutral-charcoal">1. Terracotta Jali Walls for Passive Cooling</h3>
        <p>
          Terracotta jali screens serve a dual function: they act as striking geometric visual facades while reducing direct solar thermal gain by up to 4°C through natural wind convection channels.
        </p>

        <h3 className="text-xl font-serif font-bold text-neutral-charcoal">2. Double-Height Courtyard Living</h3>
        <p>
          Integrating an open-to-sky central courtyard promotes vertical heat evacuation (the stack effect), keeping ground-floor family spaces naturally temperate throughout hot afternoon hours.
        </p>
      </div>
    </div>
  );
}
