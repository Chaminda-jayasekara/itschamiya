-- =========================================================
-- Chaminda Jayasekara — Portfolio Site
-- Supabase schema: tables + Row Level Security policies
--
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- Model: single admin user (you) writes everything via the
-- authenticated Supabase session; the public site only ever
-- reads rows marked as published/live.
-- =========================================================

-- ---------- CLIENTS ----------
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  created_at timestamptz not null default now()
);

-- ---------- PROJECTS ----------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  category text,
  client_id uuid references clients(id) on delete set null,
  completed_date date,
  duration text,               -- e.g. "3 weeks", "2 months"
  live_link text,
  is_live boolean not null default false,   -- draft vs published
  featured boolean not null default false,  -- show on homepage top-3
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- PROJECT IMAGES ----------
create table if not exists project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  url text not null,
  is_cover boolean not null default false,
  sort_order int not null default 0
);

-- ---------- CLIENT REVIEWS ----------
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  client_name text not null,
  quote text not null,
  rating int check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

-- ---------- EXPERIENCE ----------
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  start_date date not null,
  end_date date,              -- null = "Present"
  description text,
  sort_order int not null default 0
);

-- ---------- EDUCATION ----------
create table if not exists education (
  id uuid primary key default gen_random_uuid(),
  institute text not null,
  qualification text,
  start_date date not null,
  end_date date,              -- null = "Ongoing"
  details text,
  sort_order int not null default 0
);

-- ---------- PROFILE (singleton) ----------
create table if not exists profile (
  id int primary key default 1 check (id = 1),  -- enforce single row
  bio text,
  photo_url text,             -- hero / about-page photo
  skills text[] default '{}',
  cv_url text,
  contact_email text,
  contact_phone text,
  social_links jsonb default '{}',  -- { "github": "...", "linkedin": "...", ... }
  updated_at timestamptz not null default now()
);
insert into profile (id) values (1) on conflict (id) do nothing;

-- If you already ran this schema before photo_url existed, just run:
-- alter table profile add column if not exists photo_url text;

-- =========================================================
-- ROW LEVEL SECURITY
-- Public (anon) can only READ published/live data.
-- Authenticated (you, via Supabase Auth) can read/write everything.
-- =========================================================

alter table clients enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table reviews enable row level security;
alter table experience enable row level security;
alter table education enable row level security;
alter table profile enable row level security;

-- Clients: public can read (needed to show logos/names on live projects)
create policy "public read clients" on clients for select using (true);
create policy "admin write clients" on clients for all using (auth.role() = 'authenticated');

-- Projects: public can read only is_live = true; admin sees/edits everything
create policy "public read live projects" on projects for select using (is_live = true);
create policy "admin read all projects" on projects for select using (auth.role() = 'authenticated');
create policy "admin write projects" on projects for insert with check (auth.role() = 'authenticated');
create policy "admin update projects" on projects for update using (auth.role() = 'authenticated');
create policy "admin delete projects" on projects for delete using (auth.role() = 'authenticated');

-- Project images: readable if the parent project is live, or if you're the admin
create policy "public read images of live projects" on project_images for select
  using (exists (select 1 from projects p where p.id = project_id and p.is_live = true));
create policy "admin read all images" on project_images for select using (auth.role() = 'authenticated');
create policy "admin write images" on project_images for all using (auth.role() = 'authenticated');

-- Reviews: same pattern as images
create policy "public read reviews of live projects" on reviews for select
  using (exists (select 1 from projects p where p.id = project_id and p.is_live = true));
create policy "admin read all reviews" on reviews for select using (auth.role() = 'authenticated');
create policy "admin write reviews" on reviews for all using (auth.role() = 'authenticated');

-- Experience / education / profile: public read, admin write
create policy "public read experience" on experience for select using (true);
create policy "admin write experience" on experience for all using (auth.role() = 'authenticated');

create policy "public read education" on education for select using (true);
create policy "admin write education" on education for all using (auth.role() = 'authenticated');

create policy "public read profile" on profile for select using (true);
create policy "admin write profile" on profile for update using (auth.role() = 'authenticated');

-- ---------- STORAGE ----------
-- Create these buckets in Supabase Storage (dashboard or SQL):
--   project-images  (public)
--   cv               (public)
-- Then add matching storage policies allowing authenticated uploads
-- and public reads, e.g.:
--
-- insert into storage.buckets (id, name, public) values ('project-images','project-images', true);
-- create policy "public read project-images" on storage.objects for select using (bucket_id = 'project-images');
-- create policy "admin upload project-images" on storage.objects for insert
--   with check (bucket_id = 'project-images' and auth.role() = 'authenticated');
