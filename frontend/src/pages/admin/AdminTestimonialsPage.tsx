import React, { useEffect, useState } from 'react';
import { apiClient } from '../../lib/api';
import { Star, Check, X, Edit2, Save } from 'lucide-react';

interface TestimonialAdminItem {
  id: string;
  client_name: string;
  rating: number;
  quote: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  projects?: { title: string };
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuote, setEditQuote] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/testimonials');
      setTestimonials(res.data.testimonials || []);
    } catch (err) {
      console.error('Error fetching admin testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected', newQuote?: string) => {
    try {
      const payload: any = { status };
      if (newQuote !== undefined) payload.quote = newQuote;
      await apiClient.put(`/admin/testimonials/${id}`, payload);
      setEditingId(null);
      fetchTestimonials();
    } catch (err) {
      alert('Failed to update testimonial status.');
    }
  };

  const filtered = testimonials.filter((t) => t.status === activeTab);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-wider font-semibold text-primary-500">Feedback Moderation</span>
        <h1 className="text-3xl font-serif font-bold text-neutral-charcoal">Testimonial Reviews Queue</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-concrete space-x-6">
        {(['pending', 'approved', 'rejected'] as const).map((tab) => {
          const count = testimonials.filter((t) => t.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center space-x-2 ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <span className="capitalize">{tab}</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-neutral-200 text-neutral-700 font-bold">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {loading && <p className="text-center text-neutral-500 py-8 animate-pulse">Loading testimonials queue...</p>}

        {!loading && filtered.length === 0 && (
          <div className="p-8 text-center bg-white rounded-architectural border border-neutral-concrete text-neutral-500">
            No testimonials in <strong className="capitalize">{activeTab}</strong> queue.
          </div>
        )}

        {!loading &&
          filtered.map((t) => (
            <div key={t.id} className="p-6 bg-white rounded-architectural border border-neutral-concrete shadow-warm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-neutral-charcoal text-lg">{t.client_name}</h3>
                  {t.projects?.title && <p className="text-xs text-primary-600">Project: {t.projects.title}</p>}
                </div>
                <div className="flex text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>

              {/* Quote text or Inline Edit */}
              {editingId === t.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editQuote}
                    onChange={(e) => setEditQuote(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-neutral-sand border border-neutral-concrete rounded text-sm"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateStatus(t.id, 'approved', editQuote)}
                      className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded flex items-center space-x-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save & Approve</span>
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-neutral-300 text-neutral-700 text-xs font-bold rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-700 text-sm leading-relaxed italic">"{t.quote}"</p>
              )}

              {/* Action Bar */}
              {editingId !== t.id && (
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs">
                  <span className="text-neutral-400">Submitted: {new Date(t.submitted_at).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(t.id);
                        setEditQuote(t.quote);
                      }}
                      className="px-3 py-1.5 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded font-semibold flex items-center space-x-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    {t.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(t.id, 'approved')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}
                    {t.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(t.id, 'rejected')}
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded flex items-center space-x-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
