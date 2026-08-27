import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { ShieldCheck, LogIn, AlertCircle, KeyRound, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('admin_token')) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('SRMHomes2026Admin!');
    setError(null);
  };


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const cleanUser = username.trim().toLowerCase();

    // Check default admin credentials
    const isDefaultAdmin = (cleanUser === 'admin' || cleanUser === 'admin@srmhomes.com') && password === 'SRMHomes2026Admin!';

    if (isDefaultAdmin) {
      // Create local admin session immediately
      const token = 'srm_admin_session_' + Date.now();
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify({ username: 'admin', email: 'admin@srmhomes.com', role: 'admin' }));

      // Optionally sync with backend if available
      apiClient.post('/auth/login', { username, password }).then(res => {
        if (res.data && res.data.token) {
          localStorage.setItem('admin_token', res.data.token);
        }
      }).catch(() => {
        // Backend offline or starting up, local token already set
      });

      setSuccess('Authentication successful! Redirecting to property management portal...');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 500);
      setLoading(false);
      return;
    }

    try {
      // Try Flask Backend for custom credentials
      const res = await apiClient.post('/auth/login', { username, password });
      if (res.data && res.data.token) {
        localStorage.setItem('admin_token', res.data.token);
        localStorage.setItem('admin_user', JSON.stringify(res.data.user || { username, role: 'admin' }));
        setSuccess('Authentication successful! Redirecting...');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 500);
        return;
      }
      setError('Invalid username or password. Please check your credentials.');
    } catch (err: any) {
      // Try Supabase Auth as fallback
      try {
        const { data, error: authErr } = await supabase.auth.signInWithPassword({
          email: cleanUser.includes('@') ? cleanUser : 'admin@srmhomes.com',
          password,
        });

        if (!authErr && data.session) {
          localStorage.setItem('admin_token', data.session.access_token);
          setSuccess('Supabase Authentication successful! Redirecting...');
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 500);
          return;
        }
      } catch (fallbackErr) {
        // Ignore fallback
      }

      const errMsg = err.response?.data?.error || (err.message === 'Network Error' ? 'Unable to reach backend server. Please verify backend is running, or use default admin credentials.' : err.message);
      setError(errMsg || 'Invalid username or password credentials.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-neutral-sand/40">
      <div className="w-full max-w-md bg-white p-8 rounded-architectural border border-neutral-concrete shadow-warm-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-warm-sm border border-primary-200">
            <Building2 className="w-7 h-7" />
          </div>
          <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-700 text-[11px] font-bold uppercase tracking-widest rounded-full">
            Admin & Staff Portal
          </span>
          <h1 className="text-2xl font-serif font-extrabold text-neutral-charcoal">Manage Properties & Work</h1>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">
            Sign in with administrator credentials to add projects, publish completed work, and manage leads.
          </p>
        </div>

        {/* Quick Credentials Box */}
        <div className="p-4 bg-gradient-to-br from-primary-50 to-amber-50/50 rounded-xl border border-primary-200/70 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-primary-800">
              <KeyRound className="w-4 h-4 text-primary-600" />
              <span>Default Admin Credentials</span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-bold px-2.5 py-1 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-all shadow-sm flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Auto Fill</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs bg-white/80 p-2.5 rounded-lg border border-primary-100 font-mono">
            <div>
              <span className="text-[10px] text-neutral-400 font-sans block uppercase">Username</span>
              <strong className="text-neutral-800">admin</strong>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-sans block uppercase">Password</span>
              <strong className="text-neutral-800">SRMHomes2026Admin!</strong>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin or admin@srmhomes.com"
              required
              className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 bg-neutral-sand border border-neutral-concrete rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-architectural transition-all shadow-warm flex items-center justify-center space-x-2 active:scale-[0.99]"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
          </button>
        </form>

        <div className="pt-2 text-center">
          <a
            href="/"
            className="text-xs font-semibold text-neutral-500 hover:text-primary-600 transition-colors"
          >
            ← Back to SRM Homes Website
          </a>
        </div>

      </div>
    </div>
  );
}

