import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { ScrollRevealGroup } from '../components/motion/ScrollReveal';
import { MapPin, Filter, RotateCcw, LayoutGrid, Map as MapIcon, Building2, Layers, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string;
  budget_range: string;
  built_up_area: number;
  lat?: number;
  lng?: number;
  project_images?: { image_url: string; image_type?: string; is_cover?: boolean }[];
}

interface Service {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image_url: string;
  scope_range?: string;
  steps?: { step: string; title: string; desc: string }[];
}

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Segregation Section: 'construction' (Projects) or 'services' (Offerings)
  const [activeSection, setActiveSection] = useState<'construction' | 'services'>(
    (searchParams.get('section') as 'construction' | 'services') || 'construction'
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const selectedCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (activeSection === 'construction') {
          const query = new URLSearchParams();
          if (selectedCategory !== 'all') query.set('category', selectedCategory);
          const res = await apiClient.get(`/projects?${query.toString()}`);
          setProjects(res.data.projects || []);
        } else {
          const res = await apiClient.get('/services');
          setServices(res.data.services || []);
        }
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [activeSection, selectedCategory]);

  const handleSectionSwitch = (section: 'construction' | 'services') => {
    setActiveSection(section);
    const params = new URLSearchParams(searchParams);
    params.set('section', section);
    if (section === 'services') params.delete('category');
    setSearchParams(params);
  };

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('section', 'construction');
    if (cat === 'all') params.delete('category');
    else params.set('category', cat);
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams({ section: activeSection }));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-primary-500">Portfolio Showcase</span>
            <h1 className="text-4xl font-serif font-extrabold text-neutral-charcoal">
              {activeSection === 'construction' ? 'Construction Projects Portfolio' : 'Construction Services & Expertise'}
            </h1>
            <p className="text-neutral-600 max-w-2xl text-sm leading-relaxed">
              Explore our segregated showcase of completed construction works, architectural projects, and specialized turnkey building services.
            </p>
          </div>

          {/* Section Switcher Tabs (Construction vs Services) */}
          <div className="flex items-center space-x-2 bg-neutral-sand p-1.5 rounded-architectural border border-neutral-concrete shadow-warm-sm w-fit">
            <button
              onClick={() => handleSectionSwitch('construction')}
              className={`px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all ${
                activeSection === 'construction'
                  ? 'bg-primary-500 text-white shadow-warm'
                  : 'text-neutral-700 hover:bg-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>1. Construction Projects</span>
            </button>
            <button
              onClick={() => handleSectionSwitch('services')}
              className={`px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all ${
                activeSection === 'services'
                  ? 'bg-primary-500 text-white shadow-warm'
                  : 'text-neutral-700 hover:bg-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>2. Services & Expertise</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: CONSTRUCTION PROJECTS */}
      {activeSection === 'construction' && (
        <div className="space-y-8">
          {/* Sub-Filters & View Mode Bar */}
          <div className="p-4 bg-white rounded-architectural border border-neutral-concrete shadow-warm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Sub-Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-2 hidden md:inline">Category:</span>
              {['all', 'residential', 'commercial', 'renovation'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedCategory === cat
                      ? 'bg-neutral-charcoal text-white shadow-sm'
                      : 'bg-neutral-sand text-neutral-600 hover:bg-neutral-concrete/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              {selectedCategory !== 'all' && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center space-x-1 text-xs text-neutral-500 hover:text-primary-500 font-bold transition-colors mr-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}

              {/* View Mode Toggle (Grid vs Map) */}
              <div className="flex items-center space-x-1 bg-neutral-sand p-1 rounded-md border border-neutral-concrete">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1 transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-neutral-charcoal shadow-sm' : 'text-neutral-500'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1 transition-colors ${
                    viewMode === 'map' ? 'bg-white text-neutral-charcoal shadow-sm' : 'text-neutral-500'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* MAP VIEW INTERACTIVE CONTAINER */}
          {viewMode === 'map' && (
            <div className="p-6 bg-white rounded-architectural border border-neutral-concrete shadow-warm-lg space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-neutral-charcoal">Interactive Construction Sites Map</h2>
                <span className="text-xs text-neutral-500 font-bold">{projects.length} Sites Plotted</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map Pins Cards List */}
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                  {projects.map((p) => {
                    const lat = p.lat || 13.0878;
                    const lng = p.lng || 80.2170;
                    return (
                      <div key={p.id} className="p-4 bg-neutral-sand/80 hover:bg-white rounded-architectural border border-neutral-concrete shadow-sm transition-all space-y-2">
                        <div className="flex items-center justify-between text-xs text-primary-600 font-bold uppercase">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-primary-500" />
                            <span>{p.location}</span>
                          </span>
                          <span className="text-[10px] bg-neutral-charcoal text-white px-2 py-0.5 rounded">{p.category}</span>
                        </div>
                        <h3 className="font-serif font-bold text-neutral-charcoal text-base">{p.title}</h3>
                        <p className="text-xs text-neutral-500 font-mono">GPS: {lat}, {lng}</p>
                        <div className="flex items-center justify-between pt-1">
                          <Link
                            to={`/projects/${p.slug}`}
                            className="text-xs font-bold text-primary-600 hover:underline"
                          >
                            View Case Study →
                          </Link>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-neutral-600 font-semibold hover:text-primary-500"
                          >
                            Directions ↗
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Interactive Google Map Visualizer */}
                <div className="lg:col-span-2 relative w-full h-[450px] bg-[#e5e3df] rounded-architectural overflow-hidden border border-neutral-concrete">
                  <iframe
                    title="Construction Sites Map Overview"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    src={`https://maps.google.com/maps?q=${projects[0]?.lat || 13.0878},${projects[0]?.lng || 80.2170}&z=11&output=embed`}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          )}


          {/* GRID VIEW CONTAINER */}
          {viewMode === 'grid' && (
            <>
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-architectural overflow-hidden border border-neutral-concrete shadow-warm p-4 space-y-4 animate-pulse">
                      <div className="h-56 bg-neutral-200 rounded-md" />
                      <div className="h-4 bg-neutral-200 w-3/4 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {!loading && projects.length === 0 && (
                <div className="py-16 px-6 bg-white rounded-architectural border border-dashed border-neutral-concrete text-center space-y-4 max-w-md mx-auto">
                  <Filter className="w-12 h-12 text-neutral-300 mx-auto" />
                  <h3 className="text-lg font-serif font-bold text-neutral-charcoal">No Matching Projects Found</h3>
                  <button onClick={handleResetFilters} className="px-5 py-2.5 bg-primary-500 text-white text-xs font-bold rounded-md">
                    Clear Filters
                  </button>
                </div>
              )}

              {!loading && projects.length > 0 && (
                <ScrollRevealGroup staggerChildren={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((proj) => {
                    const cover = proj.project_images?.find((i) => i.image_type === 'cover' || i.is_cover)?.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                    return (
                      <Link
                        key={proj.id}
                        to={`/projects/${proj.slug}`}
                        className="group block bg-white rounded-architectural overflow-hidden border border-neutral-concrete shadow-warm hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                      >
                        <div className="relative h-60 overflow-hidden bg-neutral-concrete">
                          <img src={cover} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <span className="absolute top-3 right-3 bg-neutral-charcoal/90 text-neutral-sand text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                            {proj.category}
                          </span>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-1">
                            <div className="flex items-center text-xs text-neutral-500 space-x-1 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-primary-500" />
                              <span>{proj.location}</span>
                            </div>
                            <h3 className="text-xl font-serif font-bold text-neutral-charcoal group-hover:text-primary-500 transition-colors">
                              {proj.title}
                            </h3>
                          </div>

                          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                            <span>{proj.built_up_area} sq ft</span>
                            <span className="font-bold text-primary-600">{proj.budget_range}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </ScrollRevealGroup>
              )}
            </>
          )}
        </div>
      )}

      {/* SECTION 2: SERVICES & EXPERTISE */}
      {activeSection === 'services' && (
        <div className="space-y-8">
          {loading ? (
            <div className="p-12 text-center text-neutral-500 animate-pulse font-medium">
              Loading construction services...
            </div>
          ) : services.length === 0 ? (
            <div className="p-12 bg-white rounded-architectural border border-neutral-concrete text-center space-y-3">
              <Layers className="w-10 h-10 text-neutral-300 mx-auto" />
              <h3 className="text-lg font-serif font-bold">No Services Configured</h3>
            </div>
          ) : (
            <ScrollRevealGroup staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-white rounded-architectural border border-neutral-concrete shadow-warm overflow-hidden flex flex-col justify-between hover:shadow-warm-lg transition-all"
                >
                  <div>
                    {/* Service Photo Cover */}
                    {srv.image_url && (
                      <div className="relative h-56 bg-neutral-200 overflow-hidden">
                        <img
                          src={srv.image_url}
                          alt={srv.title}
                          className="w-full h-full object-cover"
                          onError={(e: any) => {
                            e.target.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80';
                          }}
                        />
                        <span className="absolute top-3 left-3 px-3 py-1 bg-neutral-charcoal/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                          {srv.category}
                        </span>
                      </div>
                    )}

                    {/* Service Content */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-2xl font-serif font-bold text-neutral-charcoal leading-snug">{srv.title}</h3>
                      <p className="text-xs text-neutral-600 leading-relaxed">{srv.description}</p>

                      {srv.scope_range && (
                        <div className="inline-block px-3 py-1 bg-neutral-sand rounded border border-neutral-concrete text-xs font-semibold text-neutral-700">
                          Scope Range: <strong className="text-primary-600 font-bold">{srv.scope_range}</strong>
                        </div>
                      )}

                      {/* Process Steps Preview */}
                      {srv.steps && srv.steps.length > 0 && (
                        <div className="pt-3 border-t border-neutral-100 space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-500">Execution Process Highlights</span>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {srv.steps.slice(0, 4).map((st: any) => (
                              <div key={st.step || st.title} className="flex items-center space-x-1.5 text-neutral-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                <span className="truncate font-medium">{st.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-6 py-4 bg-neutral-sand/50 border-t border-neutral-concrete flex items-center justify-between">
                    <Link
                      to={`/services/${srv.slug}`}
                      className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center space-x-1"
                    >
                      <span>Explore Service Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/contact"
                      className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-xs font-bold transition-all shadow-sm"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              ))}
            </ScrollRevealGroup>
          )}
        </div>
      )}
    </div>
  );
}

