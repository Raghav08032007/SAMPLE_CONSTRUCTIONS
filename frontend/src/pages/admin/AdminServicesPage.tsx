import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import { Plus, Search, Edit3, Trash2, Eye, AlertTriangle, Layers, CheckCircle, Clock } from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image_url: string;
  scope_range?: string;
  icon_name?: string;
  status: string;
  steps?: { step: string; title: string; desc: string }[];
  created_at?: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/services?admin=true');
      setServices(res.data.services || []);
    } catch (err) {
      console.error('Error fetching admin services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (srv: ServiceItem) => {
    const nextStatus = srv.status === 'published' ? 'draft' : 'published';
    try {
      await apiClient.put(`/services/${srv.id}`, { status: nextStatus });
      fetchServices();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update service status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`/services/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchServices();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete service.');
    }
  };

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-primary-500">Service Offerings</span>
          <h1 className="text-3xl font-serif font-extrabold text-neutral-charcoal">Company Construction Services ({services.length})</h1>
          <p className="text-xs text-neutral-500">Manage, add, and publish construction company services with custom details and photos.</p>
        </div>
        <Link
          to="/admin/services/new"
          className="px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-architectural transition-all shadow-warm flex items-center space-x-2 w-fit active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by service title or category..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-warm-sm"
        />
      </div>

      {/* Services Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-neutral-500 animate-pulse font-medium">
            Loading services list...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="col-span-full p-12 bg-white rounded-architectural border border-neutral-concrete text-center space-y-3">
            <Layers className="w-10 h-10 text-neutral-300 mx-auto" />
            <h3 className="text-lg font-serif font-bold">No Services Found</h3>
            <p className="text-xs text-neutral-500">Add your first construction service to showcase your company offerings.</p>
            <Link
              to="/admin/services/new"
              className="inline-flex items-center space-x-1 text-xs font-bold text-primary-600 hover:underline"
            >
              <span>+ Create Service Now</span>
            </Link>
          </div>
        ) : (
          filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-architectural border border-neutral-concrete shadow-warm overflow-hidden flex flex-col justify-between hover:shadow-warm-lg transition-all"
            >
              <div>
                {/* Image Cover */}
                <div className="relative h-48 bg-neutral-200 overflow-hidden">
                  <img
                    src={srv.image_url}
                    alt={srv.title}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-neutral-charcoal/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                    {srv.category}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(srv)}
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm ${
                      srv.status === 'published'
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-amber-500 text-white hover:bg-amber-600'
                    }`}
                  >
                    {srv.status}
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-serif font-bold text-neutral-charcoal leading-snug">{srv.title}</h3>
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">{srv.description}</p>

                  {srv.scope_range && (
                    <div className="pt-2 text-xs text-neutral-500 font-medium">
                      Scope: <strong className="text-primary-600 font-bold">{srv.scope_range}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3.5 bg-neutral-sand/50 border-t border-neutral-concrete flex items-center justify-between">
                <Link
                  to={`/services/${srv.slug}`}
                  target="_blank"
                  className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Public View</span>
                </Link>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/admin/services/${srv.id}/edit`}
                    className="p-2 bg-white text-primary-600 hover:bg-primary-50 rounded-md border border-neutral-concrete transition-all text-xs font-bold flex items-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(srv)}
                    className="p-2 bg-white text-red-600 hover:bg-red-50 rounded-md border border-neutral-concrete transition-all text-xs"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-neutral-charcoal/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-architectural p-6 max-w-md w-full space-y-4 shadow-2xl border border-neutral-concrete">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-serif font-bold">Confirm Delete Service</h3>
            </div>
            <p className="text-xs text-neutral-600">
              Are you sure you want to delete service <strong className="text-neutral-charcoal">"{deleteTarget.title}"</strong>?
              This will remove it from the admin panel and public site.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-sand rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
