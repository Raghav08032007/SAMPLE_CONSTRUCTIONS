import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  cover_image: string;
  body: string;
  published_at: string;
}

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Top 5 Architectural Trends Shaping Modern Chennai Villas in 2026',
    slug: 'top-5-architectural-trends-chennai-villas',
    cover_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    body: 'Discover how terracotta jali screens, passive cooling courtyards, and open-plan living rooms are revolutionizing coastal climate residential homes...',
    published_at: '2026-08-15',
  },
  {
    id: '2',
    title: 'A Guide to Structural Retrofitting & Restoring Ancestral Homes',
    slug: 'guide-to-structural-retrofitting-ancestral-homes',
    cover_image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    body: 'Restoring a traditional Tamil heritage home requires careful load-bearing column checks, micro-concrete jacketing, and moisture barrier sealing...',
    published_at: '2026-07-28',
  },
  {
    id: '3',
    title: 'Understanding Commercial FAR & Building Approvals in Tamil Nadu',
    slug: 'understanding-commercial-far-building-approvals',
    cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    body: 'Everything developers need to know about Floor Area Ratio (FAR), setback norms, and CMDA sanction clearances for office hubs...',
    published_at: '2026-07-10',
  },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);

  useEffect(() => {
    apiClient.get('/posts').then((res) => {
      if (res.data.posts && res.data.posts.length > 0) {
        setPosts(res.data.posts);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-wider font-semibold text-primary-500">Architectural Insights</span>
        <h1 className="text-4xl font-serif font-bold text-neutral-charcoal">SRM Homes Blog & Local SEO Guides</h1>
        <p className="text-neutral-600">
          Expert articles on structural design, building approvals, material selection, and home construction tips.
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-architectural overflow-hidden border border-neutral-concrete shadow-warm hover:shadow-warm-lg transition-all flex flex-col justify-between">
            <div>
              <img src={post.cover_image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6 space-y-3">
                <div className="flex items-center space-x-2 text-xs text-neutral-400 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-primary-500" />
                  <span>{new Date(post.published_at).toLocaleDateString()}</span>
                </div>
                <h2 className="text-xl font-serif font-bold text-neutral-charcoal hover:text-primary-500 transition-colors">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">{post.body}</p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link
                to={`/blog/${post.slug}`}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary-600 hover:text-primary-700"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
