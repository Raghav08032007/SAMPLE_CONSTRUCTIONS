import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '../lib/api';
import { Star, Send, CheckCircle2, MessageSquare } from 'lucide-react';

const testimonialSchema = z.object({
  client_name: z.string().min(2, 'Name must be at least 2 characters'),
  rating: z.number().min(1).max(5),
  quote: z.string().min(10, 'Review must be at least 10 characters').max(500, 'Review must be under 500 characters'),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

interface Testimonial {
  id: string;
  client_name: string;
  rating: number;
  quote: string;
  submitted_at: string;
  projects?: { title: string; category: string };
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      client_name: '',
      rating: 5,
      quote: '',
    },
  });

  const currentQuote = watch('quote') || '';
  const currentRating = watch('rating') || 5;

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await apiClient.get('/testimonials');
        setTestimonials(res.data.testimonials || []);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const onSubmit = async (data: TestimonialFormValues) => {
    setServerError(null);
    try {
      await apiClient.post('/testimonials', data);
      setSubmittedSuccess(true);
      reset();
    } catch (err: any) {
      setServerError(err.response?.data?.error || 'Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-wider font-semibold text-primary-500">Client Feedback</span>
        <h1 className="text-4xl font-serif font-bold text-neutral-charcoal">Homeowner Reviews & Testimonials</h1>
        <p className="text-neutral-600">
          Read real reviews from homeowners and business developers who built their architectural projects with SRM Homes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Approved Testimonials List */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-2xl font-serif font-bold text-neutral-charcoal">Approved Reviews</h2>

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 bg-white rounded-architectural border border-neutral-concrete animate-pulse space-y-3">
                  <div className="h-4 bg-neutral-200 w-1/4 rounded" />
                  <div className="h-3 bg-neutral-200 w-full rounded" />
                </div>
              ))}
            </div>
          )}

          {!loading && testimonials.length === 0 && (
            <p className="text-neutral-500 italic">No approved testimonials yet.</p>
          )}

          {!loading &&
            testimonials.map((t) => (
              <div key={t.id} className="p-6 bg-white rounded-architectural border border-neutral-concrete shadow-warm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-neutral-charcoal">{t.client_name}</h3>
                    {t.projects?.title && (
                      <span className="text-xs text-primary-600 font-medium">
                        Project: {t.projects.title} ({t.projects.category})
                      </span>
                    )}
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-neutral-700 text-sm leading-relaxed italic">"{t.quote}"</p>
              </div>
            ))}
        </div>

        {/* Submit Review Form */}
        <div className="lg:col-span-5 bg-white p-8 rounded-architectural border border-neutral-concrete shadow-warm-lg space-y-6 sticky top-24">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-bold text-neutral-charcoal">Submit Your Review</h2>
            <p className="text-xs text-neutral-500">
              Your feedback helps us continuously elevate our architectural standards.
            </p>
          </div>

          {submittedSuccess ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-architectural text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif font-bold text-emerald-800 text-lg">Review Received</h3>
              <p className="text-xs text-emerald-700">
                Thank you! Your submission has been sent to our team and will appear publicly following administrative approval.
              </p>
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="mt-2 text-xs font-semibold text-emerald-800 underline"
              >
                Submit another review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                  {serverError}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Your Full Name</label>
                <input
                  {...register('client_name')}
                  placeholder="e.g. Rajesh V."
                  className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.client_name && <p className="text-xs text-red-600">{errors.client_name.message}</p>}
              </div>

              {/* Rating Star Picker */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Star Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setValue('rating', star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= currentRating ? 'text-amber-400 fill-current' : 'text-neutral-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs text-neutral-600">
                  <label className="font-semibold uppercase tracking-wider">Your Review</label>
                  <span className={currentQuote.length > 500 ? 'text-red-500 font-bold' : ''}>
                    {currentQuote.length}/500
                  </span>
                </div>
                <textarea
                  {...register('quote')}
                  rows={4}
                  placeholder="Share details of your experience with SRM Homes..."
                  className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.quote && <p className="text-xs text-red-600">{errors.quote.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-architectural transition-colors shadow-warm flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Testimonial'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
