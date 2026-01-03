# Wedding Storybook — Setup Guide

This guide explains how to run the project in two ways:

- Option A: Demo mode (no database/auth) — simplest, public site
- Option B: Full private site (Supabase + Google OAuth + private Storage)

Pick one option and follow it end to end.

---

## Option A — Demo mode (no database, no auth)
Run the site with static demo photos only.

1) Remove the Google auth gate
- Edit `src/App.tsx` and replace the wrapper so routes are not inside `AuthGate`.
  - Before (simplified):
    ```tsx
    <BrowserRouter>
      <AuthGate>
        <Routes> ... </Routes>
      </AuthGate>
    </BrowserRouter>
    ```
  - After:
    ```tsx
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    ```
  - You can also remove the `/admin` route in demo mode.

2) Force the gallery to use static photos
- Edit `src/pages/Index.tsx`:
  - Remove the `supabase` import and the `useEffect` that loads from Supabase.
  - Change the photos source to:
    ```tsx
    const photos = weddingPhotos;
    ```

3) Start the app
- Install deps and run:
  ```bash
  npm i
  npm run dev
  ```
- Open the URL shown by Vite.

You now have a public demo without any database.

---

## Option B — Full private site (Supabase + Google OAuth)
This uses Supabase for auth, database, and private storage.

### 1) Create a Supabase project
- Get the Project URL and anon key from Settings → API.

### 2) Environment variables
- Create `.env.local` in project root with:
  ```bash
  VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
  VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
  ```
- Netlify → Site settings → Environment variables → add the same two vars.

### 3) Database schema & RLS
- Supabase Dashboard → SQL Editor → run the file `supabase/app_schema.sql` (paste contents).
  - Creates `categories` and `photos` tables.
  - Enables RLS and allows authenticated users to read/write.

### 4) Storage bucket (private) + policies
You have two ways:

A) UI (no SQL)
- Storage → Buckets → New bucket
  - Name: `gallery`
  - Public bucket: OFF (private)
- Open bucket → Policies → Add:
  - SELECT to `authenticated`: using `bucket_id = 'gallery'`
  - INSERT to `authenticated`: with check `bucket_id = 'gallery'`
  - UPDATE to `authenticated`: using `bucket_id = 'gallery' AND owner = auth.uid()`
  - DELETE to `authenticated`: using `bucket_id = 'gallery' AND owner = auth.uid()`

B) SQL (requires Service Role)
- Supabase → SQL Editor → set Run as = Service Role/Owner.
- Run contents of `supabase/storage_policies.sql`.
- If you run as a lower-privileged role, you’ll see: `must be owner of table objects`.

### 5) Enable Google OAuth in Supabase
- Supabase → Authentication → Providers → Google
  - Enable
  - Paste Google Client ID & Client Secret (from Google Cloud → Credentials → OAuth client ID for Web).
  - Callback URL (shown by Supabase): `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`

### 6) URL configuration in Supabase
- Authentication → URL configuration
  - Site URL: your production URL, e.g. `https://laboni-adnan-wedding.netlify.app`
  - Additional Redirect URLs:
    - `https://laboni-adnan-wedding.netlify.app`
    - `http://localhost:5173`

### 7) Configure Google Cloud OAuth client
- Google Cloud Console → APIs & Services → Credentials → your OAuth client (Web)
  - Authorized redirect URIs: add
    - `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
  - Authorized JavaScript origins: optional; for this flow you can skip it.
  - Save and wait 2–5 minutes for propagation.

### 8) Allowlist family emails
- Edit `src/config/allowedEmails.ts`:
  - `ALLOWED_EMAILS`: who can view the site
  - `ALLOWED_ADMINS`: who can access `/admin` (can equal the full list or a subset)

### 9) Run locally
```bash
npm i
npm run dev
```
- You’ll be prompted to sign in with Google.
- If your email is in the allowlist, you can view the site; if in admins, you can access `/admin`.

### 10) Deploy to Netlify
- Connect the repo and deploy with the two env vars.
- Set the production URL in Supabase URL configuration as above.

---

## Troubleshooting

- redirect_uri_mismatch (Google)
  - The redirect URI must be exactly: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback` and present in Google Cloud OAuth client.
  - Also make sure Supabase → Providers → Google uses the same client.

- must be owner of table objects (Storage SQL)
  - You tried to run storage policies as a non-owner. Run `storage_policies.sql` as Service Role/Owner OR use the Storage UI.

- Images not loading
  - Ensure the bucket is private and policies added.
  - App generates signed URLs from `storage_path` — confirm `photos.storage_path` is filled and points to the `gallery` bucket.

- Admin page access denied
  - Add your Gmail into `ALLOWED_ADMINS`.

---

## Where things live
- Auth gate: `src/auth/AuthGate.tsx`
- Allowlist: `src/config/allowedEmails.ts`
- Admin page: `src/pages/Admin.tsx`
- Gallery page: `src/pages/Index.tsx`
- SQL: `supabase/app_schema.sql`, `supabase/storage_policies.sql`

---

If you want server-side allowlisting in Supabase (policies check `auth.email()`), I can provide an extra SQL file on request.
