import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import { Building, MessageSquare, Users, Plus, FileText, ArrowRight, Layers } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    pendingTestimonials: 0,
    newLeads: 0,
    totalServices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projRes, testRes, leadRes, srvRes] = await Promise.allSettled([
          apiClient.get('/admin/projects'),
          apiClient.get('/admin/testimonials'),
          apiClient.get('/admin/leads'),
          apiClient.get('/services?admin=true'),
        ]);

        const projects = projRes.status === 'fulfilled' ? (projRes.value.data?.projects || []) : [];
        const testimonials = testRes.status === 'fulfilled' ? (testRes.value.data?.testimonials || []) : [];
        const leads = leadRes.status === 'fulfilled' ? (leadRes.value.data?.leads || []) : [];
        const services = srvRes.status === 'fulfilled' ? (srvRes.value.data?.services || []) : [];

        setStats({
          totalProjects: projects.length,
          publishedProjects: projects.filter((p: any) => p.status === 'published').length,
          draftProjects: projects.filter((p: any) => p.status === 'draft').length,
          pendingTestimonials: testimonials.filter((t: any) => t.status === 'pending').length,
          newLeads: leads.filter((l: any) => l.status === 'new').length,
          totalServices: services.length,
        });
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-primary-500">Admin Control Center</span>
          <h1 className="text-3xl font-serif font-extrabold text-neutral-charcoal">SRM Homes Management Dashboard</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/services/new"
            className="px-4 py-3 bg-neutral-charcoal hover:bg-neutral-800 text-white font-bold rounded-architectural transition-all text-xs flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-primary-400" />
            <span>New Service</span>
          </Link>
          <Link
            to="/admin/projects/new"
            className="px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-architectural transition-all shadow-warm flex items-center space-x-2 w-fit active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>


      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Projects"
          value={stats.totalProjects}
          subtitle={`${stats.publishedProjects} Published / ${stats.draftProjects} Draft`}
          icon={<Building className="w-6 h-6 text-primary-500" />}
          link="/admin/projects"
        />

        <DashboardCard
          title="Company Services"
          value={stats.totalServices}
          subtitle="Offered construction services"
          icon={<Layers className="w-6 h-6 text-indigo-500" />}
          link="/admin/services"
        />

        <DashboardCard
          title="Pending Reviews"
          value={stats.pendingTestimonials}
          subtitle="Awaiting moderation approval"
          icon={<MessageSquare className="w-6 h-6 text-amber-500" />}
          link="/admin/testimonials"
          badge={stats.pendingTestimonials > 0 ? `${stats.pendingTestimonials} Pending` : undefined}
        />

        <DashboardCard
          title="New Leads / Quotes"
          value={stats.newLeads}
          subtitle="Uncontacted quote submissions"
          icon={<Users className="w-6 h-6 text-emerald-500" />}
          link="/admin/leads"
          badge={stats.newLeads > 0 ? `${stats.newLeads} New` : undefined}
        />
      </div>

      {/* Section Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-architectural border border-neutral-concrete shadow-warm space-y-3">
          <h3 className="text-lg font-serif font-bold text-neutral-charcoal">Services Manager</h3>
          <p className="text-xs text-neutral-600">Add, edit details, upload service photos, and manage active service offerings.</p>
          <Link to="/admin/services" className="inline-flex items-center space-x-1 text-xs font-bold text-primary-500 hover:text-primary-600">
            <span>Manage Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 bg-white rounded-architectural border border-neutral-concrete shadow-warm space-y-3">
          <h3 className="text-lg font-serif font-bold text-neutral-charcoal">Project Manager</h3>
          <p className="text-xs text-neutral-600">Create, edit details, upload photos, reorder images, and publish projects.</p>
          <Link to="/admin/projects" className="inline-flex items-center space-x-1 text-xs font-bold text-primary-500 hover:text-primary-600">
            <span>Manage Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 bg-white rounded-architectural border border-neutral-concrete shadow-warm space-y-3">
          <h3 className="text-lg font-serif font-bold text-neutral-charcoal">Review Moderation</h3>
          <p className="text-xs text-neutral-600">Approve or reject homeowner testimonials before they appear publicly.</p>
          <Link to="/admin/testimonials" className="inline-flex items-center space-x-1 text-xs font-bold text-primary-500 hover:text-primary-600">
            <span>Moderate Reviews</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 bg-white rounded-architectural border border-neutral-concrete shadow-warm space-y-3">
          <h3 className="text-lg font-serif font-bold text-neutral-charcoal">Lead CRM</h3>
          <p className="text-xs text-neutral-600">View client quote submissions, update statuses, and export spreadsheet CSV data.</p>
          <Link to="/admin/leads" className="inline-flex items-center space-x-1 text-xs font-bold text-primary-500 hover:text-primary-600">
            <span>View Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}


function DashboardCard({ title, value, subtitle, icon, link, badge }: any) {
  return (
    <Link to={link} className="p-6 bg-white rounded-architectural border border-neutral-concrete shadow-warm hover:shadow-warm-lg transition-all space-y-3 block">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{title}</span>
        {icon}
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-serif font-bold text-neutral-charcoal">{value}</span>
        {badge && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs text-neutral-500">{subtitle}</p>
    </Link>
  );
}
