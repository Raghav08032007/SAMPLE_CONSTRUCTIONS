import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroDissolveBanner from '../components/HeroDissolveBanner';
import { ScrollReveal, ScrollRevealGroup } from '../components/motion/ScrollReveal';
import { useCountUp } from '../hooks/useCountUp';
import { apiClient } from '../lib/api';
import { ArrowRight, ChevronLeft, ChevronRight, Star, ShieldCheck, Award, Building, MapPin, CheckCircle2 } from 'lucide-react';

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string;
  budget_range: string;
  project_images?: { image_url: string; is_cover?: boolean; image_type?: string }[];
}

interface TestimonialItem {
  id: string;
  client_name: string;
  rating: number;
  quote: string;
}

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<ProjectItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Fetch featured projects
    apiClient.get('/projects?featured=true').then((res) => {
      setFeaturedProjects(res.data.projects || []);
    }).catch(() => {});

    // Fetch testimonials
    apiClient.get('/testimonials').then((res) => {
      setTestimonials(res.data.testimonials || []);
    }).catch(() => {});
  }, []);

  // Auto advance testimonials carousel every 6s unless hovered
  useEffect(() => {
    if (testimonials.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length, isHovered]);

  return (
    <div className="space-y-16 pb-16">
      {/* Integrated 100% Full-Screen Edge-to-Edge Hero Banner */}
      <section className="-mt-6">
        <HeroDissolveBanner />
      </section>

      {/* Trust Bar (Animated Stats Counter) */}
      <section className="bg-neutral-charcoal text-neutral-sand py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatBox value={15} suffix="+" label="Years in Business" />
          <StatBox value={120} suffix="+" label="Projects Completed" />
          <StatBox value={450} suffix="k+" label="Sq Ft Built" />
          <StatBox value={8} suffix="" label="Cities Served" />
        </div>
      </section>

      {/* Featured Projects Horizontally Scrollable Carousel */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-semibold tracking-wider text-primary-500">Selected Portfolio</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-charcoal">Featured Projects</h2>
          </div>
          <Link to="/projects" className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center space-x-1">
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory">
          {featuredProjects.map((project) => {
            const coverImg = project.project_images?.find((img) => img.image_type === 'cover' || img.is_cover)?.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
            return (
              <div key={project.id} className="min-w-[300px] sm:min-w-[360px] max-w-[360px] snap-start flex-shrink-0">
                <Link to={`/projects/${project.slug}`} className="group block bg-white rounded-architectural overflow-hidden border border-neutral-concrete shadow-warm transition-transform duration-300 hover:-translate-y-1">
                  <div className="relative h-60 overflow-hidden bg-neutral-concrete">
                    <img src={coverImg} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 right-3 bg-neutral-charcoal/80 text-neutral-sand text-xs px-2.5 py-1 rounded font-medium uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="flex items-center text-xs text-neutral-500 space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-primary-500" />
                      <span>{project.location}</span>
                    </div>
                    <h3 className="text-lg font-serif font-semibold text-neutral-charcoal group-hover:text-primary-500 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium">Budget: {project.budget_range}</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials Carousel */}
      {testimonials.length > 0 && (
        <section
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-primary-50 py-16 px-6 border-y border-primary-200"
        >
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <span className="text-xs uppercase font-semibold tracking-wider text-primary-600">Client Endorsements</span>
            <h2 className="text-3xl font-serif font-bold text-neutral-charcoal">What Our Homeowners Say</h2>

            <div className="p-8 bg-white rounded-architectural border border-primary-200 shadow-warm relative">
              <div className="flex justify-center space-x-1 text-amber-400 mb-4">
                {[...Array(testimonials[activeTestimonialIdx].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg font-serif text-neutral-700 italic max-w-2xl mx-auto">
                "{testimonials[activeTestimonialIdx].quote}"
              </blockquote>
              <p className="mt-4 font-semibold text-neutral-charcoal text-sm">
                — {testimonials[activeTestimonialIdx].client_name}
              </p>

              {/* Navigation dots */}
              <div className="flex justify-center space-x-2 mt-6">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonialIdx(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === activeTestimonialIdx ? 'bg-primary-500 w-6' : 'bg-neutral-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Band */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-architectural p-10 md:p-12 text-center space-y-6 shadow-warm-lg">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Ready to Construct Your Vision?</h2>
          <p className="text-primary-100 max-w-xl mx-auto text-base">
            Get an instant cost estimate or speak directly with our principal structural engineers today.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-architectural hover:bg-neutral-sand transition-all shadow-md transform hover:-translate-y-0.5"
          >
            <span>Get a Free Quote</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatBox({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const count = useCountUp(value, 2000);
  return (
    <div className="space-y-1">
      <p className="text-4xl sm:text-5xl font-serif font-bold text-primary-400">
        {count}{suffix}
      </p>
      <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">{label}</p>
    </div>
  );
}
