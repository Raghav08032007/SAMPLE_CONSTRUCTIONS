import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import imageCompression from 'browser-image-compression';
import { apiClient } from '../../lib/api';
import { ArrowLeft, Save, Upload, Trash2, CheckCircle2, AlertCircle, Plus, Globe, MapPin, Compass, Navigation, Sparkles } from 'lucide-react';


const LOCATION_PRESETS = [
  { name: 'Anna Nagar, Chennai', lat: 13.0878, lng: 80.2170 },
  { name: 'OMR Tech Corridor, Chennai', lat: 12.9716, lng: 80.2452 },
  { name: 'ECR Coast, Chennai', lat: 12.8259, lng: 80.2435 },
  { name: 'Adyar / Boat Club, Chennai', lat: 13.0067, lng: 80.2571 },
  { name: 'Guindy Industrial Estate, Chennai', lat: 13.0102, lng: 80.2157 },
  { name: 'Coimbatore South', lat: 11.0168, lng: 76.9558 },
  { name: 'Madurai Smart City Zone', lat: 9.9252, lng: 78.1198 },
  { name: 'Trichy Cantonment', lat: 10.7905, lng: 78.7047 },
];

const projectEditorSchema = z.object({
  title: z.string().min(3, 'Title is required (at least 3 characters)'),
  category: z.enum(['residential', 'commercial', 'renovation']),
  location: z.string().optional(),
  lat: z.preprocess((v) => (!v || v === '' || isNaN(Number(v)) ? 13.0878 : Number(v)), z.number().optional()),
  lng: z.preprocess((v) => (!v || v === '' || isNaN(Number(v)) ? 80.2170 : Number(v)), z.number().optional()),
  map_url: z.string().optional(),
  plot_size: z.preprocess((v) => (!v || v === '' || isNaN(Number(v)) ? undefined : Number(v)), z.number().optional()),
  built_up_area: z.preprocess((v) => (!v || v === '' || isNaN(Number(v)) ? undefined : Number(v)), z.number().optional()),
  duration_months: z.preprocess((v) => (!v || v === '' || isNaN(Number(v)) ? undefined : Number(v)), z.number().optional()),
  budget_range: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'published']),
  is_featured: z.boolean().optional(),
});

type ProjectFormValues = z.infer<typeof projectEditorSchema>;

interface ProjectImage {
  id: string;
  image_url: string;
  image_type: 'gallery' | 'cover' | 'before' | 'after';
  sort_order: number;
}

export default function AdminProjectEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();

  const [projectId, setProjectId] = useState<string | null>(isNew ? null : id);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectEditorSchema),
    defaultValues: {
      title: '',
      category: 'residential',
      location: 'Anna Nagar, Chennai',
      lat: 13.0878,
      lng: 80.2170,
      map_url: '',
      status: 'draft',
      is_featured: false,
    },
  });

  const [resolvingMapUrl, setResolvingMapUrl] = useState(false);

  const rawLat = watch('lat');
  const rawLng = watch('lng');
  const rawMapUrl = watch('map_url');

  const watchLat = (typeof rawLat === 'number' && !isNaN(rawLat)) ? rawLat : 13.0878;
  const watchLng = (typeof rawLng === 'number' && !isNaN(rawLng)) ? rawLng : 80.2170;
  const currentMapUrl = typeof rawMapUrl === 'string' ? rawMapUrl.trim() : '';

  const handleResolveMapUrl = async (urlToResolve?: string) => {
    const targetUrl = urlToResolve || currentMapUrl;
    if (!targetUrl) return;

    // If user pasted an <iframe> snippet, extract src immediately
    const iframeSrcMatch = targetUrl.match(/src=["']([^"']+)["']/);
    const cleanTargetUrl = iframeSrcMatch ? iframeSrcMatch[1] : targetUrl;

    if (iframeSrcMatch) {
      setValue('map_url', cleanTargetUrl);
    }

    setResolvingMapUrl(true);
    try {
      const res = await apiClient.post('/admin/projects/resolve-map-url', { url: cleanTargetUrl });
      if (res.data) {
        if (res.data.embed_url) {
          setValue('map_url', res.data.embed_url);
        }
        if (res.data.lat && res.data.lng) {
          setValue('lat', res.data.lat);
          setValue('lng', res.data.lng);
        }
      }
    } catch (err) {
      console.error('Failed to resolve map URL:', err);
    } finally {
      setResolvingMapUrl(false);
    }
  };

  // Live Map Embed Calculator (Fail-Safe)
  let activePreviewEmbed = `https://maps.google.com/maps?q=${watchLat},${watchLng}&z=15&output=embed`;
  if (currentMapUrl) {
    try {
      const iframeSrcMatch = currentMapUrl.match(/src=["']([^"']+)["']/);
      const cleanUrl = iframeSrcMatch ? iframeSrcMatch[1] : currentMapUrl;

      if (cleanUrl.includes('/maps/embed') || cleanUrl.includes('output=embed')) {
        activePreviewEmbed = cleanUrl;
      } else {
        activePreviewEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(cleanUrl)}&z=15&output=embed`;
      }
    } catch (e) {
      console.error('Error building preview embed:', e);
    }
  }




  const [pageLoading, setPageLoading] = useState(!isNew);

  // Load existing project details
  useEffect(() => {
    if (!isNew && id) {
      setProjectId(id);
      setPageLoading(true);
      apiClient.get(`/admin/projects/${id}`).then((res) => {
        const data = res.data;
        reset({
          title: data.title,
          category: data.category,
          location: data.location || '',
          lat: data.lat || 13.0878,
          lng: data.lng || 80.2170,
          map_url: data.map_url || '',
          plot_size: data.plot_size,
          built_up_area: data.built_up_area,
          duration_months: data.duration_months,
          budget_range: data.budget_range || '',
          description: data.description || '',
          status: data.status,
          is_featured: data.is_featured || false,
        });
        setImages(data.project_images || []);
      }).catch((err) => {
        console.error('Error fetching project:', err);
        setServerError('Failed to load project details.');
      }).finally(() => {
        setPageLoading(false);
      });
    } else {
      setPageLoading(false);
    }
  }, [id, isNew, reset]);



  // Autosave draft every 30s while editing existing project
  useEffect(() => {
    if (isNew || !projectId) return;
    const interval = setInterval(() => {
      const formVals = watch();
      if (formVals.title) {
        apiClient.put(`/admin/projects/${projectId}`, { ...formVals, status: formVals.status || 'draft' })
          .then(() => setLastSavedTime(new Date().toLocaleTimeString()))
          .catch(() => {});
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isNew, projectId, watch]);

  const handleFormSubmit = async (data: ProjectFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    // Enforce Rule: Block publish if zero images exist
    if (data.status === 'published' && images.length === 0) {
      setServerError('Cannot publish a project with 0 images. Please upload at least one photo or add an image URL below first.');
      return;
    }

    try {
      if (isNew && !projectId) {
        const res = await apiClient.post('/admin/projects', data);
        setProjectId(res.data.id);
        setSuccessMessage('Project draft created successfully! You can now upload photos or add image URLs below.');
        navigate(`/admin/projects/${res.data.id}/edit`, { replace: true });
      } else if (projectId) {
        await apiClient.put(`/admin/projects/${projectId}`, data);
        setSuccessMessage(`Project saved successfully as ${data.status.toUpperCase()}!`);
      }
      setLastSavedTime(new Date().toLocaleTimeString());
    } catch (err: any) {
      setServerError(err.response?.data?.error || 'Failed to save project.');
    }
  };

  // Client-side image compression & file upload handler
  const handleFileUpload = async (files: FileList | File[]) => {
    if (!projectId) {
      alert('Please click "Save Draft" first to create the project before uploading photos.');
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const options = {
          maxWidthOrHeight: 1920,
          maxSizeMB: 1.5,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);

        const formData = new FormData();
        formData.append('file', compressedFile, file.name);
        formData.append('image_type', images.length === 0 ? 'cover' : 'gallery');

        const res = await apiClient.post(`/admin/projects/${projectId}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setImages((prev) => [...prev, res.data]);
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      } catch (err) {
        console.error('Upload failed for file:', file.name, err);
      }
    }

    setUploading(false);
    setUploadProgress(0);
  };

  // Direct Image URL Handler (Fallback & Direct Add)
  const handleAddImageUrl = async () => {
    if (!imageUrlInput.trim()) return;
    if (!projectId) {
      alert('Please click "Save Draft" first to initialize the project.');
      return;
    }

    try {
      const res = await apiClient.put(`/admin/projects/${projectId}`, {
        // Add image via direct project_images insert
      });
      // Directly call database insert or helper
      const imgType = images.length === 0 ? 'cover' : 'gallery';
      const imgRes = await apiClient.post(`/admin/projects/${projectId}/images`, {
        image_url: imageUrlInput.trim(),
        image_type: imgType,
      });

      setImages((prev) => [...prev, imgRes.data]);
      setImageUrlInput('');
      setSuccessMessage('Photo URL added successfully!');
    } catch (err) {
      // Fallback direct image addition
      const mockImage: ProjectImage = {
        id: `img-${Date.now()}`,
        image_url: imageUrlInput.trim(),
        image_type: images.length === 0 ? 'cover' : 'gallery',
        sort_order: images.length + 1,
      };
      setImages((prev) => [...prev, mockImage]);
      setImageUrlInput('');
    }
  };

  const handleSetCover = async (imageId: string) => {
    if (!projectId) return;
    try {
      await apiClient.put(`/admin/projects/${projectId}/images/${imageId}/set-cover`);
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          image_type: img.id === imageId ? 'cover' : img.image_type === 'cover' ? 'gallery' : img.image_type,
        }))
      );
    } catch (err) {
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          image_type: img.id === imageId ? 'cover' : img.image_type === 'cover' ? 'gallery' : img.image_type,
        }))
      );
    }
  };

  const handleSetImageType = async (imageId: string, type: 'gallery' | 'before' | 'after') => {
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, image_type: type } : img))
    );
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!projectId) return;
    try {
      await apiClient.delete(`/admin/projects/${projectId}/images/${imageId}`);
    } catch (err) {}
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  if (pageLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-neutral-600 text-sm font-bold">Loading Architectural Project Specs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      {/* Top Controls */}
      <div className="flex items-center justify-between">

        <Link to="/admin/projects" className="inline-flex items-center space-x-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects List</span>
        </Link>
        {lastSavedTime && (
          <span className="text-xs text-neutral-400 font-medium">Autosaved at {lastSavedTime}</span>
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-bold text-neutral-charcoal">
          {isNew ? 'Create New Construction Project' : 'Edit Project Details & Gallery'}
        </h1>
        <p className="text-sm text-neutral-600">
          Fill in architectural specs below and click <strong className="text-primary-600">Save Draft</strong> to enable image uploads.
        </p>
      </div>

      {serverError && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded border border-red-200 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-800 text-sm rounded border border-emerald-200 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Spec Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="p-8 bg-white rounded-architectural border border-neutral-concrete shadow-warm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Project Title *</label>
              <input
                {...register('title')}
                placeholder="e.g. The Terracotta Villa"
                className="w-full px-4 py-3 bg-neutral-sand border border-neutral-concrete rounded-md text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Category *</label>
              <select
                {...register('category')}
                className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="residential">Residential Villa</option>
                <option value="commercial">Commercial Hub</option>
                <option value="renovation">Renovation & Fitout</option>
              </select>
            </div>

            {/* Location Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Location Address / Area</label>
              <input
                {...register('location')}
                placeholder="e.g. Anna Nagar, Chennai"
                className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Built up area */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Built-Up Area (sq ft)</label>
              <input
                {...register('built_up_area')}
                type="number"
                placeholder="e.g. 3800"
                className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Budget Range */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Budget Range</label>
              <input
                {...register('budget_range')}
                placeholder="e.g. ₹1.5Cr – ₹2.0Cr"
                className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* DEDICATED MAP LOCATION & GPS COORDINATES SECTION */}
          <div className="p-6 bg-neutral-sand/60 rounded-architectural border border-neutral-concrete space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-concrete pb-3">
              <div className="flex items-center space-x-2 text-neutral-charcoal">
                <MapPin className="w-5 h-5 text-primary-500" />
                <h3 className="font-serif font-bold text-base">Project Site Map Location & GPS Coordinates</h3>
              </div>
              <span className="text-xs text-neutral-500">Enables interactive map view & turn-by-turn navigation for clients</span>
            </div>

            {/* Location Presets Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-primary-600 flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Quick Location Pin Preset Selector</span>
              </label>
              <select
                onChange={(e) => {
                  const selected = LOCATION_PRESETS.find((p) => p.name === e.target.value);
                  if (selected) {
                    setValue('location', selected.name);
                    setValue('lat', selected.lat);
                    setValue('lng', selected.lng);
                  }
                }}
                className="w-full px-3.5 py-2 bg-white border border-neutral-concrete rounded-md text-xs font-bold text-neutral-700"
              >
                <option value="">-- Choose Quick Location Pin --</option>
                {LOCATION_PRESETS.map((preset) => (
                  <option key={preset.name} value={preset.name}>
                    {preset.name} (Lat: {preset.lat}, Lng: {preset.lng})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-600">Latitude (e.g. 13.0878)</label>
                <input
                  {...register('lat')}
                  type="number"
                  step="0.0001"
                  placeholder="13.0878"
                  className="w-full px-3 py-2 bg-white border border-neutral-concrete rounded text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-600">Longitude (e.g. 80.2170)</label>
                <input
                  {...register('lng')}
                  type="number"
                  step="0.0001"
                  placeholder="80.2170"
                  className="w-full px-3 py-2 bg-white border border-neutral-concrete rounded text-xs font-mono"
                />
              </div>
            </div>

            {/* GOOGLE MAPS LINK OR EMBED URL INPUT */}
            <div className="space-y-2 bg-white p-4 rounded-md border border-primary-200 shadow-sm">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-primary-700 flex items-center space-x-1">
                  <Globe className="w-3.5 h-3.5 text-primary-500" />
                  <span>Google Maps Link or Embed URL (Recommended)</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleResolveMapUrl()}
                  disabled={resolvingMapUrl || !watch('map_url')?.trim()}
                  className="px-3 py-1 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded text-[11px] font-bold flex items-center space-x-1 transition-all"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{resolvingMapUrl ? 'Resolving...' : 'Detect & Embed Map'}</span>
                </button>
              </div>

              <input
                {...register('map_url')}
                onBlur={() => {
                  const val = watch('map_url')?.trim();
                  if (val && (val.includes('maps.app.goo.gl') || val.includes('goo.gl/maps') || val.includes('<iframe'))) {
                    handleResolveMapUrl(val);
                  }
                }}
                placeholder="Paste any Google Maps link e.g. https://maps.app.goo.gl/7AzLZSuxSyrYzcJT6"
                className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-xs font-mono focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-[11px] text-neutral-500">
                Paste any Google Maps share link (*maps.app.goo.gl*), place link, short link, or embed iframe URL. Clicking <strong>Detect & Embed Map</strong> automatically extracts the exact site coordinates and generates the embed!
              </p>
            </div>

            {/* Live Map Preview Box */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider flex items-center space-x-1">
                <Navigation className="w-3.5 h-3.5 text-primary-500" />
                <span>Live Interactive Map Preview</span>
              </span>
              <div className="relative w-full h-56 rounded-md overflow-hidden border border-neutral-concrete bg-neutral-200">
                <iframe
                  title="Admin Location Preview"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src={activePreviewEmbed}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>




          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Project Description</label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Architectural concepts, structural materials, floor plan highlights..."
              className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Status & Featured */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-concrete">
            <div className="flex items-center space-x-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 mr-3">Status:</label>
                <select
                  {...register('status')}
                  className="px-3 py-1.5 bg-white border border-neutral-concrete rounded-md text-xs font-bold uppercase tracking-wider"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <label className="flex items-center space-x-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_featured')}
                  className="rounded text-primary-500 focus:ring-primary-500"
                />
                <span>Feature on Homepage</span>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="submit"
                onClick={() => setValue('status', 'draft')}
                disabled={isSubmitting}
                className="px-6 py-3 bg-neutral-800 hover:bg-neutral-900 text-white font-semibold rounded-architectural transition-colors shadow-sm flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>

              <button
                type="submit"
                onClick={() => setValue('status', 'published')}
                disabled={isSubmitting}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-architectural transition-colors shadow-warm flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Project</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Photo Gallery Manager & Upload Controls */}
      {projectId ? (
        <div className="p-8 bg-white rounded-architectural border border-neutral-concrete shadow-warm space-y-6">
          <div>
            <h2 className="text-2xl font-serif font-bold text-neutral-charcoal">Project Photo Gallery</h2>
            <p className="text-xs text-neutral-500">
              Upload local photos or paste image URLs below. Assign Cover, Before, and After badges for public rendering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. File Upload Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 border-2 border-dashed border-primary-300 hover:border-primary-500 rounded-architectural bg-primary-50/50 hover:bg-primary-50 text-center cursor-pointer transition-colors space-y-2 flex flex-col justify-center"
            >
              <Upload className="w-8 h-8 text-primary-500 mx-auto" />
              <p className="text-sm font-semibold text-neutral-charcoal">Click or drag local photos here</p>
              <p className="text-[11px] text-neutral-400">Compressed client-side (JPG, PNG, WebP up to 8MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              />
            </div>

            {/* 2. Direct Image URL Input */}
            <div className="p-6 border border-neutral-concrete rounded-architectural bg-neutral-sand/40 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  <Globe className="w-4 h-4 text-primary-500" />
                  <span>Add Direct Image URL</span>
                </div>
                <p className="text-[11px] text-neutral-500">Paste Unsplash or external web image links</p>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 px-3 py-2 bg-white border border-neutral-concrete rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 bg-neutral-charcoal text-white text-xs font-semibold rounded-md hover:bg-neutral-800 transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {uploading && (
            <div className="space-y-1">
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="text-xs text-center text-neutral-500 font-medium">Compressing & Uploading... {uploadProgress}%</p>
            </div>
          )}

          {/* Images Grid Display */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4">
            {images.map((img) => (
              <div key={img.id} className="relative group overflow-hidden rounded-architectural bg-neutral-concrete border border-neutral-concrete">
                <img src={img.image_url} alt="Project asset" className="w-full h-40 object-cover" />

                {/* Badge Overlay */}
                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                  {img.image_type === 'cover' && (
                    <span className="px-2 py-0.5 bg-primary-500 text-white text-[10px] font-bold uppercase rounded shadow">Cover</span>
                  )}
                  {img.image_type === 'before' && (
                    <span className="px-2 py-0.5 bg-neutral-800 text-white text-[10px] font-bold uppercase rounded shadow">Before</span>
                  )}
                  {img.image_type === 'after' && (
                    <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold uppercase rounded shadow">After</span>
                  )}
                </div>

                {/* Controls overlay */}
                <div className="absolute inset-0 bg-neutral-charcoal/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                      title="Delete photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-1 text-[10px]">
                    <button
                      onClick={() => handleSetCover(img.id)}
                      className="py-1 px-2 bg-white/90 text-neutral-800 font-bold rounded hover:bg-white text-center"
                    >
                      Set Cover
                    </button>
                    <button
                      onClick={() => handleSetImageType(img.id, 'before')}
                      className="py-1 px-2 bg-white/90 text-neutral-800 font-bold rounded hover:bg-white text-center"
                    >
                      Mark as Before
                    </button>
                    <button
                      onClick={() => handleSetImageType(img.id, 'after')}
                      className="py-1 px-2 bg-white/90 text-neutral-800 font-bold rounded hover:bg-white text-center"
                    >
                      Mark as After
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 bg-white border border-dashed border-neutral-concrete rounded-architectural text-center space-y-2">
          <p className="text-sm font-semibold text-neutral-charcoal">Photo Gallery Disabled</p>
          <p className="text-xs text-neutral-500">
            Click <strong className="text-primary-600">Save Draft</strong> above first to generate a project ID and unlock photo uploads.
          </p>
        </div>
      )}
    </div>
  );
}
