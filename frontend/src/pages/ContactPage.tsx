import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '../lib/api';
import { Send, CheckCircle2, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required (at least 2 characters)'),
  phone: z.string().min(10, 'Valid 10-digit phone number required').max(15, 'Invalid phone number'),
  email: z.string().email('Invalid email address').or(z.literal('')),
  plot_size: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
  budget_range: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  project_type: z.string().min(1, 'Please select a project type'),
  message: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      project_type: 'residential',
      budget_range: '₹1.0Cr – ₹1.5Cr',
    },
  });

  const onSubmit = async (data: LeadFormValues) => {
    setServerError(null);
    try {
      await apiClient.post('/leads', data);
      setSuccess(true);
      reset();
    } catch (err: any) {
      setServerError(err.response?.data?.error || 'Failed to submit quote request. Please try again.');
    }
  };

  const whatsappMessage = encodeURIComponent(
    'Hello SRM Homes Team! I would like to inquire about an architectural construction project.'
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-wider font-semibold text-primary-500">Get In Touch</span>
        <h1 className="text-4xl font-serif font-bold text-neutral-charcoal">Request a Construction Consultation</h1>
        <p className="text-neutral-600">
          Tell us about your plot size, budget, and design aspirations. Our senior structural architects will contact you within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 bg-neutral-charcoal text-neutral-sand rounded-architectural space-y-6 shadow-warm-lg">
            <h2 className="text-2xl font-serif font-bold text-white">SRM Homes Headquarters</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>SRM Towers, 4th Floor, Anna Nagar East, Chennai, Tamil Nadu 600102</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>+91 93636 16921 / +91 44 2626 9900</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>contact@srmhomes.com</span>
              </div>
            </div>
          </div>

          {/* Direct WhatsApp Click-to-Chat Button */}
          <div className="p-6 bg-white rounded-architectural border border-neutral-concrete shadow-warm space-y-3">
            <h3 className="font-serif font-bold text-neutral-charcoal">Prefer Instant WhatsApp Chat?</h3>
            <p className="text-xs text-neutral-600">Speak directly with our project manager on WhatsApp (+91 93636 16921).</p>
            <a
              href={`https://wa.me/919363616921?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold rounded-architectural transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

        </div>

        {/* Lead Quote Submission Form */}
        <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-architectural border border-neutral-concrete shadow-warm-lg space-y-6">
          <h2 className="text-2xl font-serif font-bold text-neutral-charcoal">Project Quote Request</h2>

          {success ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-architectural text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-2xl font-serif font-bold text-emerald-800">Quote Request Received!</h3>
              <p className="text-sm text-emerald-700 max-w-md mx-auto">
                Thank you! Our engineering team has received your plot and project details. We will reach out via phone/email shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-2 px-5 py-2.5 bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-emerald-800 transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {serverError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                  {serverError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Full Name *</label>
                  <input
                    {...register('name')}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Phone Number *</label>
                  <input
                    {...register('phone')}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Email Address</label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="name@domain.com"
                    className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Project Location *</label>
                  <input
                    {...register('location')}
                    placeholder="e.g. Anna Nagar, Chennai"
                    className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.location && <p className="text-xs text-red-600">{errors.location.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Project Type */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Project Type *</label>
                  <select
                    {...register('project_type')}
                    className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="residential">Residential Villa</option>
                    <option value="commercial">Commercial Hub</option>
                    <option value="renovation">Renovation</option>
                  </select>
                </div>

                {/* Plot Size */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Plot Size (sq ft)</label>
                  <input
                    {...register('plot_size')}
                    type="number"
                    placeholder="e.g. 2400"
                    className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Budget Range */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Budget Range</label>
                  <select
                    {...register('budget_range')}
                    className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="₹50L – ₹1.0Cr">₹50L – ₹1.0Cr</option>
                    <option value="₹1.0Cr – ₹1.5Cr">₹1.0Cr – ₹1.5Cr</option>
                    <option value="₹1.5Cr – ₹2.5Cr">₹1.5Cr – ₹2.5Cr</option>
                    <option value="₹2.5Cr+">₹2.5Cr+</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Message / Requirements</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  placeholder="Describe your design preferences, timeline, or special requirements..."
                  className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-architectural transition-all shadow-warm flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                <Send className="w-5 h-5" />
                <span>{isSubmitting ? 'Sending Request...' : 'Submit Quote Request'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
