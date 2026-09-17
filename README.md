# Chaminda Jayasekara — Portfolio Site

Next.js (App Router) + Supabase, matching the wireframes and data model discussed.

## Structure
- `src/app/` — public pages: Home, About, Portfolio, Project detail (`[slug]`), Contact
- `src/app/admin/` — auth-gated admin panel (login + Projects CRUD scaffolded; Experience/Education/Clients/Settings pages follow the same pattern)
- `src/lib/supabase/` — browser + server Supabase clients
- `src/proxy.ts` — session refresh + redirects unauthenticated visitors away from `/admin`
- `src/types/index.ts` — TypeScript types mirroring the DB schema
- `supabase/schema.sql` — full schema + Row Level Security policies (public reads only `is_live` data; you, once authenticated, can read/write everything)

## Setup
1. Create a Supabase project.
2. In the SQL editor, run `supabase/schema.sql`.
3. In Storage, create two public buckets: `project-images` and `cv` (policy SQL is commented at the bottom of `schema.sql`).
4. In Authentication → Users, create your one admin user (this is what you'll log in with at `/admin/login`).
5. Copy `.env.local.example` to `.env.local` and fill in your Supabase URL + anon key (Settings → API).
6. `npm install`
7. `npm run dev` — visit `http://localhost:3000` (public site) and `http://localhost:3000/admin` (admin, will redirect to login).

## Still to build
- Experience / Education / Clients / Settings admin pages (same CRUD pattern as `admin/projects`)
- Image upload wired to Supabase Storage on the project form
- Real filter dropdowns on `/portfolio` (currently static labels; the query already supports `?category=` and `?company=`)
- Contact form → real email delivery or a `messages` table
