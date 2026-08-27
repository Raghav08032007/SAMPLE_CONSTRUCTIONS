import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { PageTransition } from './components/motion/PageTransition';

import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import ClientPortalPage from './pages/ClientPortalPage';

import BrandsPage from './pages/BrandsPage';

import BlogPage from './pages/BlogPage';
import BlogPostDetailPage from './pages/BlogPostDetailPage';
import DesignSystemPage from './pages/DesignSystemPage';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminProjectEditorPage from './pages/admin/AdminProjectEditorPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminServiceEditorPage from './pages/admin/AdminServiceEditorPage';
import AdminTestimonialsPage from './pages/admin/AdminTestimonialsPage';
import AdminLeadsPage from './pages/admin/AdminLeadsPage';
import WhatsAppButton from './components/WhatsAppButton';

import { Home, Building, Star, Layers, Phone, Menu, X, Sparkles, Shield, Calculator, BookOpen, Award, LogOut, ExternalLink, MessageSquare, Users, LayoutDashboard } from 'lucide-react';

function ProtectedAdminRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = Boolean(localStorage.getItem('admin_token'));
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-neutral-concrete sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-warm transition-all duration-300">
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="w-10 h-10 bg-neutral-charcoal group-hover:bg-primary-500 transition-colors rounded-architectural flex items-center justify-center text-white font-serif font-bold text-xl shadow-warm">
          S
        </div>
        <div className="flex flex-col">
          <span className="font-serif font-bold text-lg tracking-wider text-neutral-charcoal leading-none">
            SRM HOMES
          </span>
          <span className="text-[10px] tracking-widest text-primary-500 uppercase font-bold mt-0.5">
            Architectural Construction
          </span>
        </div>
      </Link>

      <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
        <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
        <Link to="/projects" className="hover:text-primary-500 transition-colors">Portfolio</Link>
        <Link to="/services" className="hover:text-primary-500 transition-colors">Services</Link>
        <Link to="/portal" className="hover:text-primary-500 transition-colors font-semibold text-primary-600">Client Portal</Link>
        <Link to="/brands" className="hover:text-primary-500 transition-colors">Brands</Link>
        <Link to="/blog" className="hover:text-primary-500 transition-colors">Blog</Link>
        <Link to="/testimonials" className="hover:text-primary-500 transition-colors">Reviews</Link>
        <Link to="/contact" className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-architectural font-semibold transition-all shadow-warm">
          Get a Quote
        </Link>
      </nav>

      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden p-2 text-neutral-charcoal focus:outline-none"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-concrete px-6 py-4 space-y-3 z-30 animate-fade-in">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold">Home</Link>
          <Link to="/projects" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold">Portfolio</Link>
          <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold">Services</Link>
          <Link to="/portal" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-primary-600">Client Portal</Link>
          <Link to="/brands" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold">Brands</Link>
          <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold">Blog</Link>
          <Link to="/testimonials" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold">Reviews</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-primary-500">Get a Quote</Link>
        </div>
      )}
    </header>
  );
}

function NavigationHeader() {
  const location = useLocation();
  const hostname = window.location.hostname;
  const isAdminSubdomain = hostname.startsWith('admin.');
  const isAdminRoute = location.pathname.startsWith('/admin') || isAdminSubdomain;
  const isLoginPage = location.pathname === '/admin/login' || location.pathname === '/admin';
  const isAuthenticated = Boolean(localStorage.getItem('admin_token'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAdminSignOut = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  };

  // DEDICATED ADMIN HEADER (Only shown AFTER login on protected admin routes)
  if (isAdminRoute) {
    if (!isAuthenticated || isLoginPage) {
      return null;
    }
    return (
      <header className="bg-neutral-charcoal text-neutral-sand border-b border-neutral-800 sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between shadow-warm-lg">

        <div className="flex items-center space-x-3">
          <Link to="/admin/dashboard" className="text-xl font-serif font-extrabold text-white tracking-wider hover:text-primary-400 transition-colors flex items-center space-x-2">
            <span>SRM HOMES</span>
            <span className="px-2 py-0.5 bg-primary-500 text-white text-[10px] font-bold uppercase tracking-widest rounded">
              Admin
            </span>
          </Link>
        </div>

        {/* Desktop Admin Nav */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold uppercase tracking-wider">
          <Link
            to="/admin/dashboard"
            className={`flex items-center space-x-1.5 transition-colors ${
              location.pathname === '/admin/dashboard' ? 'text-primary-400 font-extrabold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Admin Home</span>
          </Link>
          <Link
            to="/admin/projects"
            className={`flex items-center space-x-1.5 transition-colors ${
              location.pathname.startsWith('/admin/projects') ? 'text-primary-400 font-extrabold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Projects</span>
          </Link>
          <Link
            to="/admin/services"
            className={`flex items-center space-x-1.5 transition-colors ${
              location.pathname.startsWith('/admin/services') ? 'text-primary-400 font-extrabold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Services</span>
          </Link>
          <Link
            to="/admin/testimonials"
            className={`flex items-center space-x-1.5 transition-colors ${
              location.pathname.startsWith('/admin/testimonials') ? 'text-primary-400 font-extrabold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reviews</span>
          </Link>
          <Link
            to="/admin/leads"
            className={`flex items-center space-x-1.5 transition-colors ${
              location.pathname.startsWith('/admin/leads') ? 'text-primary-400 font-extrabold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Leads</span>
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center space-x-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs font-semibold flex items-center space-x-1 transition-colors"
          >
            <span>View Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={handleAdminSignOut}
            className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded text-xs font-bold flex items-center space-x-1 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Admin Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-neutral-charcoal border-b border-neutral-800 px-6 py-4 space-y-3 z-50">
            <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-white">Admin Home</Link>
            <Link to="/admin/projects" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-neutral-300">Projects Manager</Link>
            <Link to="/admin/services" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-neutral-300">Services Manager</Link>
            <Link to="/admin/testimonials" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-neutral-300">Review Moderation</Link>
            <Link to="/admin/leads" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-neutral-300">Leads CRM</Link>
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
              <a href="/" target="_blank" className="text-xs text-primary-400 font-bold">View Public Site ↗</a>
              <button onClick={handleAdminSignOut} className="text-xs font-bold text-red-500">Sign Out</button>
            </div>
          </div>
        )}
      </header>
    );
  }

  // PUBLIC WEBSITE HEADER (For all public routes)
  return <PublicHeader />;
}

function AnimatedRoutes() {
  const location = useLocation();
  const hostname = window.location.hostname;
  const isAdminSubdomain = hostname.startsWith('admin.');
  const isAuthenticated = Boolean(localStorage.getItem('admin_token'));

  return (
    <PageTransition>
      <Routes location={location} key={location.pathname}>
        {/* Subdomain Root Handling */}
        {isAdminSubdomain && (
          <Route path="/" element={isAuthenticated ? <AdminDashboardPage /> : <AdminLoginPage />} />
        )}

        {/* Public Core Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:serviceSlug" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/portal" element={<ClientPortalPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />

        {/* Admin Routes (Protected with Login Guard) */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboardPage /></ProtectedAdminRoute>} />
        <Route path="/admin/projects" element={<ProtectedAdminRoute><AdminProjectsPage /></ProtectedAdminRoute>} />
        <Route path="/admin/projects/new" element={<ProtectedAdminRoute><AdminProjectEditorPage /></ProtectedAdminRoute>} />
        <Route path="/admin/projects/:id/edit" element={<ProtectedAdminRoute><AdminProjectEditorPage /></ProtectedAdminRoute>} />
        <Route path="/admin/services" element={<ProtectedAdminRoute><AdminServicesPage /></ProtectedAdminRoute>} />
        <Route path="/admin/services/new" element={<ProtectedAdminRoute><AdminServiceEditorPage /></ProtectedAdminRoute>} />
        <Route path="/admin/services/:id/edit" element={<ProtectedAdminRoute><AdminServiceEditorPage /></ProtectedAdminRoute>} />
        <Route path="/admin/testimonials" element={<ProtectedAdminRoute><AdminTestimonialsPage /></ProtectedAdminRoute>} />
        <Route path="/admin/leads" element={<ProtectedAdminRoute><AdminLeadsPage /></ProtectedAdminRoute>} />
      </Routes>
    </PageTransition>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-neutral-sand font-sans text-neutral-charcoal antialiased">
        <NavigationHeader />

        {/* Main View Outlet */}
        <main className="flex-1 flex flex-col">
          <AnimatedRoutes />
        </main>

        {/* Floating Side WhatsApp Contact Button */}
        <WhatsAppButton phoneNumber="919363616921" />


        {/* Mobile Bottom Tab Bar (Hidden when on admin pages) */}
        <MobileBottomTabs />
      </div>
    </Router>
  );
}

function MobileBottomTabs() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-concrete py-2 px-4 flex justify-around items-center z-40 shadow-lg">
      <Link to="/" className="flex flex-col items-center text-xs font-medium text-neutral-600 hover:text-primary-500">
        <Home className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </Link>
      <Link to="/projects" className="flex flex-col items-center text-xs font-medium text-neutral-600 hover:text-primary-500">
        <Building className="w-5 h-5 mb-0.5" />
        <span>Projects</span>
      </Link>
      <Link to="/portal" className="flex flex-col items-center text-xs font-medium text-neutral-600 hover:text-primary-500">
        <Shield className="w-5 h-5 mb-0.5" />
        <span>Portal</span>
      </Link>
      <Link to="/contact" className="flex flex-col items-center text-xs font-medium text-primary-500 font-bold">
        <Phone className="w-5 h-5 mb-0.5" />
        <span>Quote</span>
      </Link>
    </nav>
  );
}
