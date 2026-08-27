import React from 'react';
import { Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

const brandCategories = [
  {
    category: 'Cement & Structural Steel',
    brands: [
      { name: 'UltraTech Cement', desc: 'India’s No. 1 structural grade cement' },
      { name: 'Tata Tiscon TMT', desc: '550D Fe-grade corrosion resistant steel bars' },
      { name: 'JSW Steel', desc: 'High-tensile structural beams' },
    ],
  },
  {
    category: 'Tiles & Natural Stone',
    brands: [
      { name: 'Kajaria Ceramics', desc: 'Vitrified high-gloss & matte floor tiles' },
      { name: 'Somany Ceramics', desc: 'Slip-resistant outdoor & balcony tiles' },
      { name: 'Italian Italian Marble', desc: 'Imported Botticino & Statuario marble slabs' },
    ],
  },
  {
    category: 'Electricals & Domotics',
    brands: [
      { name: 'Legrand Modular', desc: 'Smart touch switches & automation hubs' },
      { name: 'Havells Wires', desc: 'Flame-retardant low-smoke copper wiring' },
      { name: 'Schneider Electric', desc: 'MCB distribution boards & surge protectors' },
    ],
  },
  {
    category: 'Plumbing & Sanitaryware',
    brands: [
      { name: 'Jaquar Artize', desc: 'Thermostatic shower mixers & premium faucets' },
      { name: 'Kohler USA', desc: 'Wall-hung sanitaryware & dual-flush cisterns' },
      { name: 'Finolex Pipes', desc: 'CPVC & UPVC leak-proof plumbing lines' },
    ],
  },
];

export default function BrandsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-wider font-semibold text-primary-500">Material Integrity</span>
        <h1 className="text-4xl font-serif font-bold text-neutral-charcoal">Partnered Brands & Materials</h1>
        <p className="text-neutral-600">
          SRM Homes exclusively partners with premier international and national manufacturers to guarantee 100% structural durability.
        </p>
      </div>

      {/* Brand Grid */}
      <div className="space-y-10">
        {brandCategories.map((cat) => (
          <div key={cat.category} className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-neutral-charcoal border-b border-neutral-concrete pb-2">
              {cat.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {cat.brands.map((b) => (
                <div key={b.name} className="p-6 bg-white rounded-architectural border border-neutral-concrete shadow-warm space-y-2">
                  <div className="flex items-center space-x-2 text-primary-500 font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    <h3 className="font-serif text-lg text-neutral-charcoal">{b.name}</h3>
                  </div>
                  <p className="text-xs text-neutral-500">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
