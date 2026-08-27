import React, { useEffect, useState } from 'react';
import { apiClient } from '../../lib/api';
import { Download, ChevronDown, ChevronUp, Phone, Mail, MapPin } from 'lucide-react';

interface LeadAdminItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  project_type?: string;
  plot_size?: number;
  budget_range?: string;
  message?: string;
  status: 'new' | 'contacted' | 'converted';
  created_at: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/leads');
      setLeads(res.data.leads || []);
    } catch (err) {
      console.error('Error fetching admin leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId: string, status: string) => {
    try {
      await apiClient.put(`/admin/leads/${leadId}`, { status });
      fetchLeads();
    } catch (err) {
      alert('Failed to update lead status.');
    }
  };

  const handleExportCSV = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    window.open(`${baseURL}/admin/leads/export`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      {/* Header & Export Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-primary-500">Lead CRM</span>
          <h1 className="text-3xl font-serif font-bold text-neutral-charcoal">Client Inquiries & Quotes ({leads.length})</h1>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-architectural transition-colors shadow-warm flex items-center space-x-2 w-fit"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Spreadsheet</span>
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-architectural border border-neutral-concrete shadow-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-sand border-b border-neutral-concrete text-xs uppercase tracking-wider text-neutral-600 font-semibold">
              <tr>
                <th className="p-4">Client Name</th>
                <th className="p-4">Phone / Contact</th>
                <th className="p-4">Type</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-concrete">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500 animate-pulse">
                    Loading CRM leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500">
                    No lead inquiries received yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <React.Fragment key={lead.id}>
                    <tr className="hover:bg-neutral-sand/40 transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}>
                      <td className="p-4 font-serif font-bold text-neutral-charcoal">{lead.name}</td>
                      <td className="p-4 text-neutral-700 font-medium">{lead.phone}</td>
                      <td className="p-4 uppercase text-xs font-semibold text-neutral-500">{lead.project_type || 'General'}</td>
                      <td className="p-4 text-neutral-600">{lead.location || 'N/A'}</td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider focus:outline-none ${
                            lead.status === 'new'
                              ? 'bg-blue-100 text-blue-800'
                              : lead.status === 'contacted'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-neutral-500 hover:text-neutral-800">
                          {expandedId === lead.id ? <ChevronUp className="w-5 h-5 inline" /> : <ChevronDown className="w-5 h-5 inline" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Details Row */}
                    {expandedId === lead.id && (
                      <tr className="bg-neutral-sand/50">
                        <td colSpan={6} className="p-6 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            <div>
                              <span className="font-semibold text-neutral-500 uppercase">Email:</span>
                              <p className="text-neutral-800 font-medium">{lead.email || 'None provided'}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-neutral-500 uppercase">Plot Size:</span>
                              <p className="text-neutral-800 font-medium">{lead.plot_size ? `${lead.plot_size} sq ft` : 'Not specified'}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-neutral-500 uppercase">Budget Range:</span>
                              <p className="text-neutral-800 font-medium">{lead.budget_range || 'Not specified'}</p>
                            </div>
                          </div>

                          {lead.message && (
                            <div className="space-y-1">
                              <span className="text-xs font-semibold text-neutral-500 uppercase">Client Note / Requirements:</span>
                              <p className="p-3 bg-white border border-neutral-concrete rounded text-sm text-neutral-700">{lead.message}</p>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
