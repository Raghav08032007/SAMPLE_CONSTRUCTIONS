import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import { Plus, Search, Edit3, Trash2, Eye, AlertTriangle } from 'lucide-react';

interface ProjectAdminItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string;
  status: string;
  image_count: number;
  created_at: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ProjectAdminItem | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/projects');
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error('Error fetching admin projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (proj: ProjectAdminItem) => {
    const nextStatus = proj.status === 'published' ? 'draft' : 'published';

    // Enforce Rule 3.3: Cannot publish a project with zero images
    if (nextStatus === 'published' && proj.image_count === 0) {
      alert('Cannot publish a project with 0 images! Please edit the project and upload at least one photo first.');
      return;
    }

    try {
      await apiClient.put(`/admin/projects/${proj.id}`, { status: nextStatus });
      fetchProjects();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update project status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`/admin/projects/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchProjects();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete project.');
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-primary-500">Portfolio Management</span>
          <h1 className="text-3xl font-serif font-bold text-neutral-charcoal">All Projects ({projects.length})</h1>
        </div>
        <Link
          to="/admin/projects/new"
          className="px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-architectural transition-colors shadow-warm flex items-center space-x-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by project title or location..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-warm-sm"
        />
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-architectural border border-neutral-concrete shadow-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-sand border-b border-neutral-concrete text-xs uppercase tracking-wider text-neutral-600 font-semibold">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Location</th>
                <th className="p-4">Photos</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-concrete">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500 animate-pulse">
                    Loading projects list...
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500">
                    No projects found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-sand/40 transition-colors">
                    <td className="p-4 font-serif font-bold text-neutral-charcoal">{p.title}</td>
                    <td className="p-4 uppercase text-xs font-semibold text-neutral-500">{p.category}</td>
                    <td className="p-4 text-neutral-600">{p.location || 'N/A'}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-neutral-100 rounded text-xs font-semibold text-neutral-700">
                        {p.image_count} photos
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                          p.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {p.status}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        to={`/projects/${p.slug}`}
                        target="_blank"
                        className="p-2 text-neutral-500 hover:text-neutral-800 inline-block"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/projects/${p.id}/edit`}
                        className="p-2 text-primary-600 hover:text-primary-800 inline-block"
                        title="Edit Project"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-2 text-red-500 hover:text-red-700 inline-block"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-neutral-charcoal/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-architectural p-6 max-w-md w-full space-y-4 shadow-2xl border border-neutral-concrete">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-serif font-bold">Confirm Delete Project</h3>
            </div>
            <p className="text-xs text-neutral-600">
              Are you sure you want to delete <strong className="text-neutral-charcoal">"{deleteTarget.title}"</strong>?
              This will permanently delete the project record and remove all associated photos from Supabase Storage.
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
