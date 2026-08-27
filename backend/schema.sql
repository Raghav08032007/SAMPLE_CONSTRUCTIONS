-- ==========================================================
-- SRM HOMES DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Target Supabase Instance: ketsdmnghrzdjubeibvm
-- ==========================================================

-- Enable pgcrypto for UUID generation if not already enabled
create extension if not exists "pgcrypto";

-- 1. PROJECTS TABLE
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null check (category in ('residential','commercial','renovation')),
  location text,
  plot_size numeric,
  built_up_area numeric,
  duration_months numeric,
  budget_range text,
  client_name text,
  completion_date date,
  description text,
  status text not null default 'draft' check (status in ('draft','published')),
  is_featured boolean default false,
  sort_order integer default 0,
  lat numeric,
  lng numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. PROJECT IMAGES TABLE
create table if not exists project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  image_url text not null,
  image_type text default 'gallery' check (image_type in ('gallery','before','after','cover')),
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Prevent multiple cover images per project at DB level (Edge case 3.5)
create unique index if not exists idx_unique_project_cover on project_images(project_id) where image_type = 'cover';

-- 3. TESTIMONIALS TABLE
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete set null,
  client_name text not null,
  rating integer check (rating between 1 and 5),
  quote text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  submitted_at timestamptz default now()
);

-- 4. LEADS TABLE
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  plot_size numeric,
  budget_range text,
  location text,
  project_type text,
  message text,
  status text not null default 'new' check (status in ('new','contacted','converted')),
  created_at timestamptz default now()
);

-- 5. USER ROLES TABLE
create table if not exists user_roles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  role text not null check (role in ('admin','client')),
  created_at timestamptz default now()
);

-- 6. BLOG POSTS TABLE
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  cover_image text,
  body text,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 7. BRANDS / MATERIALS TABLE
create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  category text,
  created_at timestamptz default now()
);

-- 8. PROJECT UPDATES (CLIENT PORTAL TIMELINE)
create table if not exists project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  description text,
  image_urls text[] default '{}',
  created_at timestamptz default now()
);

-- 9. CLIENT PROJECT ACCESS JOIN TABLE
create table if not exists client_project_access (
  user_id uuid references auth.users(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  primary key (user_id, project_id)
);

-- 10. WARRANTY / SERVICE REQUESTS TABLE
create table if not exists service_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  client_id uuid references auth.users(id) on delete cascade,
  issue_description text not null,
  status text not null default 'open' check (status in ('open','in-progress','resolved')),
  created_at timestamptz default now()
);

-- 11. ANALYTICS / PAGE VIEWS TABLE
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  page_type text not null,
  reference_id text,
  viewed_at timestamptz default now()
);


-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- MANDATORY REQUIREMENT: Enable RLS on EVERY table immediately
-- ==========================================================

alter table projects enable row level security;
alter table project_images enable row level security;
alter table testimonials enable row level security;
alter table leads enable row level security;
alter table user_roles enable row level security;
alter table posts enable row level security;
alter table brands enable row level security;
alter table project_updates enable row level security;
alter table client_project_access enable row level security;
alter table service_requests enable row level security;
alter table page_views enable row level security;

-- Helper function to check if current user has admin role
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from user_roles
    where user_id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;


-- PROJECTS POLICIES
-- Public SELECT: Anonymous & clients can read ONLY published projects
create policy "Public projects select"
  on projects for select
  using (status = 'published' or is_admin());

-- Admin write access
create policy "Admin projects insert" on projects for insert with check (is_admin());
create policy "Admin projects update" on projects for update using (is_admin());
create policy "Admin projects delete" on projects for delete using (is_admin());


-- PROJECT IMAGES POLICIES
-- Public SELECT: Can view images if parent project is published or if user is admin
create policy "Public project_images select"
  on project_images for select
  using (
    exists (
      select 1 from projects
      where projects.id = project_images.project_id
        and (projects.status = 'published' or is_admin())
    )
  );

-- Admin write access
create policy "Admin project_images insert" on project_images for insert with check (is_admin());
create policy "Admin project_images update" on project_images for update using (is_admin());
create policy "Admin project_images delete" on project_images for delete using (is_admin());


-- TESTIMONIALS POLICIES
-- Public SELECT: Can only view approved testimonials
create policy "Public testimonials select"
  on testimonials for select
  using (status = 'approved' or is_admin());

-- Public INSERT: Anyone (even anonymous) can submit a testimonial, but status is forced to 'pending'
create policy "Public testimonials insert"
  on testimonials for insert
  with check (status = 'pending');

-- Admin update/delete access
create policy "Admin testimonials update" on testimonials for update using (is_admin());
create policy "Admin testimonials delete" on testimonials for delete using (is_admin());


-- LEADS POLICIES
-- Public INSERT: Anonymous users can submit quote/contact form leads
create policy "Public leads insert"
  on leads for insert
  with check (true);

-- Admin SELECT/UPDATE/DELETE: Strict privacy - no public read allowed
create policy "Admin leads select" on leads for select using (is_admin());
create policy "Admin leads update" on leads for update using (is_admin());
create policy "Admin leads delete" on leads for delete using (is_admin());


-- USER ROLES POLICIES
create policy "User can view own role" on user_roles for select using (auth.uid() = user_id or is_admin());
create policy "Admin user_roles full access" on user_roles for all using (is_admin());


-- BLOG POSTS POLICIES
create policy "Public posts select" on posts for select using (status = 'published' or is_admin());
create policy "Admin posts full access" on posts for all using (is_admin());


-- BRANDS POLICIES
create policy "Public brands select" on brands for select using (true);
create policy "Admin brands full access" on brands for all using (is_admin());


-- PROJECT UPDATES POLICIES (CLIENT PORTAL)
create policy "Client project_updates select"
  on project_updates for select
  using (
    is_admin() or exists (
      select 1 from client_project_access cpa
      where cpa.project_id = project_updates.project_id
        and cpa.user_id = auth.uid()
    )
  );

create policy "Admin project_updates full access" on project_updates for all using (is_admin());


-- SERVICE REQUESTS POLICIES
create policy "Client service_requests select" on service_requests for select using (client_id = auth.uid() or is_admin());
create policy "Client service_requests insert" on service_requests for insert with check (client_id = auth.uid() or is_admin());
create policy "Admin service_requests update" on service_requests for update using (is_admin());


-- PAGE VIEWS POLICIES
create policy "Public page_views insert" on page_views for insert with check (true);
create policy "Admin page_views select" on page_views for select using (is_admin());
