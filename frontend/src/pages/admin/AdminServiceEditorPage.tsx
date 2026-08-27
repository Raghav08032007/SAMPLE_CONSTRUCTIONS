import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import { ArrowLeft, Save, Upload, Sparkles, AlertCircle, Plus, Trash2, Home, Building2, Hammer, ShieldCheck, Wrench, Factory, Sun } from 'lucide-react';

interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

export default function AdminServiceEditorPage() {
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('residential');
  const [description, setDescription] = useState('');
  const [scopeRange, setScopeRange] = useState('₹1.5Cr – ₹3.5Cr');
  const [iconName, setIconName] = useState('Home');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('published');

  const [steps, setSteps] = useState<ProcessStep[]>([
    { step: '01', title: 'Consultation & Site Survey', desc: 'Site evaluation, zoning verification, and initial layout drafting.' },
    { step: '02', title: 'Engineering & 3D Design', desc: 'Detailed architectural drawings, structural calculations, and 3D modeling.' },
    { step: '03', title: 'On-Site Execution', desc: 'Civil construction, material procurement, and quality control supervision.' },
    { step: '04', title: 'Handover & Certification', desc: 'Final inspection, occupancy approval, and structural warranty delivery.' },
  ]);

  useEffect(() => {
    if (isEditing && id) {
      fetchServiceDetails(id);
    }
  }, [id, isEditing]);

  const fetchServiceDetails = async (serviceId: string) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/services/${serviceId}`);
      const data = res.data;
      if (data) {
        setTitle(data.title || '');
        setCategory(data.category || 'residential');
        setDescription(data.description || '');
        setScopeRange(data.scope_range || '');
        setIconName(data.icon_name || 'Home');
        setImageUrl(data.image_url || '');
        setStatus(data.status || 'published');
        if (data.steps && data.steps.length > 0) {
          setSteps(data.steps);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load service details.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImageUrl(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStepChange = (index: number, field: keyof ProcessStep, value: string) => {
    const nextSteps = [...steps];
    nextSteps[index][field] = value;
    setSteps(nextSteps);
  };

  const handleAddStep = () => {
    const nextNum = (steps.length + 1).toString().padStart(2, '0');
    setSteps([...steps, { step: nextNum, title: 'New Process Phase', desc: 'Phase details and execution scope.' }]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Service title is required.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title,
      category,
      description,
      scope_range: scopeRange,
      icon_name: iconName,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80',
      status,
      steps,
    };

    try {
      if (isEditing && id) {
        await apiClient.put(`/services/${id}`, payload);
      } else {
        await apiClient.post('/services', payload);
      }
      navigate('/admin/services');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center text-neutral-500 animate-pulse">
        Loading service editor...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      {/* Top Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/services"
          className="text-xs font-bold text-neutral-600 hover:text-primary-600 flex items-center space-x-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Services</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-neutral-100 rounded-full text-neutral-600">
          {isEditing ? 'Edit Service' : 'New Service'}
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-extrabold text-neutral-charcoal">
          {isEditing ? `Edit "${title || 'Service'}"` : 'Create Construction Service'}
        </h1>
        <p className="text-xs text-neutral-500">Provide service details, scope range, photos, and execution steps for public display.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core Details */}
        <div className="bg-white p-6 rounded-architectural border border-neutral-concrete shadow-warm space-y-6">
          <h2 className="text-lg font-serif font-bold text-neutral-charcoal border-b border-neutral-concrete pb-3">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Service Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Industrial Steel Warehouses & PEB Buildings"
                required
                className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="renovation">Renovation & Structural Retrofitting</option>
                <option value="industrial">Industrial & Warehousing</option>
                <option value="infrastructure">Infrastructure & Turnkey</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Scope / Budget Range</label>
              <input
                type="text"
                value={scopeRange}
                onChange={(e) => setScopeRange(e.target.value)}
                placeholder="e.g. ₹2.0Cr – ₹6.0Cr or Custom Quote"
                className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of materials, engineering standards, and construction execution..."
                className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Cover Photo Upload */}
        <div className="bg-white p-6 rounded-architectural border border-neutral-concrete shadow-warm space-y-4">
          <h2 className="text-lg font-serif font-bold text-neutral-charcoal border-b border-neutral-concrete pb-3">Service Cover Photo</h2>

          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste Image URL (https://...)"
                className="flex-1 px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <label className="px-4 py-2.5 bg-neutral-charcoal hover:bg-neutral-800 text-white text-xs font-bold rounded-md cursor-pointer flex items-center space-x-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {imageUrl && (
              <div className="relative h-56 rounded-lg overflow-hidden border border-neutral-concrete bg-neutral-100">
                <img src={imageUrl} alt="Service Preview" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/70 text-white text-[10px] font-mono rounded">Preview</span>
              </div>
            )}
          </div>
        </div>

        {/* Execution Process Steps */}
        <div className="bg-white p-6 rounded-architectural border border-neutral-concrete shadow-warm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-concrete pb-3">
            <h2 className="text-lg font-serif font-bold text-neutral-charcoal">Execution Process Steps ({steps.length})</h2>
            <button
              type="button"
              onClick={handleAddStep}
              className="text-xs font-bold px-3 py-1.5 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-md flex items-center space-x-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Step</span>
            </button>
          </div>

          <div className="space-y-4">
            {steps.map((st, idx) => (
              <div key={idx} className="p-4 bg-neutral-sand/60 rounded-xl border border-neutral-concrete space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 bg-primary-500 text-white rounded-full text-xs font-bold flex items-center justify-center">
                      {st.step}
                    </span>
                    <input
                      type="text"
                      value={st.title}
                      onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                      placeholder="Step Title"
                      className="px-3 py-1.5 bg-white border border-neutral-concrete rounded text-sm font-bold text-neutral-charcoal focus:outline-none"
                    />
                  </div>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <textarea
                  rows={2}
                  value={st.desc}
                  onChange={(e) => handleStepChange(idx, 'desc', e.target.value)}
                  placeholder="Phase description..."
                  className="w-full px-3 py-2 bg-white border border-neutral-concrete rounded text-xs text-neutral-700 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Publishing Options */}
        <div className="bg-white p-6 rounded-architectural border border-neutral-concrete shadow-warm space-y-4">
          <h2 className="text-lg font-serif font-bold text-neutral-charcoal border-b border-neutral-concrete pb-3">Publishing Status</h2>
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="published"
                checked={status === 'published'}
                onChange={() => setStatus('published')}
                className="w-4 h-4 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-xs font-bold text-neutral-700">Published (Visible on Public Website)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={status === 'draft'}
                onChange={() => setStatus('draft')}
                className="w-4 h-4 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-xs font-bold text-neutral-700">Draft (Admin Only)</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <Link
            to="/admin/services"
            className="px-5 py-3 text-xs font-bold text-neutral-600 hover:bg-neutral-sand rounded-architectural transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-architectural transition-all shadow-warm flex items-center space-x-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Service...' : isEditing ? 'Update Service' : 'Save & Publish Service'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
