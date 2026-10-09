# IEEE GUB Website — Full Upgrade Plan

**Scope:** performance ("full speed"), dead‑code/dependency cleanup, and a Supabase backend with an admin panel (role‑based upload + approval workflow), scheduled event posts, notifications, a DB‑driven news ticker, and a feedback/messages system.

**Status:** Planning → Implementation
**Date:** 2026‑10‑09
**Supersedes:** `SUPABASE_BACKEND_PLAN.md` (April 2026 draft — kept for reference only; this document is the source of truth).

> **Important clarification — "MySQL":** The request asked for "Supabase for backend (MySQL)". Supabase's database is **PostgreSQL**, not MySQL. This is the same relational model and fully satisfies the "SQL data store" intent — it just uses Postgres features (RLS, JSONB, `pg_cron`, Storage, Auth) that MySQL lacks and that this plan relies on. **We proceed on PostgreSQL via Supabase.** If a literal MySQL server is a hard requirement, Supabase is not the tool and this plan would need to change.

---

## Table of Contents
1. [Current State (from deep analysis)](#1-current-state)
2. [Part A — Cleanup: remove unused](#part-a--cleanup-remove-unused)
3. [Part B — Performance: full speed](#part-b--performance-full-speed)
4. [Part C — Supabase backend](#part-c--supabase-backend)
5. [Part D — Admin panel (upload + approval)](#part-d--admin-panel)
6. [Part E — New features](#part-e--new-features)
7. [Part F — Phased roadmap](#part-f--phased-roadmap)
8. [Open decisions](#open-decisions)
9. [Environment variables](#environment-variables)
10. [Risks & rollback](#risks--rollback)

---

## 1. Current State

**Stack:** Next.js 15.3.8 (App Router), React 19, Tailwind CSS 4, `next-themes` (class‑based dark mode), Vercel Analytics. Path alias `@/* → src/*`. **No database, no auth, no middleware, no admin.**

**Content:** 17 static JSON files in `src/data/` drive the entire site. 4 API routes:
- `api/chat` — Gemini chatbot (`@google/generative-ai`); reads **every** JSON in `src/data/` on each request to build its knowledge base.
- `api/contact` — contact form → email via `nodemailer`. **Not persisted.**
- `api/partnership` — partnership form (CSRF‑protected) → rich email. **Not persisted.**
- `api/contributors` — GitHub contributors API, merged with `ContributionRoles.json`.

**Key problems found:**
- **Caching fully disabled site‑wide** — `layout.jsx` forces `dynamic='force-dynamic'`, `revalidate=0`, `fetchCache='force-no-store'`.
- **Images set to never cache** — `next.config.ts` sends `max-age=0, must-revalidate`.
- **Almost no lazy‑loading** — only 1 dynamic import in the codebase; ~59% of components (71/121) are `"use client"`.
- **Large JSON shipped to the browser** — `executiveData.json` (43.5 KB) and `eventData.json` (23.4 KB) are imported into client components.
- **16 unused/redundant dependencies**, **6 dead source files**, and a large set of unreferenced images.
- **3 live 404s** — the navbar "Community" menu links to `/Projects`, `/Opportunities`, `/Resources`, **none of which exist**. Their data (`projects.json`, `opportunities.json`) is orphaned (only the chatbot reads it); there is no `resources` data at all.
- **Security smell** — the GitHub token is `NEXT_PUBLIC_GITHUB_TOKEN` (exposed to the client bundle).
- Not a git repository yet.

---

## Part A — Cleanup: remove unused

### A.1 Remove unused dependencies (16)
Verified imported **nowhere** in `src/`:

| Remove | Note |
|---|---|
| `@headlessui/react` | no imports |
| `@heroicons/react` | no imports (icons come from `lucide-react` + `react-icons`) |
| `@react-three/drei` | no imports |
| `@react-three/postprocessing` | no imports |
| `classnames` | custom `src/app/utils/cx.js` is used instead |
| `clsx` | same — custom `cx()` used |
| `daisyui` | **never registered** (no `tailwind.config`, no `@plugin "daisyui"`) → inert |
| `gsap` | no imports (only `framer-motion` is used) |
| `langchain` | no imports (chat uses only `@google/generative-ai`) — **large** |
| `ogl` | no imports |
| `react-force-graph` | no imports |
| `react-force-graph-3d` | no imports |
| `react-hot-toast` | custom context‑based `ToastProvider.jsx` is used instead |
| `react-intersection-observer` | `framer-motion`'s `useInView` is used instead |
| `react-router-dom` | only referenced by dead `main.jsx` (remove that file first) |
| `@swc/core` | **INVESTIGATE** — Next 15 bundles `@next/swc`; remove then `npm run build` to confirm |

**Keep:** `@google/generative-ai`, `@react-three/fiber`, `three` (both used only on `/contact/developer`), `@vercel/analytics`, `critters` (required by `experimental.optimizeCss`), `date-fns`, `date-fns-tz`, `framer-motion`, `fuse.js`, `lucide-react`, `next`, `next-themes`, `nodemailer`, `react`, `react-dom`, `react-icons`, `react-markdown`, `sanitize-html`.

### A.2 Delete dead source files (6)
1. `src/app/components/main.jsx` — Vite/CRA leftover (`createRoot`, imports non‑existent `./Routes/Routers`); sole user of `react-router-dom`.
2. `src/app/components/Events/EventsContainer.jsx` — never imported.
3. `src/app/Executives/components/index.ts` — barrel imported by nobody.
4. `src/app/Executives/components/ErrorDisplay.jsx` — only referenced by the dead barrel.
5. `src/app/utils/metadata.js` — duplicate of the inline metadata in `layout.jsx`.
6. `src/app/contact/GeneralContact/FormInput.jsx` — superseded by `./Components/FormInput.jsx`.

> Keep `Executives/components/types.ts` (used by `MemberDetailModal.tsx`) and `Theme/ThemeProvider.jsx` (used by `layout.jsx`).

### A.3 Fix the 404 navbar links
The "Community" dropdown points to `/Projects`, `/Opportunities`, `/Resources` which 404.
**Chosen approach:** remove the three broken links now (correctness), and re‑introduce them later as DB‑backed pages in Part E (`projects.json`/`opportunities.json` schemas are good; `resources` becomes a new content type). See [Open decisions](#open-decisions).

### A.4 Other cleanup
- `globals.css`: remove CRA leftovers — `#root { max-width:1280px; … }` and `.logo` spin animations.
- `tsconfig.json`: the `include` array lists several non‑existent paths (e.g. `HomePage/Banner/animated-background.jsx`, `details/[id]/page.jsx`, `partnership/Components/...`). Trim to real paths.
- `README.md`: update to reflect real features (remove Projects/Opportunities/Resources claims until shipped; correct DaisyUI mention).

### A.5 Unused images (~82 candidates; verify before deleting)
`public/images` has ~156 files; only ~74 unique `/images/...` paths are referenced, and there is **no dynamic path construction**, so a static diff is reliable.
1. Referenced set: scan `src/**` (jsx/tsx/ts/js + `src/data/*.json` + `globals.css`) for `/images/[A-Za-z0-9_./-]+`; also whitelist `favicon/` + `site.webmanifest` icons.
2. Actual set: list `public/images/**`.
3. Diff → unused candidates. **Move to a temp folder and rebuild before permanent deletion.** (Executed late, after DB image migration decisions, since some may move to Supabase Storage.)

---

## Part B — Performance: full speed

Ordered by impact. Items 1–4 are quick, high‑impact, and reversible.

### Quick wins
1. **Fix image cache header** — `next.config.ts`: change `public, max-age=0, must-revalidate` → `public, max-age=31536000, immutable` for hashed/static assets (or `max-age=86400, stale-while-revalidate=604800` if assets can change in place). Eliminates per‑navigation image revalidation.
2. **Remove site‑wide dynamic rendering** — delete `dynamic/revalidate/fetchCache` from `layout.jsx`. Let pages be static; add `export const revalidate = 3600` (or per‑route values) where ISR is wanted. Biggest TTFB/LCP win. (Verified: nothing in the layout needs per‑request rendering today — all data is static.)
3. **Lazy‑load the Three.js backgrounds** on `/contact/developer` — wrap `ThreeBackground` + `Particles` in `next/dynamic(..., { ssr:false })`; consider dropping one of the two WebGL canvases. Removes ~500 KB+ of `three` from that route's critical path.
4. **Delete dead code + deps** (Part A.1/A.2) — smaller install, faster CI, no accidental future bundling.

### High impact
5. **Server‑render the homepage events section** — `HomePage/events/page.jsx` is `"use client"` but has no state/effects; it imports the full 23.4 KB `eventData.json` just to `filter().slice(0,6)`. Make it a server component and pass only the 6 computed events into the client grid. (After the DB migration this becomes a cached server query.)
6. **Move `executiveData.json` (43.5 KB) off the client** — `Executives/page.jsx` is `"use client"` and imports the whole file; Fuse.js filtering runs client‑side. Split into a server component (data source) + a smaller client child that owns search/filter state.
7. **Code‑split below‑the‑fold homepage sections** — `HomePage/page.jsx` eagerly renders 8 sections. Keep Hero eager (LCP); `next/dynamic` the below‑the‑fold client sections (ModeratorMessages, Spotlights, Gallery, FAQ).

### Medium / ongoing
8. Centralize `eventData` access (imported into 4 client components) behind one server loader; pass trimmed props.
9. Convert trivially‑client components back to server (e.g. `HeroSection/RadialBackground.jsx` is pure markup with `"use client"`). Sweep the 71 client files.
10. Lazy‑load gallery data (`useGalleryData.js` imports `photos.json` into a client hook).
11. (Optional) Reduce `framer-motion` footprint on routes using only simple fades (CSS keyframes already exist).
12. Run `npm run analyze` after items 2–7 to quantify remaining chunks.

> After the DB migration, "data off the client" is achieved naturally: pages become server components that query Supabase with Next caching (`revalidate`), so no large JSON is bundled at all.

---

## Part C — Supabase backend

### C.1 Setup & libraries
- Create a Supabase project (PostgreSQL + Auth + Storage). Enable Row Level Security on every table.
- Use **`@supabase/ssr`** (the current, supported SSR helper) — **not** the deprecated `@supabase/auth-helpers-nextjs` from the old draft.
  ```bash
  npm install @supabase/supabase-js @supabase/ssr
  ```
- Clients:
  - `src/lib/supabase/client.ts` — browser client (anon key).
  - `src/lib/supabase/server.ts` — server client (cookies, anon key) for Server Components / Route Handlers.
  - `src/lib/supabase/admin.ts` — **service‑role** client, server‑only, used exclusively inside guarded admin server actions (approvals, applying submissions). Never imported into client code.

### C.2 Roles & auth
- Supabase Auth (email + password; magic‑link optional). **Public sign‑up disabled.** Superadmin invites data‑entry users from the admin panel.
- `admin_profiles` table (one row per auth user):
  ```sql
  CREATE TYPE admin_role AS ENUM ('superadmin', 'data_entry');
  CREATE TABLE admin_profiles (
    id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name  TEXT,
    role       admin_role NOT NULL DEFAULT 'data_entry',
    is_active  BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  ```
- First superadmin seeded via SQL. A helper `is_superadmin()` / `current_role()` SQL function backs RLS policies.
- `middleware.ts` protects `/admin/*`: no session → redirect to `/admin/login`; session but `is_active=false` → blocked.

### C.3 Approval workflow (the core requirement)

**Roles**
- **Data entry:** may **create** and **edit** content, and **cannot delete**. Everything they submit is **pending** until a superadmin acts.
- **Superadmin:** may **approve / deny / modify** any submitted item, and is the only role that can **delete**.

**Model — a single moderation queue (`content_submissions`)**
All data‑entry creates/edits go into one queue instead of touching live tables. Live/public tables therefore always contain only approved data, public reads stay trivial, and "no delete for data entry" is automatic (they never touch live tables).

```sql
CREATE TYPE submission_action AS ENUM ('create', 'update');     -- delete is superadmin-only, direct
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE content_submissions (
  id            BIGSERIAL PRIMARY KEY,
  target_table  TEXT NOT NULL,              -- e.g. 'events'
  target_id     BIGINT,                     -- null for 'create'
  action        submission_action NOT NULL,
  proposed_data JSONB NOT NULL,             -- the full row the submitter wants
  status        submission_status NOT NULL DEFAULT 'pending',
  submitted_by  UUID NOT NULL REFERENCES admin_profiles(id),
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_by   UUID REFERENCES admin_profiles(id),
  reviewed_at   TIMESTAMPTZ,
  review_note   TEXT
);
```

**Flow**
1. Data‑entry user fills an admin form (incl. image upload) → a row is inserted into `content_submissions` (`status='pending'`). They can edit their own row while it is still `pending`.
2. Superadmin sees pending items in the review queue → **Approve**, **Deny** (with note), or **Modify** (edit `proposed_data`, then approve).
3. **Approve** runs a guarded Next.js **server action** (verifies caller is superadmin) using the **service‑role** client to apply `proposed_data` to the live `target_table` (insert for `create`, update for `update`), mark the submission `approved`, write an `audit_log` row, and create a `notification` for the submitter.
4. **Deny** sets `rejected` + `review_note` + notifies the submitter.
5. **Delete** (superadmin only) acts directly on the live table via a server action + audit log.

*(Alternative considered: a `status` column on every content table with an approved‑snapshot. Rejected as primary because edits to already‑live rows complicate public reads. The queue keeps public tables pristine and is fully auditable.)*

```sql
CREATE TABLE audit_log (
  id         BIGSERIAL PRIMARY KEY,
  actor_id   UUID REFERENCES admin_profiles(id),
  action     TEXT NOT NULL,         -- 'approve' | 'reject' | 'delete' | 'login' ...
  entity     TEXT, entity_id BIGINT,
  detail     JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### C.4 Content schema (mapped from the 17 JSON files)

Every **content** table carries standard columns: `id BIGSERIAL PK`, `created_at`, `updated_at`, and (where public visibility applies) `is_published BOOLEAN DEFAULT true`. Approval state lives in `content_submissions`; once applied, rows in these tables are considered live.

| Table | Source JSON | Notes / tricky bits |
|---|---|---|
| `events` | `eventData.json` (9) | scalars + `publish_at TIMESTAMPTZ` (scheduling). Nested → **JSONB**: `speakers`, `resources`, `highlights`; `gallery` → `text[]`. Normalize `date/time/startTime/endTime/timezone` → `starts_at/ends_at TIMESTAMPTZ` + `timezone`. `registration_link` external URL. |
| `executives` | `executiveData.json` (~95 people) | **Flatten** year→committee→group→person into rows: `year INT, committee TEXT (SB/CS/MAIN/PES), member_group TEXT (faculty/student), name, role, img, facebook, linkedin, email`. Hardest migration. |
| `achievements` | `acievement.json` (6) | fix table spelling; `year INT`, `image`. |
| `collaborations` | `collaboration.json` (10) | **dedupe** on import. |
| `contact_info` | `contactInfo.json` (4) | `icon` = lucide icon name (text). |
| `faqs` | `FAQ.json` (5) + `membership.json.faqs` | add `category` ('general' / 'membership'). |
| `moderator_messages` | `moderatorsMessages.json` (4) | "messages from each person" — per‑person leadership messages. |
| `spotlights` | `spotlights.json` (3) | `socials` → JSONB. |
| `gallery_photos` | `photos.json` (40) | image, date, name. |
| `membership_info` | `membership.json` (singleton) | one row; `benefits/steps/fees/faqs` → JSONB. |
| `contributors` | `ContributionRoles.json` (3) | merged with GitHub API in `api/contributors`; fold in the near‑duplicate `developerData.json` (has a dup id — reconcile). |
| `projects` | `projects.json` (4) | `tags/team` → `text[]`, `links` → JSONB. (Currently orphaned.) |
| `opportunities` | `opportunities.json` (4) | `skills` → `text[]`, `status` enum. (Currently orphaned.) |
| `organization_types` | `CollaborationForm/organizationTypes.json` (8) | lookup (value,label) for the partnership form. |
| `partnership_types` | `CollaborationForm/partnershipTypes.json` (10) | lookup (value,label). |

Dropped: `developerData.json` (merge into `contributors`), `registered.json` (fake sample; replaced by real `event_registrations` only if we build native registration — see Open decisions).

### C.5 System / feature tables (new)
```sql
-- News ticker (Part E.1)
CREATE TABLE announcements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT,
  link_url TEXT, link_label TEXT,
  variant TEXT DEFAULT 'info',          -- info | event | alert
  priority INT DEFAULT 0,
  starts_at TIMESTAMPTZ DEFAULT now(),
  ends_at   TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- In-app notifications (Part E.3)
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  recipient_id UUID REFERENCES admin_profiles(id),  -- null = broadcast to a role
  recipient_role admin_role,
  type TEXT NOT NULL,                   -- 'submission' | 'decision' | 'scheduled' ...
  title TEXT NOT NULL, body TEXT, link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Persisted inbound messages (Part E.4) — currently email-only
CREATE TABLE contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT, email TEXT, subject TEXT, message TEXT,
  status TEXT DEFAULT 'new',            -- new | read | resolved
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE partnership_submissions ( id BIGSERIAL PRIMARY KEY, data JSONB, status TEXT DEFAULT 'new', created_at TIMESTAMPTZ DEFAULT now() );
CREATE TABLE feedback ( id BIGSERIAL PRIMARY KEY, name TEXT, email TEXT, rating INT, message TEXT, page TEXT, status TEXT DEFAULT 'new', created_at TIMESTAMPTZ DEFAULT now() );
```

### C.6 RLS (representative policies)
```sql
-- Public read of live content (example: events; scheduled-aware)
CREATE POLICY events_public_read ON events FOR SELECT
  USING (is_published = true AND (publish_at IS NULL OR publish_at <= now()));

-- No public writes to content tables. Writes happen via service-role server actions only.

-- Moderation queue
CREATE POLICY subs_insert_self ON content_submissions FOR INSERT
  WITH CHECK (submitted_by = auth.uid());                 -- data_entry + superadmin
CREATE POLICY subs_update_own_pending ON content_submissions FOR UPDATE
  USING (submitted_by = auth.uid() AND status = 'pending');
CREATE POLICY subs_read ON content_submissions FOR SELECT
  USING (submitted_by = auth.uid() OR is_superadmin());
CREATE POLICY subs_superadmin_all ON content_submissions FOR UPDATE
  USING (is_superadmin());
-- No DELETE policy for data_entry anywhere.

-- Inbound forms: allow anonymous INSERT, admin-only SELECT
CREATE POLICY contact_insert_anon ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY contact_admin_read ON contact_submissions FOR SELECT USING (is_superadmin() OR current_role() = 'data_entry');

-- Notifications: recipients read/update their own
CREATE POLICY notif_own ON notifications FOR SELECT
  USING (recipient_id = auth.uid() OR recipient_role = current_role());
```

### C.7 Storage (uploads)
- Buckets: `events`, `executives`, `gallery`, `misc`. Public read; authenticated write.
- Admin upload component pushes to Storage, stores the returned public URL in `proposed_data`. On approve, the URL is written to the live row. `next.config.ts` `images.remotePatterns` gains the Supabase Storage hostname.

### C.8 Data migration
- `scripts/migrate.ts` (run with service role, once): read each JSON, transform (flatten executives, dedupe collaborations, JSONB for nested), insert into live tables as already‑approved. Keep original JSON in `src/data/_archive/` until verified.

### C.9 Rewire the chatbot
`api/chat` currently reads all JSON off disk. Rewrite `buildKnowledgeBase()` to query Supabase (cached) so the bot keeps its data after migration.

### C.10 Fix GitHub token exposure
Rename `NEXT_PUBLIC_GITHUB_TOKEN` → server‑only `GITHUB_TOKEN`; `api/contributors` already runs server‑side.

---

## Part D — Admin panel

Route group `src/app/(admin)/admin/*`, protected by `middleware.ts`, built with Tailwind + existing `cx()` (no DaisyUI). Dark‑mode aware via existing `next-themes`.

```
admin/
  login/                      # Supabase auth
  layout.jsx                  # sidebar + role-gated nav + notification bell
  page.jsx                    # dashboard: counts, pending queue, recent activity
  submissions/                # SUPERADMIN: review queue (approve/deny/modify)
  events/        [new | id/edit]   # + schedule (publish_at) + image upload
  executives/    [new | id/edit]
  achievements/  collaborations/  faqs/  spotlights/  gallery/
  moderator-messages/
  announcements/              # news ticker items
  projects/      opportunities/   membership/
  messages/                   # contact + partnership + feedback inboxes
  users/                      # SUPERADMIN: invite/activate data-entry accounts
  settings/
```
**Shared components:** `DataTable` (sort/filter/paginate), `EntityForm` (schema‑driven create/edit → writes to `content_submissions`), `ImageUploader` (Supabase Storage), `ReviewQueue`, `StatusBadge`, `ScheduleField`, `NotificationBell` (realtime).

**Role gating:** data‑entry sees create/edit (submit → pending) and their own submission status; delete, the review queue, user management, and settings are superadmin‑only (enforced in UI **and** RLS/server actions).

---

## Part E — New features

### E.1 News ticker (between navbar & hero, DB‑driven)
- `<NewsTicker />` renders a slim single‑line bar **directly under the fixed 56 px navbar**, above page content (so on the homepage it sits between navbar and hero). Implemented by combining NavBar + ticker into one sticky header wrapper (cleaner than two separate `fixed` layers) and adjusting the existing top offset.
- Content: **upcoming events** (title + date, "proper title") **+ active `announcements`**, ordered by `priority`/date. Query filters `is_active`, `now()` within `starts_at..ends_at`, events `publish_at <= now()`.
- Single‑line marquee: CSS animation, pause on hover, honors `prefers-reduced-motion`, dismissible per session (`localStorage`, wrapped in try/catch). Dark‑mode aware.
- Data via a cached Route Handler (`/api/ticker`, `revalidate=60`) or a server component; optional Supabase realtime refresh.

### E.2 Scheduled event posts
- `events.publish_at`. Public queries show an event only when approved **and** `publish_at <= now()` — so "schedule" = set a future `publish_at`; no cron needed for visibility.
- For publish‑time side effects (auto‑announcement + notification), a **Vercel Cron** hits `/api/cron/publish` (guarded by `CRON_SECRET`) every ~15 min; or Supabase `pg_cron`. Recommend Vercel Cron.

### E.3 Notifications
- **In‑app:** `notifications` table + realtime `NotificationBell` in the admin shell. Triggers: new submission → notify superadmins; approve/deny → notify submitter; scheduled event goes live → notify admins.
- **Email:** reuse `nodemailer` for high‑value events (new submission to superadmin; decision to submitter).
- **Public:** the news ticker is the public‑facing notification channel.
- Web push: future (out of scope v1).

### E.4 Messages & feedback
- **Persist existing forms:** `api/contact` and `api/partnership` keep emailing **and** now insert into `contact_submissions` / `partnership_submissions`. Admin "Messages" inbox lists them with new/read/resolved status.
- **Feedback system (emails):** new `/feedback` form + `/api/feedback` route → insert into `feedback` **and** email (reuse the sanitize + nodemailer pattern). Visible in the admin inbox.
- **Messages from each person:** `moderator_messages` becomes DB‑driven and editable in admin (homepage section reads from DB).

### E.5 Profiles from DB
`executives` table powers the Executives directory (server component + small client filter). Admin CRUD via the approval workflow.

### E.6 Re‑introduce Projects / Opportunities / Resources (optional, see decisions)
Build DB‑backed pages for the currently‑404 routes, then restore the navbar links.

---

## Part F — Phased roadmap

**Phase 0 — Cleanup & perf quick wins** *(safe, reversible; start here)*
Remove dead files (A.2) → remove unused deps in groups with build checks (A.1) → fix image cache header + remove force‑dynamic (B.1, B.2) → lazy‑load dev‑page 3D (B.3) → fix 404 nav links (A.3) → CRA/css/tsconfig cleanup (A.4). Build + smoke‑test after each group.

**Phase 1 — Perf deepening**
Server‑render events/executives, code‑split homepage (B.5–B.10). `npm run analyze` to confirm.

**Phase 2 — Supabase foundation**
Project + schema + RLS + clients + `admin_profiles` + auth + `middleware.ts` + seed superadmin.

**Phase 3 — Admin panel + approval workflow**
`content_submissions` queue, review UI, `EntityForm`, `ImageUploader`, server actions (approve/deny/modify/delete), audit log.

**Phase 4 — Migrate content to DB**
Migration script; switch public pages to cached Supabase queries; rewire chatbot; fix GitHub token.

**Phase 5 — Feature layer**
News ticker, scheduling + cron, notifications, feedback form, persisted messages inbox, moderator messages from DB.

**Phase 6 — Polish**
Projects/Opportunities/Resources pages, unused‑image purge, README/docs, final bundle analysis.

---

## Part G — SEO (best-practice technical SEO)

> No code can *guarantee* a #1 Google ranking (that depends on content, backlinks, and competition). This maximizes ranking **potential** through technical SEO + Core Web Vitals.

**Done (foundation):**
- Root metadata: `metadataBase`, title template (`%s | IEEE SB GUB`), richer description/keywords, `alternates.canonical`, Open Graph + Twitter `summary_large_image` using a real image (was a 96×96 favicon), granular `robots` (`max-image-preview:large`, `max-snippet:-1`).
- `app/robots.ts` → robots.txt (disallows `/admin`, `/api`, and the accidental `/HomePage` & `/components` routes); links the sitemap.
- `app/sitemap.ts` → sitemap.xml for all canonical routes + every event detail page.
- JSON-LD: Organization + WebSite in the root layout.
- Viewport: removed `maximum-scale=1 / user-scalable=no` (Lighthouse accessibility + mobile-friendliness).
- Core Web Vitals: static prerendering, image caching, and JSON-off-the-client (Parts A/B) are direct ranking signals.

**Follow-ups:**
- **Accidental routes:** `page.jsx` is used as a component filename inside non-route folders, so `/HomePage`, `/HomePage/About`, `/components/Shares/NavBar`, etc. are real, indexable routes with thin/duplicate content. Proper fix: rename those component files out of the route tree (e.g. `View.jsx`) and update imports — robots `disallow` is only a stopgap.
- **Per-route metadata:** unique `metadata`/`generateMetadata` (title, description, canonical) for every public route — via a server `layout` where the page itself is a client component.
- **Rich results:** Event JSON-LD on event detail pages (needs the same server/client split) and FAQPage JSON-LD on the FAQ section.
- Generated branded OG image (`opengraph-image.tsx` via `next/og`) at 1200×630.
- Post-launch: submit sitemap in Google Search Console; track Core Web Vitals in PageSpeed Insights.

---

## Open decisions

*Resolved 2026‑10‑09:*
- ✅ **Git** — initialize a repo and commit a baseline before cleanup. **Decided: yes.**
- ✅ **Starting point** — **Decided: Phase 0 (cleanup + perf quick wins) first.**
- ✅ **404 routes** — **Decided: remove permanently.** Delete the `/Projects`, `/Opportunities`, `/Resources` navbar links and their orphaned `projects.json` / `opportunities.json`; these sections will **not** be rebuilt. (Part E.6 dropped; Part F Phase 6 "Projects/Opportunities/Resources pages" removed.)

*Assumed defaults (say the word to change):*
1. **Postgres** replaces literal MySQL (Supabase = Postgres). Required by this plan.
2. **Confirm removals** — dropping `daisyui` (inert) + the other 15 deps and 6 dead files. Proceeding.
3. **Notification channels** — in‑app + email for v1 (web push later).
4. **Event registration** — keep external Google Forms for now (native `event_registrations` deferred, not in current scope).

---

## Environment variables

**Existing (keep):** `GEMINI_API_KEY`, `GEMINI_MODEL`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_TO`.
**Change:** `NEXT_PUBLIC_GITHUB_TOKEN` → `GITHUB_TOKEN` (server‑only).
**New:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server‑only, never client), `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`.

---

## Risks & rollback
- **No git yet** — initialize + commit a baseline before Part A so every removal is reversible.
- **Dep removals** — grouped with `npm run build` after each; `@swc/core` is the only "investigate" item.
- **Removing `force-dynamic`** — verify no page needs per‑request data (none found); fully reversible.
- **RLS/approval** — test each role path (data‑entry create/edit, no‑delete, superadmin approve/deny/modify) before go‑live.
- **Image purge & JSON archival** — move‑and‑rebuild, don't hard‑delete, until verified.
- **Chatbot** must be repointed to the DB in the same phase as migration, or it loses its data.
```
