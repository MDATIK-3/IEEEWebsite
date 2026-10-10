# IEEE Green University of Bangladesh — Official Website

The official website of the **IEEE Student Branch at Green University of Bangladesh (IEEE GUB)**. It showcases events, achievements, leadership, gallery, and membership opportunities, and is powered by a full content-management backend with a role-based admin panel, an approval workflow, scheduled publishing, and a live news ticker.

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-20232a?logo=react&logoColor=61dafb">
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth%20%2B%20Storage-3ecf8e?logo=supabase&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white">
  <img alt="Deploy" src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white">
</p>

🔗 **Live:** https://ieeegub.vercel.app

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Security Model](#security-model)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [NPM & Utility Scripts](#npm--utility-scripts)
- [Admin Panel](#admin-panel)
- [Deployment](#deployment)
- [Secrets & Safety](#secrets--safety)
- [Contributing](#contributing)
- [License & Contact](#license--contact)

---

## Overview

This is a production [Next.js](https://nextjs.org) (App Router) application backed by [Supabase](https://supabase.com) (PostgreSQL + Auth + Storage). Public pages are statically cached and read published content through Row Level Security; all content is managed through an authenticated admin panel rather than by editing files.

**What makes it production-grade:**

- 🗄️ **Supabase backend** — relational schema with Row Level Security (RLS) enforced on every table.
- 👥 **Role-based admin** — `superadmin` and `data_entry` roles with different privileges.
- ✅ **Approval workflow** — data-entry edits are queued as submissions and applied to live tables only after a superadmin approves them.
- ⏱️ **Scheduled publishing** — events can be queued with a `publish_at` time and go live automatically.
- 📰 **Live news ticker** — time-windowed, admin-managed announcements.
- 🖼️ **Media pipeline** — admin drag-and-drop uploads to Supabase Storage, served through `next/image`.
- ⚡ **Edge-cached reads** — tagged caching (`unstable_cache` + `revalidateTag`) for fast, instantly-refreshable pages.
- 🔔 **Audit log & notifications** — privileged actions are recorded; admins get in-app notifications.

---

## Features

### Public Site

| Area | Highlights |
|------|-----------|
| **Homepage** | Animated 3D hero, about, moderator messages, member spotlights, featured events, gallery preview, collaborations, FAQ |
| **Events** | Search + filters (all / upcoming / past), list & calendar views, countdown, add-to-calendar, detailed pages with speakers, highlights, gallery, and resources |
| **Executives** | Directory by year and committee (Student Branch, Computer Society, Power & Energy Society) with detail modals |
| **Gallery** | Masonry/grid views, pagination, lightbox, search & category filtering |
| **Achievements** | Program achievements with images and details |
| **Collaborations** | IEEE partner/society showcase |
| **Join IEEE** | Global sign-up guidance + IEEE GUB onboarding, benefits, steps, and fees |
| **Learn IEEE** | Informational content about IEEE |
| **Contact** | General contact form, partnership inquiry form, developer/contributors page (merged with the GitHub API) |
| **Chatbot** | AI assistant powered by Google Gemini |
| **News ticker** | Site-wide announcements bar (priority-ordered, time-windowed) |

Built-in SEO: `sitemap.ts`, `robots.ts`, `manifest.json`, light/dark theming, and Vercel Analytics.

### Admin Panel (`/admin`)

- **Dashboard** with pending-submission and activity overview.
- **Content management** for events, executives, achievements, collaborations, FAQs, moderator messages, spotlights, gallery, contact info, and membership.
- **Submissions queue** — review, approve, reject, or modify pending changes.
- **Announcements** — manage the public news ticker.
- **Messages** — view persisted contact, partnership, and feedback submissions.
- **User management** (superadmin) — create admins and assign roles.
- **Image uploader** — drag-and-drop / file-select straight to Supabase Storage.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router, Server Components, Server Actions), React 19 |
| **Language** | JavaScript + TypeScript 5 |
| **Backend** | Supabase — PostgreSQL, Auth, Storage, Row Level Security |
| **Styling** | Tailwind CSS 4, `next-themes` (light/dark) |
| **Animation / 3D** | Framer Motion, three.js, `@react-three/fiber` |
| **AI** | `@google/generative-ai` (Gemini) |
| **Email** | Nodemailer (contact & partnership delivery) |
| **Search** | Fuse.js (fuzzy client-side search) |
| **Content rendering** | `react-markdown` + `sanitize-html` |
| **Icons** | `lucide-react`, `react-icons` |
| **Dates** | `date-fns`, `date-fns-tz` |
| **Analytics** | `@vercel/analytics` |
| **Perf** | `@next/bundle-analyzer`, `critters` (critical-CSS inlining), AVIF/WebP image optimization |

---

## Architecture

```
                 ┌──────────────────────────────────────────────┐
  Anonymous      │                  Next.js App                  │
  visitors  ───▶ │  Public pages (Server Components, cached)     │
                 │     └─ queries.ts → supabasePublic (anon key) │──┐
                 │                                               │  │ RLS: published
  Admins    ───▶ │  /admin/* (guarded by middleware)            │  │ + scheduled only
                 │     ├─ Server Components → server.ts (session)│  │
                 │     └─ Server Actions   → admin.ts (service)  │──┤
                 └──────────────────────────────────────────────┘  │
                                                                    ▼
                               ┌───────────────────────────────────────────┐
                               │  Supabase: PostgreSQL + Auth + Storage      │
                               │  Row Level Security on every table          │
                               └───────────────────────────────────────────┘
```

**Four Supabase clients, each with a clear boundary** (`src/lib/supabase/`):

| Client | File | Key | Used in | Governed by |
|--------|------|-----|---------|-------------|
| Public | `public.ts` | anon | Cached public reads (`queries.ts`) | RLS (published content) |
| Server | `server.ts` | anon + user session | Server Components / Actions as the signed-in admin | RLS (as that user) |
| Browser | `client.ts` | anon | Client components | RLS |
| Admin | `admin.ts` | **service role** | Server Actions only, after an auth check | **Bypasses RLS** |

- **Reads** go through `src/lib/queries.ts`: one cached round-trip per entity, with derived views (upcoming / latest / by-id) computed in memory. Each getter is wrapped in `unstable_cache` and tagged, so admin writes call `revalidateTag(...)` to refresh pages instantly.
- **Writes** happen in Server Actions (`src/app/admin/_actions/`). Data-entry writes create a `content_submissions` row (`status = 'pending'`); a superadmin approval applies the change to the live table via the service-role client. Superadmin edits apply immediately.
- **Scheduled publishing**: a row with a future `publish_at` is hidden by the RLS policy until that time passes — no cron job required for visibility.
- **Images**: the admin uploader stores files in the Supabase Storage `media` bucket and saves the public URL; `next.config.ts` whitelists `*.supabase.co` for `next/image`.

---

## Security Model

- **Row Level Security** is enabled on every table. Anonymous visitors can only `select` published (and time-eligible) content; inbound forms are insert-only; the moderation queue has **no delete policy**.
- **Service-role isolation**: `admin.ts` imports `server-only`, so the build fails if the service-role client is ever pulled into a client bundle. It is used only inside Server Actions, and only after verifying the caller is an authorized admin.
- **Route protection**: `src/middleware.ts` guards `/admin/*`, refreshes the Supabase session cookie, and redirects unauthenticated users to the login page. It no-ops gracefully until Supabase env vars are set, so the public site runs before the backend is provisioned.
- **Role helpers in Postgres** (`is_admin()`, `is_superadmin()`, `current_admin_role()`) are `security definer` and back the RLS policies.
- **Audit trail**: privileged actions (approve / reject / delete / login …) are recorded in `audit_log`.
- **Input hardening**: user-supplied HTML/markdown is sanitized with `sanitize-html`; the partnership form uses CSRF protection.

---

## Project Structure

```
.
├── public/                     # Static assets (favicons, manifest, kept images)
├── scripts/                    # One-off setup & migration scripts (Node, service role)
│   ├── push-schema.mjs         # Apply SQL schema to the DB
│   ├── setup-admin.mjs         # Create superadmin + 'media' storage bucket
│   ├── migrate-data.mjs        # (legacy) seed tables from old JSON
│   ├── migrate-images.mjs      # (legacy) upload local images to Storage
│   └── check-db.mjs            # Connectivity + table/row-count check
├── supabase/
│   └── migrations/             # 0001_init.sql … 0005_*.sql (schema, RLS, indexes)
└── src/
    ├── middleware.ts           # Admin-area auth guard
    ├── app/
    │   ├── (public pages)      # HomePage, Activities, Executives, Gallery, Join, …
    │   ├── admin/              # Admin panel
    │   │   ├── _actions/       # Server Actions (content, announcements, users, upload, messages)
    │   │   ├── _components/     # Shared admin UI (sidebar, image uploader, …)
    │   │   ├── submissions/    # Approval queue
    │   │   ├── users/          # Superadmin user management
    │   │   └── <entity>/       # events, executives, achievements, gallery, faqs, …
    │   ├── api/                # Route handlers: chat, contact, partnership, contributors, …
    │   ├── components/         # Shared public components (NavBar, Footer, ticker, chatbot, …)
    │   ├── hooks/ · utils/ · Theme/
    │   ├── sitemap.ts · robots.ts · layout.jsx · not-found.jsx
    │   └── globals.css
    ├── data/                   # Static lookups still used (registered.json, ContributionRoles.json)
    └── lib/
        ├── queries.ts          # Cached public data access
        └── supabase/           # public · server · client · admin · auth
```

---

## Database Schema

Defined in [`supabase/migrations/`](supabase/migrations). Migration `0001_init.sql` creates the schema, roles, approval workflow, and all RLS policies; later migrations add indexes, announcement scheduling, and sort-order columns.

**Content tables (public-readable):**
`events`, `executives`, `achievements`, `collaborations`, `faqs`, `moderator_messages`, `spotlights`, `gallery_photos`, `contributors`, `organization_types`, `partnership_types`, `contact_info`, `membership_info`

**Workflow & system tables:**
`admin_profiles` (roles), `content_submissions` (moderation queue), `audit_log`, `notifications`, `announcements` (news ticker), `contact_submissions`, `partnership_submissions`, `feedback`

Roles are a Postgres enum: `admin_role = { superadmin, data_entry }`.

---

## Getting Started

### Prerequisites

- **Node.js 18.18+** (Node 20 LTS recommended)
- **npm**
- A **Supabase** project (free tier is fine) — [create one](https://supabase.com/dashboard)

### 1. Clone & install

```bash
git clone https://github.com/MDATIK-3/IEEEWebsite
cd IEEEWebsite
npm install
```

### 2. Configure environment

Copy the template and fill in your values (see [Environment Variables](#environment-variables)):

```bash
cp .env.example .env.local
```

> `.env.local` is gitignored — **never commit real secrets**.

### 3. Set up Supabase

1. **Create the schema.** In the Supabase dashboard open the **SQL editor** and run the files in [`supabase/migrations/`](supabase/migrations) in order (`0001` → `0005`).
   Alternatively, with `DB_PASSWORD` set in `.env.local`:
   ```bash
   node scripts/push-schema.mjs
   ```
2. **Create the superadmin + storage bucket:**
   ```bash
   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-strong-password' node scripts/setup-admin.mjs
   ```
   This creates the auth user, marks it `superadmin` in `admin_profiles`, and creates the public `media` Storage bucket used for uploads.
3. **Verify connectivity:**
   ```bash
   node scripts/check-db.mjs
   ```

### 4. Run

```bash
npm run dev
```

Open **http://localhost:3000** for the site and **http://localhost:3000/admin** for the admin panel.

---

## Environment Variables

All variables live in `.env.local`. A documented template is in [`.env.example`](.env.example).

| Variable | Required | Description |
|----------|:---:|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public anon key (client-safe; RLS enforced) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | **Server-only.** Bypasses RLS; used only in guarded admin Server Actions. Never expose to the client |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical site URL (used for SEO/sitemap) |
| `GEMINI_API_KEY` | ⬜ | Google Gemini key for the chatbot (chatbot returns a config error if missing) |
| `GEMINI_MODEL` | ⬜ | Gemini model, e.g. `gemini-2.5-flash` |
| `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_SECURE` | ⬜ | SMTP transport for contact & partnership email |
| `EMAIL_USER` / `EMAIL_PASSWORD` / `EMAIL_TO` | ⬜ | SMTP credentials and destination inbox |
| `GITHUB_TOKEN` | ⬜ | Server-only GitHub token; enriches the contributors page with commit counts |
| `CRON_SECRET` | ⬜ | Shared secret reserved for a scheduled-publish endpoint |
| `DB_PASSWORD` | ⬜ | Direct Postgres password — only needed to run `scripts/push-schema.mjs` |
| `SUPABASE_S3_*` | ⬜ | Optional S3-protocol Storage credentials (admin uploads use the Storage API by default) |

> ✅ = required for the app to run • ⬜ = optional / feature-specific. Features whose variables are missing degrade gracefully rather than crashing the site.

---

## NPM & Utility Scripts

**App scripts** (`package.json`):

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run analyze` | Build with the bundle analyzer (`ANALYZE=true`) |

**Utility scripts** (run with `node scripts/<file>`; they read `.env.local` and use the service role):

| Script | Purpose |
|--------|---------|
| `push-schema.mjs` | Apply `supabase/migrations/0001_init.sql` over a direct DB connection |
| `setup-admin.mjs` | Create the superadmin user and the `media` Storage bucket |
| `check-db.mjs` | Print which tables exist and their row counts (no secrets printed) |
| `migrate-data.mjs` | *(legacy, one-off)* seed tables from the old `src/data` JSON |
| `migrate-images.mjs` | *(legacy, one-off)* upload local `public/images` to Storage and rewrite DB URLs |

---

## Admin Panel

| Role | Can do |
|------|--------|
| **`data_entry`** | Create and edit content → submitted to the approval queue as `pending`. Cannot delete, cannot publish directly. |
| **`superadmin`** | Approve / reject / modify submissions, edit content directly (applies immediately), manage announcements, read inbound messages, and manage admin users. |

**Content flow:** `data_entry` submits → `content_submissions (pending)` → superadmin reviews in **Submissions** → on approval, a Server Action applies it to the live table with the service-role client and the change is logged in `audit_log`.

---

## Deployment

Optimized for **[Vercel](https://vercel.com)**:

1. Import the repository into Vercel.
2. Add every required [environment variable](#environment-variables) in **Project → Settings → Environment Variables** (keep `SUPABASE_SERVICE_ROLE_KEY` and other secrets server-side only).
3. Deploy — Vercel runs `npm run build` automatically.

Point `NEXT_PUBLIC_SITE_URL` at the production domain so SEO metadata and the sitemap are correct. Any host that supports Next.js 15 Server Actions and Node 18.18+ will also work.

---

## Secrets & Safety

- `.env.local` and all `.env*` files (except `.env.example`) are gitignored — **no real secrets are committed**.
- The service-role key is server-only and `admin.ts` is guarded by `server-only`.
- Build artifacts (`.next/`, `*.tsbuildinfo`), `node_modules/`, and migration artifacts are gitignored.
- Before pushing, confirm nothing sensitive is staged: `git status` and `git diff --cached`.

---

## Contributing

1. Fork and branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and verify the build:
   ```bash
   npm run build
   ```
3. Commit with a clear message and open a pull request.

Please keep content changes in the admin panel/database rather than hard-coding them, and never commit secrets.

---

## License & Contact

Maintained by the **IEEE Student Branch, Green University of Bangladesh**.

- 🌐 Website: https://ieeegub.vercel.app
- 📘 Facebook: https://www.facebook.com/ieeesbgub/
- ✉️ Inquiries: use the contact form on the site

### Acknowledgments

- Green University of Bangladesh
- IEEE Organization
- The Executive Committee and all contributors
