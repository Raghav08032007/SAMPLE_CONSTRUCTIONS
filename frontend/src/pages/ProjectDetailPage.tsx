import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { ImageGallery, GalleryImage } from '../components/motion/ImageGallery';
import { BeforeAfterSlider } from '../components/motion/BeforeAfterSlider';
import { ScrollReveal } from '../components/motion/ScrollReveal';
import { MapPin, Calendar, Clock, Maximize, DollarSign, ArrowLeft, Star, Quote, ExternalLink, Navigation, Compass } from 'lucide-react';

interface ProjectDetail {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string;
  lat?: number;
  lng?: number;
  map_url?: string;
  plot_size: number;
  built_up_area: number;
  duration_months: number;
  budget_range: string;
  completion_date: string;
  description: string;
  project_images?: { id: string; image_url: string; image_type: string; is_cover?: boolean }[];
  testimonial?: { client_name: string; rating: number; quote: string };
  similar_projects?: { id: string; title: string; slug: string; category: string; location: string; project_images?: { image_url: string }[] }[];
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error404, setError404] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      if (!slug) return;
      setLoading(true);
      setError404(false);
      try {
        const res = await apiClient.get(`/projects/${slug}`);
        setProject(res.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError404(true);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-neutral-500 font-medium">Loading Architectural Project Details...</p>
      </div>
    );
  }

  if (error404 || !project) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center space-y-6">
        <h1 className="text-4xl font-serif font-bold text-neutral-charcoal">Project Not Found</h1>
        <p className="text-neutral-600">
          The requested construction project could not be found or may have been unpublished.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-architectural font-semibold hover:bg-primary-600 transition-colors shadow-warm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>
    );
  }

  // Extract gallery photos
  const galleryImages: GalleryImage[] = (project.project_images || [])
    .filter((img) => img.image_type === 'gallery' || img.image_type === 'cover')
    .map((img) => ({
      url: img.image_url,
      alt: `${project.title} - Photo`,
      isCover: img.image_type === 'cover',
    }));

  const beforeImg = project.project_images?.find((img) => img.image_type === 'before')?.image_url;
  const afterImg = project.project_images?.find((img) => img.image_type === 'after')?.image_url;

  const mapUrlClean = project.map_url?.trim() || '';
  const lat = project.lat || 13.0878;
  const lng = project.lng || 80.2170;

  const mapEmbedSrc = mapUrlClean
    ? mapUrlClean.includes('/maps/embed') || mapUrlClean.includes('output=embed')
      ? mapUrlClean
      : `https://maps.google.com/maps?q=${encodeURIComponent(mapUrlClean)}&z=15&output=embed`
    : `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  const googleMapsDirectionsUrl = (mapUrlClean && (mapUrlClean.startsWith('http://') || mapUrlClean.startsWith('https://')))
    ? mapUrlClean
    : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* Back Link */}
      <Link to="/projects" className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-primary-500 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider rounded">
            {project.category}
          </span>
          <span className="flex items-center text-xs text-neutral-500 space-x-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-primary-500" />
            <span>{project.location}</span>
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-neutral-charcoal">{project.title}</h1>
      </div>

      {/* Main Lightbox Image Gallery */}
      {galleryImages.length > 0 && (
        <section className="space-y-4">
          <ImageGallery images={galleryImages} layout="grid" />
        </section>
      )}

      {/* Before / After Slider Section (Only rendered if before & after images exist) */}
      {beforeImg && afterImg && (
        <ScrollReveal direction="up">
          <section className="space-y-4 p-6 bg-white rounded-architectural border border-neutral-concrete shadow-warm">
            <h2 className="text-2xl font-serif font-semibold text-neutral-charcoal">
              Transformation Before & After
            </h2>
            <BeforeAfterSlider
              beforeUrl={beforeImg}
              afterUrl={afterImg}
              beforeLabel="BEFORE RENOVATION"
              afterLabel="AFTER (SRM HOMES)"
              className="w-full h-80 md:h-[450px]"
            />
          </section>
        </ScrollReveal>
      )}

      {/* Key Specifications Stats Block */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SpecCard icon={<Maximize className="w-5 h-5 text-primary-500" />} label="Built-Up Area" value={`${project.built_up_area} sq ft`} />
        <SpecCard icon={<Maximize className="w-5 h-5 text-primary-500" />} label="Plot Size" value={`${project.plot_size || 'N/A'} sq ft`} />
        <SpecCard icon={<Clock className="w-5 h-5 text-primary-500" />} label="Duration" value={`${project.duration_months} Months`} />
        <SpecCard icon={<DollarSign className="w-5 h-5 text-primary-500" />} label="Budget Range" value={project.budget_range} />
      </section>

      {/* Description */}
      <section className="space-y-4 max-w-3xl">
        <h2 className="text-2xl font-serif font-semibold text-neutral-charcoal">Architectural Overview</h2>
        <p className="text-neutral-700 leading-relaxed text-base whitespace-pre-line">{project.description}</p>
      </section>

      {/* DEDICATED PROJECT LOCATION & INTERACTIVE SITE MAP SECTION */}
      <ScrollReveal direction="up">
        <section className="p-8 bg-white rounded-architectural border border-neutral-concrete shadow-warm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-concrete pb-4">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-primary-500 flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Geographic Site Location</span>
              </span>
              <h2 className="text-2xl font-serif font-bold text-neutral-charcoal">Project Site Map & Directions</h2>
            </div>
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider rounded-md flex items-center space-x-2 transition-all shadow-warm w-fit"
            >
              <Navigation className="w-4 h-4" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center space-x-2 text-sm text-neutral-700 font-medium">
            <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <span>Site Address: <strong>{project.location}</strong></span>
            <span className="text-neutral-400">|</span>
            <span className="text-xs text-neutral-500 font-mono">GPS: {lat}, {lng}</span>
          </div>

          {/* Interactive Map Iframe */}
          <div className="relative w-full h-[400px] rounded-architectural overflow-hidden border border-neutral-concrete bg-neutral-100 shadow-inner">
            <iframe
              title={`Site Map - ${project.title}`}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src={mapEmbedSrc}
              className="w-full h-full"
            />
          </div>
        </section>
      </ScrollReveal>



      {/* Linked Testimonial Pull-Quote */}
      {project.testimonial && (
        <section className="p-8 bg-primary-50 rounded-architectural border border-primary-200 shadow-warm space-y-4">
          <Quote className="w-10 h-10 text-primary-400 opacity-60" />
          <p className="text-lg font-serif italic text-neutral-800">
            "{project.testimonial.quote}"
          </p>
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
            <span>— {project.testimonial.client_name}</span>
            <div className="flex text-amber-500">
              {[...Array(project.testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Similar Projects */}
      {project.similar_projects && project.similar_projects.length > 0 && (
        <section className="space-y-6 border-t border-neutral-concrete pt-10">
          <h2 className="text-2xl font-serif font-bold text-neutral-charcoal">Similar Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {project.similar_projects.map((sim) => {
              const cover = sim.project_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
              return (
                <Link
                  key={sim.id}
                  to={`/projects/${sim.slug}`}
                  className="group bg-white rounded-architectural overflow-hidden border border-neutral-concrete shadow-warm hover:-translate-y-1 transition-all"
                >
                  <img src={cover} alt={sim.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
                  <div className="p-4 space-y-1">
                    <p className="text-xs uppercase font-semibold text-primary-500">{sim.category}</p>
                    <h3 className="font-serif font-bold text-neutral-charcoal text-base group-hover:text-primary-500 transition-colors">
                      {sim.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function SpecCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-5 bg-white rounded-architectural border border-neutral-concrete shadow-warm space-y-2">
      <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-neutral-400 font-semibold">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-lg font-serif font-bold text-neutral-charcoal">{value}</p>
    </div>
  );
}
