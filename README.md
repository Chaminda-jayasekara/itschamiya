# Chaminda Jayasekara — Portfolio Site

Next.js (App Router) + Supabase, matching the wireframes and data model discussed.

## Structure
- `src/app/` — public pages: Home, About, Portfolio, Project detail (`[slug]`), Contact
- `src/app/admin/` — auth-gated admin panel: login, Projects, Experience, Education, Clients, and Settings (profile/bio/skills/CV/contact/socials) — all full CRUD against Supabase
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

## Adding images via Google Drive links

Every image field in the admin (profile photo, project images, client logos) is
a plain URL — paste a link and it renders. **A normal Google Drive "share" link
will NOT work** (`https://drive.google.com/file/d/FILE_ID/view?usp=sharing`) —
that opens Drive's HTML viewer page, not the raw image, so it'll just show a
broken image icon.

To get a link that actually renders:
1. In Drive, right-click the file → **Share** → set access to **"Anyone with the link"**.
2. Copy the file ID out of the share link (the long string between `/d/` and `/view`).
3. Use this format instead:
   ```
   https://drive.google.com/uc?export=view&id=FILE_ID
   ```
   If that ever stops rendering (Google tightens hotlinking restrictions from
   time to time), try:
   ```
   https://lh3.googleusercontent.com/d/FILE_ID
   ```

Where to paste these:
- **Settings → Profile photo URL** — used on the Home hero and About page
- **Projects → Image URLs** — one link per line in the textarea; the first line becomes the cover image shown on cards
- **Clients → Logo URL** — shown on the homepage "Companies I've worked with" row

For anything beyond a handful of images, a dedicated image host (Supabase
Storage, Cloudinary, imgix) will be more reliable than Drive long-term — Drive
wasn't built to serve images at scale and links occasionally get rate-limited.

## Still to build
- Real filter dropdowns on `/portfolio` (currently static labels; the query already supports `?category=` and `?company=`)
- Contact form → real email delivery or a `messages` table
- Reviews have no admin UI yet — insert them directly in the Supabase table editor for now
