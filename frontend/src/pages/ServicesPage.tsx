import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { ScrollRevealGroup, ScrollReveal } from '../components/motion/ScrollReveal';
import { Home, Building2, Hammer, Compass, ShieldCheck, CheckCircle2, ArrowRight, Layers } from 'lucide-react';

const defaultServicesData = [
  {
    id: 'srv-001',
    slug: 'residential-villas',
    title: 'Custom Residential Villas',
    category: 'residential',
    description: 'Bespoke luxury residential homes engineered for passive cooling, modern spatial aesthetics, and multigenerational durability.',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    scope_range: '₹1.5Cr – ₹3.5Cr',
    steps: [
      { step: '01', title: 'Architectural Consultation', desc: 'Site evaluation, sun-path analysis, and 3D floor plan layout drafting.' },
      { step: '02', title: 'Structural Engineering', desc: 'Soil testing, foundation load calculations, and RCC steel optimization.' },
      { step: '03', title: 'Turnkey Execution', desc: 'Masons, electricians, and interior artisans executing under strict supervision.' },
      { step: '04', title: 'Key Handover & Warranty', desc: 'Final quality inspection and 10-year structural warranty certificate delivery.' },
    ],
  },
  {
    id: 'srv-002',
    slug: 'commercial-complexes',
    title: 'Commercial & Retail Hubs',
    category: 'commercial',
    description: 'High-density commercial office spaces, retail pavilions, and IT facilities compliant with local municipal codes and green building standards.',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    scope_range: '₹5.0Cr – ₹15.0Cr',
    steps: [
      { step: '01', title: 'Zoning & Master Plan', desc: 'Commercial FAR compliance, parking ratio calculation, and fire safety layout.' },
      { step: '02', title: 'Glass Facade & Steelwork', desc: 'Structural glazing, curtain wall installation, and heavy load floor slabs.' },
      { step: '03', title: 'MEP Integration', desc: 'HVAC ducting, high-voltage electrical panels, and fire suppression systems.' },
      { step: '04', title: 'Occupancy Certification', desc: 'Handling all municipal approvals and handing over lease-ready office floors.' },
    ],
  },
  {
    id: 'srv-003',
    slug: 'renovations-restoration',
    title: 'Structural Renovations',
    category: 'renovation',
    description: 'Transforming legacy ancestral homes and outdated structures into sun-filled modern architectural living spaces.',
    image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    scope_range: '₹40L – ₹1.2Cr',
    steps: [
      { step: '01', title: 'Structural Audit', desc: 'Ultrasonic crack testing and load-bearing column integrity check.' },
      { step: '02', title: 'Retrofitting & Strengthening', desc: 'Micro-concrete jacketing and steel beam insertion for wall removal.' },
      { step: '03', title: 'Modern Fitout', desc: 'Replacing old plumbing/wiring with modern concealed fixtures.' },
      { step: '04', title: 'Interior Makeover', desc: 'Architectural finishes, tile replacement, and custom woodworking.' },
    ],
  },
];

export default function ServicesPage() {
  const { serviceSlug } = useParams<{ serviceSlug?: string }>();
  const [services, setServices] = useState<any[]>(defaultServicesData);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await apiClient.get('/services');
        if (res.data?.services && res.data.services.length > 0) {
          setServices(res.data.services);
        }
      } catch (err) {
        console.error('Error fetching public services:', err);
      }
    }
    fetchServices();
  }, []);

  const activeService = services.find((s) => s.slug === serviceSlug || s.id === serviceSlug) || services[0] || defaultServicesData[0];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-wider font-bold text-primary-500">Core Expertise</span>
        <h1 className="text-4xl font-serif font-extrabold text-neutral-charcoal">Engineering & Construction Services</h1>
        <p className="text-neutral-600 text-sm">
          End-to-end design, structural engineering, and turnkey construction services backed by 15 years of industry leadership.
        </p>
      </div>

      {/* Service Selector Tabs */}
      <div className="flex flex-wrap justify-center gap-3 border-b border-neutral-concrete pb-6">
        {services.map((s) => (
          <Link
            key={s.id || s.slug}
            to={`/services/${s.slug}`}
            className={`px-5 py-3 rounded-architectural text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all ${
              activeService.slug === s.slug || activeService.id === s.id
                ? 'bg-primary-500 text-white shadow-warm'
                : 'bg-white text-neutral-700 border border-neutral-concrete hover:bg-neutral-sand'
            }`}
          >
            <span>{s.title}</span>
          </Link>
        ))}
      </div>

      {/* Selected Service Hero & Details */}
      <ScrollReveal direction="fade">
        <div className="bg-white rounded-architectural border border-neutral-concrete shadow-warm overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Image */}
          {activeService.image_url && (
            <div className="md:col-span-5 h-64 md:h-auto relative bg-neutral-200">
              <img
                src={activeService.image_url}
                alt={activeService.title}
                className="w-full h-full object-cover"
                onError={(e: any) => {
                  e.target.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <span className="absolute top-4 left-4 px-3 py-1 bg-neutral-charcoal/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                {activeService.category}
              </span>
            </div>
          )}

          {/* Details */}
          <div className={`${activeService.image_url ? 'md:col-span-7' : 'md:col-span-12'} p-8 md:p-10 space-y-6 flex flex-col justify-center`}>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-bold text-primary-500">Category: {activeService.category}</span>
              <h2 className="text-3xl font-serif font-bold text-neutral-charcoal">{activeService.title}</h2>
            </div>
            <p className="text-neutral-700 leading-relaxed text-sm">{activeService.description}</p>

            {activeService.scope_range && (
              <div className="p-3 bg-neutral-sand rounded-md border border-neutral-concrete w-fit text-xs font-semibold text-neutral-700">
                Scope / Budget Range: <strong className="text-primary-600 font-bold">{activeService.scope_range}</strong>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Process Steps Component */}
      {activeService.steps && activeService.steps.length > 0 && (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-primary-500">Execution Workflow</span>
            <h2 className="text-3xl font-serif font-bold text-neutral-charcoal">Execution Process Steps</h2>
          </div>

          <ScrollRevealGroup staggerChildren={0.15} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeService.steps.map((st: any) => (
              <div key={st.step || st.title} className="p-6 bg-white rounded-architectural border border-neutral-concrete shadow-warm relative space-y-3">
                <span className="text-3xl font-serif font-extrabold text-primary-400">{st.step}</span>
                <h3 className="text-base font-serif font-bold text-neutral-charcoal">{st.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </ScrollRevealGroup>
        </div>
      )}

      {/* Filtered Portfolio Link CTA */}
      <div className="p-8 bg-neutral-charcoal text-neutral-sand rounded-architectural flex flex-col md:flex-row items-center justify-between gap-6 shadow-warm-lg">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-xl font-serif font-bold">Explore Our {activeService.title} Projects</h3>
          <p className="text-xs text-neutral-400">View real case studies built under this service category.</p>
        </div>
        <Link
          to={`/projects?category=${activeService.category}`}
          className="px-6 py-3 bg-primary-500 text-white font-bold rounded-architectural hover:bg-primary-600 transition-colors flex items-center space-x-2 shadow-warm text-xs uppercase tracking-wider"
        >
          <span>View Category Portfolio</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

