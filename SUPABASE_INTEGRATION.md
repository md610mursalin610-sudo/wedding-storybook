# Supabase Integration Map and Setup (Project-Specific)

This document shows exactly where the code connects to Supabase in this project and how to create the database tables, Storage bucket, and policies — both with the UI and with SQL.

## 1) Where Supabase is used in the code

- src/lib/supabaseClient.ts
  - Initializes the SDK with environment variables
  - createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

- src/App.tsx
  - Wraps all routes in `AuthGate` so the entire site is private.

- src/auth/AuthGate.tsx
  - Auth session: `supabase.auth.getSession()`, `onAuthStateChange(...)`
  - Google Sign-In: `supabase.auth.signInWithOAuth({ provider: 'google', ... })`
  - Allowlist check via `src/config/allowedEmails.ts`

- src/pages/AccessDenied.tsx
  - Sign out button: `supabase.auth.signOut()`

- src/pages/Index.tsx (Home/Gallery)
  - Loads categories: `supabase.from('categories').select('id, name')`
  - Loads photos: `supabase.from('photos').select('id, storage_path, public_url, caption, category_id, created_at')`
  - Generates signed URLs (private images): `supabase.storage.from('gallery').createSignedUrl(storage_path, 3600)`

- src/pages/Admin.tsx (Admin Panel)
  - Auth session used to gate the page
  - Load categories/photos from DB
  - Upload images to Storage: `supabase.storage.from('gallery').upload(path, file)`
  - Insert photo row: `supabase.from('photos').insert({ storage_path, public_url, caption, category_id })`
  - Update photo row: `supabase.from('photos').update(...).eq('id', ...)`
  - Delete: remove from Storage `supabase.storage.from('gallery').remove([storage_path])`, then delete DB row

- src/config/allowedEmails.ts
  - `ALLOWED_EMAILS`: can view the site
  - `ALLOWED_ADMINS`: can access `/admin`

## 2) Environment variables

- Local: create `.env.local` in project root
  ```env
  VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
  VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
  ```
- Netlify: Site settings → Environment variables → add the same two variables.

## 3) Database schema and RLS (Tables)

You can set up with UI or SQL.

### 3A. UI (no SQL)
- Supabase → Table Editor → New table
- Table: `categories`
  - Columns: `id uuid pk default gen_random_uuid()`, `name text not null unique`, `created_at timestamptz default now()`
  - RLS: ON
- Table: `photos`
  - Columns: `id uuid pk default gen_random_uuid()`
    - `storage_path text not null`
    - `public_url text not null`
    - `caption text`
    - `category_id uuid FK -> categories(id) on delete set null`
    - `created_at timestamptz default now()`
  - RLS: ON
- Policies for both tables
  - SELECT: role = authenticated, Using = `true`
  - ALL (or INSERT/UPDATE/DELETE individually): role = authenticated, Using = `true`, With check = `true`

### 3B. SQL (one-click)
- Supabase → SQL Editor → paste and run the repo file `supabase/app_schema.sql`
  - This creates the tables and policies above.

## 4) Storage bucket and policies (Private images)

Signed URLs are used in the app, so the bucket must be private.

### 4A. UI (recommended and easiest)
- Supabase → Storage → Buckets → New bucket
  - Name: `gallery`
  - Public bucket: OFF (private)
- Open bucket → Policies → Add four policies:
  1) SELECT to authenticated
     - Using: `bucket_id = 'gallery'`
  2) INSERT to authenticated
     - With check: `bucket_id = 'gallery'`
  3) UPDATE to authenticated
     - Using: `bucket_id = 'gallery' AND owner = auth.uid()`
  4) DELETE to authenticated
     - Using: `bucket_id = 'gallery' AND owner = auth.uid()`

### 4B. SQL (requires Service Role)
- Supabase → SQL Editor → set Run as = Service Role/Owner.
- Paste the repo file `supabase/storage_policies.sql` and run.
- If you run as a lower-privileged role, you will see: `must be owner of table objects`.

## 5) Google OAuth

- Supabase → Authentication → Providers → Google
  - Enable provider
  - Paste Client ID and Client Secret from Google Cloud
  - Callback URL (as shown by Supabase):
    - `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`

- Supabase → Authentication → URL configuration
  - Site URL: your production URL (e.g. `https://laboni-adnan-wedding.netlify.app`)
  - Additional Redirect URLs:
    - `https://laboni-adnan-wedding.netlify.app`
    - `http://localhost:5173`

- Google Cloud Console → APIs & Services → Credentials → Your OAuth client (Web)
  - Authorized redirect URIs:
    - `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
  - Authorized JavaScript origins: optional for this flow
  - Save; wait 2–5 minutes to propagate

## 6) Testing and verification

1) Local run
```bash
npm i
npm run dev
```
2) Sign in with Google → must be in `ALLOWED_EMAILS`
3) Visit `/admin` → must be in `ALLOWED_ADMINS`
4) Upload an image → it appears in Recent Photos and on the home gallery
5) Open the signed image URL in an incognito window → should NOT load (private)

## 7) Common errors

- Error: `redirect_uri_mismatch`
  - Fix: Add exact redirect URI to Google OAuth client → `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
  - Ensure the same client ID/secret are configured in Supabase → Google provider.

- Error: `must be owner of table objects`
  - Cause: Trying to create Storage policies with a non-owner role.
  - Fix: Run `supabase/storage_policies.sql` as Service Role/Owner OR create policies via Storage UI.

## 8) Security notes

- The entire site is wrapped by `AuthGate` so no route renders without Google login.
- Only emails in `ALLOWED_EMAILS` can view; `ALLOWED_ADMINS` controls `/admin` access.
- Images are private; app uses short‑lived signed URLs created from `storage_path`.

## 9) File reference summary

- Auth gate: `src/auth/AuthGate.tsx`
- Allowlist: `src/config/allowedEmails.ts`
- Supabase client: `src/lib/supabaseClient.ts`
- Gallery (home): `src/pages/Index.tsx`
- Admin panel: `src/pages/Admin.tsx`
- Access denied page: `src/pages/AccessDenied.tsx`
- Router: `src/App.tsx`
- SQL: `supabase/app_schema.sql`, `supabase/storage_policies.sql`

This is everything needed to set up the database, bucket, and policies and to understand where the code connects to Supabase in this project.
