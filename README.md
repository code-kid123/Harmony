# Harmony Gardens

Luxury property marketplace for Nigerian real estate — apartments, duplexes,
mansions, penthouses, and terraces across Lekki, Ikoyi, Victoria Island, Ikeja
GRA, and Abuja.

Built with Next.js (App Router), React, Tailwind CSS, and optional Supabase.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — serve the production build
- `npm run lint` — ESLint

## Environment Variables

All variables are optional and the site runs with zero configuration. To enable
lead/request persistence beyond the browser, set up Supabase and add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Copy `.env.example` to `.env.local` for local development. Never commit real
keys.

## Deploy to Netlify

The repo includes `netlify.toml`, `.node-version`, and `@netlify/plugin-nextjs`
for a zero-config deployment:

1. Push this folder to a Git repository (GitHub, GitLab, or Bitbucket).
2. In Netlify: **Add new site → Import an existing project**, and pick the repo.
3. Netlify auto-detects the build (detected from `netlify.toml`).
4. Optionally add the Supabase environment variables under
   **Site settings → Environment variables**, then trigger a rebuild.

Manual CLI alternative:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

> The site uses unoptimized images and an optional Supabase connection, so it
> needs no serverless functions or image CDN configuration to deploy.