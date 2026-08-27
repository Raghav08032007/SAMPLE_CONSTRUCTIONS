import React, { useState } from 'react';
import { ShieldCheck, Clock, CheckCircle2, AlertCircle, Send, Image } from 'lucide-react';

const mockTimelineUpdates = [
  {
    id: '1',
    title: 'Roof Slab RCC Concrete Pour Completed',
    date: 'August 20, 2026',
    desc: 'Grade M25 concrete poured for the 2nd-floor roof slab. Curing period initiated for 14 days.',
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'],
  },
  {
    id: '2',
    title: 'First Floor Brickwork & Electrical Conduit Piping',
    date: 'August 05, 2026',
    desc: 'Red clay brick masonry completed up to lintel level. Concealed PVC electrical conduits placed.',
    images: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80'],
  },
  {
    id: '3',
    title: 'Foundation & Plinth Beam Testing',
    date: 'July 12, 2026',
    desc: 'Pile foundation load test passed structural engineer compliance.',
    images: ['https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'],
  },
];

export default function ClientPortalPage() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'service'>('timeline');
  const [issueDesc, setIssueDesc] = useState('');
  const [submittedService, setSubmittedService] = useState(false);

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedService(true);
    setIssueDesc('');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      {/* Header */}
      <div className="p-8 bg-neutral-charcoal text-neutral-sand rounded-architectural space-y-4 shadow-warm-lg">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-primary-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Client Homeowner Portal</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-white">The Terracotta Villa Construction Timeline</h1>
        <p className="text-xs text-neutral-400">Project ID: a1b2c3d4 | Site Location: Anna Nagar, Chennai</p>
      </div>

      {/* Portal Tabs */}
      <div className="flex border-b border-neutral-concrete space-x-6">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 text-sm font-semibold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'timeline'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Construction Site Timeline
        </button>
        <button
          onClick={() => setActiveTab('service')}
          className={`pb-3 text-sm font-semibold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'service'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Warranty & Service Request
        </button>
      </div>

      {/* Timeline View */}
      {activeTab === 'timeline' && (
        <div className="space-y-8 pl-4 border-l-2 border-primary-200">
          {mockTimelineUpdates.map((item) => (
            <div key={item.id} className="relative pl-6 space-y-2">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary-500 border-4 border-white shadow" />
              <span className="text-xs text-neutral-400 font-semibold">{item.date}</span>
              <h3 className="text-xl font-serif font-bold text-neutral-charcoal">{item.title}</h3>
              <p className="text-sm text-neutral-600 max-w-2xl">{item.desc}</p>
              {item.images.length > 0 && (
                <div className="pt-2 flex space-x-3">
                  {item.images.map((img, idx) => (
                    <img key={idx} src={img} alt="Site update" className="w-36 h-24 object-cover rounded-architectural border border-neutral-concrete" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Warranty & Service Request View */}
      {activeTab === 'service' && (
        <div className="bg-white p-8 rounded-architectural border border-neutral-concrete shadow-warm space-y-6 max-w-xl">
          <h2 className="text-2xl font-serif font-bold text-neutral-charcoal">Submit Maintenance / Service Ticket</h2>

          {submittedService ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-architectural text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif font-bold text-emerald-800">Ticket Logged</h3>
              <p className="text-xs text-emerald-700">
                Your service request has been logged. Our maintenance engineering team will contact you within 24 hours.
              </p>
              <button onClick={() => setSubmittedService(false)} className="text-xs text-emerald-800 font-bold underline">
                Log another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Issue Description *</label>
                <textarea
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  rows={4}
                  required
                  placeholder="Describe electrical, plumbing, or waterproofing maintenance request..."
                  className="w-full p-3 bg-neutral-sand border border-neutral-concrete rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-architectural transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Ticket</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
