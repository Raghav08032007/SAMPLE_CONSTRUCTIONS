-- ==========================================================
-- SRM HOMES SEED DATA
-- 6 Seed Projects (Residential, Commercial, Renovation)
-- 5 Seed Testimonials
-- Project Images with Cover, Gallery, Before, and After tags
-- ==========================================================

-- Clean existing seed data cleanly if present
delete from project_images;
delete from testimonials;
delete from projects;

-- 1. SEED PROJECTS
insert into projects (id, title, slug, category, location, plot_size, built_up_area, duration_months, budget_range, client_name, completion_date, description, status, is_featured, sort_order, lat, lng)
values
(
  'a1b2c3d4-0001-4000-8000-000000000001',
  'The Terracotta Villa',
  'the-terracotta-villa',
  'residential',
  'Anna Nagar, Chennai',
  2400,
  3800,
  14,
  '₹1.5Cr – ₹2.0Cr',
  'Rajesh V.',
  '2025-11-15',
  'A modern contemporary luxury residence incorporating traditional terracotta jali work, passive climate cooling, double-height living room spaces, and an open sky courtyard.',
  'published',
  true,
  1,
  13.0878,
  80.2170
),
(
  'a1b2c3d4-0002-4000-8000-000000000002',
  'Apex IT Innovation Hub',
  'apex-it-innovation-hub',
  'commercial',
  'OMR Tech Corridor, Chennai',
  10000,
  24000,
  18,
  '₹8.0Cr – ₹10.0Cr',
  'Apex Technologies Pvt Ltd',
  '2026-02-10',
  'State-of-the-art commercial office facility with glass facade architecture, solar roof arrays, smart building management system, and collaborative work lounges.',
  'published',
  true,
  2,
  12.9716,
  80.2452
),
(
  'a1b2c3d4-0003-4000-8000-000000000003',
  'Heritage Bungalow Restoration',
  'heritage-bungalow-restoration',
  'renovation',
  'Mylapore, Chennai',
  3200,
  3500,
  8,
  '₹60L – ₹80L',
  'Sundaram Iyer',
  '2025-08-20',
  'Complete structural retrofitting and modern architectural makeover of a 60-year-old traditional home, transforming dark rooms into sun-drenched minimalist spaces while preserving original teak beams.',
  'published',
  true,
  3,
  13.0339,
  80.2696
),
(
  'a1b2c3d4-0004-4000-8000-000000000004',
  'Serene Horizon Duplex',
  'serene-horizon-duplex',
  'residential',
  'ECR, Chennai',
  1800,
  2900,
  11,
  '₹1.1Cr – ₹1.4Cr',
  'Dr. Ananya Ramesh',
  '2025-12-05',
  'Coastal modern residence engineered with sea-breeze resistance, cantilevered balcony views, private plunge pool, and floor-to-ceiling floor glass windows.',
  'published',
  false,
  4,
  12.8920,
  80.2541
),
(
  'a1b2c3d4-0005-4000-8000-000000000005',
  'Verdant Urban Loft',
  'verdant-urban-loft',
  'renovation',
  'Velachery, Chennai',
  1500,
  2200,
  6,
  '₹45L – ₹55L',
  'Karthik & Meera',
  '2026-01-28',
  'Complete interior overhaul converting an outdated 3BHK flat into an industrial chic urban loft with exposed brick walls, custom oak carpentry, and integrated smart lighting.',
  'published',
  false,
  5,
  12.9815,
  80.2180
),
(
  'a1b2c3d4-0006-4000-8000-000000000006',
  'Grand Pavilion Plaza',
  'grand-pavilion-plaza',
  'commercial',
  'Nungambakkam, Chennai',
  8500,
  18000,
  16,
  '₹6.5Cr – ₹7.5Cr',
  'Pavilion Retail Group',
  '2025-10-30',
  'Premium multi-tier luxury retail pavilion featuring expansive glass curtain walls, underground valet parking, and high-efficiency HVAC ducting.',
  'published',
  false,
  6,
  13.0627,
  80.2437
);

-- 2. SEED PROJECT IMAGES (Cover, Gallery, Before, After)
insert into project_images (project_id, image_url, image_type, sort_order)
values
-- Terracotta Villa
('a1b2c3d4-0001-4000-8000-000000000001', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 'cover', 1),
('a1b2c3d4-0001-4000-8000-000000000001', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', 'gallery', 2),
('a1b2c3d4-0001-4000-8000-000000000001', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', 'gallery', 3),

-- Apex IT Innovation Hub
('a1b2c3d4-0002-4000-8000-000000000002', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', 'cover', 1),
('a1b2c3d4-0002-4000-8000-000000000002', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', 'gallery', 2),

-- Heritage Bungalow Restoration (With Before and After Images!)
('a1b2c3d4-0003-4000-8000-000000000003', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', 'cover', 1),
('a1b2c3d4-0003-4000-8000-000000000003', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80', 'before', 2),
('a1b2c3d4-0003-4000-8000-000000000003', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 'after', 3),
('a1b2c3d4-0003-4000-8000-000000000003', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', 'gallery', 4),

-- Serene Horizon Duplex
('a1b2c3d4-0004-4000-8000-000000000004', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80', 'cover', 1),

-- Verdant Urban Loft (With Before/After)
('a1b2c3d4-0005-4000-8000-000000000005', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', 'cover', 1),
('a1b2c3d4-0005-4000-8000-000000000005', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', 'before', 2),
('a1b2c3d4-0005-4000-8000-000000000005', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', 'after', 3),

-- Grand Pavilion Plaza
('a1b2c3d4-0006-4000-8000-000000000006', 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80', 'cover', 1);

-- 3. SEED TESTIMONIALS
insert into testimonials (project_id, client_name, rating, quote, status)
values
(
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Rajesh V.',
  5,
  'SRM Homes turned our dream villa into reality. Their attention to terracotta architectural details and structural precision was world class. Completed right on schedule!',
  'approved'
),
(
  'a1b2c3d4-0003-4000-8000-000000000003',
  'Sundaram Iyer',
  5,
  'Restoring a 60-year ancestral property seemed daunting, but SRM Homes managed the structural reinforcement flawlessly while keeping our heritage essence intact.',
  'approved'
),
(
  'a1b2c3d4-0002-4000-8000-000000000002',
  'Siddharth Menon (Director, Apex Tech)',
  5,
  'Exceptional execution on our commercial IT hub. From green building certifications to safety standards, SRM Homes proved to be the most reliable construction partners in Chennai.',
  'approved'
),
(
  'a1b2c3d4-0004-4000-8000-000000000004',
  'Dr. Ananya Ramesh',
  5,
  'Our coastal duplex was built to survive harsh weather while looking ultra modern. Transparent pricing and constant updates made the construction stress-free.',
  'approved'
),
(
  'a1b2c3d4-0005-4000-8000-000000000005',
  'Karthik & Meera',
  4,
  'The urban loft renovation surpassed our expectations. Their interior design recommendation and execution speed were commendable!',
  'approved'
);
