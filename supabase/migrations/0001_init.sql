-- =====================================================================
-- IEEE GUB Website — initial schema, roles, approval workflow, RLS
-- Migration 0001  |  Target: Supabase (PostgreSQL)
--
-- Run this in the Supabase SQL editor (or `supabase db push`).
-- Model summary:
--   * Public/live content lives in the content tables below and is the ONLY
--     thing anonymous visitors can read (via RLS SELECT policies).
--   * Data-entry users never write content tables directly. They submit
--     creates/edits into `content_submissions` (status='pending'). They can
--     never delete. A superadmin approves/denies/modifies; on approval a
--     server action (service-role) applies the change to the live table.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------
create type admin_role        as enum ('superadmin', 'data_entry');
create type submission_action as enum ('create', 'update');
create type submission_status as enum ('pending', 'approved', 'rejected');

-- ---------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Admin accounts (extend auth.users)
-- ---------------------------------------------------------------------
create table admin_profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  role       admin_role not null default 'data_entry',
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- Role helpers for RLS (SECURITY DEFINER so they can read admin_profiles)
create or replace function current_admin_role()
returns admin_role language sql stable security definer set search_path = public as $$
  select role from admin_profiles where id = auth.uid() and is_active;
$$;

create or replace function is_superadmin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from admin_profiles
                 where id = auth.uid() and role = 'superadmin' and is_active);
$$;

create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from admin_profiles where id = auth.uid() and is_active);
$$;

-- =====================================================================
-- CONTENT TABLES (live/approved data; public-readable)
-- =====================================================================

-- Events (+ scheduling via publish_at) ---------------------------------
create table events (
  id                 bigserial primary key,
  title              text not null,
  description        text,
  event_type         text,
  organizer          text,
  starts_at          timestamptz,
  ends_at            timestamptz,
  timezone           text default 'Asia/Dhaka',
  location_label     text,
  event_area         text,
  participant        int,
  image_url          text,
  registration_link  text,
  guest              text,
  guest_bio          text,
  special_guest      text,
  special_guest_bio  text,
  speakers           jsonb not null default '[]'::jsonb,   -- [{name,designation,image}]
  resources          jsonb not null default '[]'::jsonb,   -- [{label,url,type}]
  highlights         jsonb not null default '[]'::jsonb,   -- [text]
  gallery            text[] not null default '{}',         -- [image urls]
  is_published       boolean not null default true,
  publish_at         timestamptz,                          -- null = immediate; future = scheduled
  created_by         uuid references admin_profiles(id),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index events_visible_idx on events (is_published, publish_at, starts_at desc);
create trigger events_updated before update on events for each row execute function set_updated_at();

-- Executives (flattened year -> committee -> group -> person) ----------
create table executives (
  id            bigserial primary key,
  year          int not null,
  committee     text not null,          -- SB | CS | MAIN | PES
  member_group  text not null,          -- faculty | student
  name          text not null,
  role          text,
  img           text,
  facebook      text,
  linkedin      text,
  email         text,
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index executives_year_committee_idx on executives (year, committee, member_group);
create trigger executives_updated before update on executives for each row execute function set_updated_at();

-- Achievements ---------------------------------------------------------
create table achievements (
  id bigserial primary key,
  year int,
  program_name text not null,
  details text,
  image text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger achievements_updated before update on achievements for each row execute function set_updated_at();

-- Collaborations -------------------------------------------------------
create table collaborations (
  id bigserial primary key,
  name text not null,
  organization text,
  image text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger collaborations_updated before update on collaborations for each row execute function set_updated_at();

-- FAQs (category distinguishes general vs membership) ------------------
create table faqs (
  id bigserial primary key,
  category text not null default 'general',   -- general | membership
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger faqs_updated before update on faqs for each row execute function set_updated_at();

-- Moderator / leadership messages ("messages from each person") --------
create table moderator_messages (
  id bigserial primary key,
  name text not null,
  title text,
  image text,
  message text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger moderator_messages_updated before update on moderator_messages for each row execute function set_updated_at();

-- Member spotlights ----------------------------------------------------
create table spotlights (
  id bigserial primary key,
  name text not null,
  role text,
  quote text,
  photo text,
  socials jsonb not null default '{}'::jsonb,   -- {facebook,linkedin,github}
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger spotlights_updated before update on spotlights for each row execute function set_updated_at();

-- Gallery photos -------------------------------------------------------
create table gallery_photos (
  id bigserial primary key,
  image text not null,
  name text,
  taken_on date,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger gallery_photos_updated before update on gallery_photos for each row execute function set_updated_at();

-- Contributors (merged with GitHub API at request time) ----------------
create table contributors (
  id bigserial primary key,
  login text unique,                -- GitHub username (join key)
  name text,
  developer_type text,
  batch text,
  facebook text,
  linkedin text,
  github text,
  email text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger contributors_updated before update on contributors for each row execute function set_updated_at();

-- Partnership-form lookups --------------------------------------------
create table organization_types (
  id bigserial primary key, value text not null unique, label text not null, sort_order int not null default 0
);
create table partnership_types (
  id bigserial primary key, value text not null unique, label text not null, sort_order int not null default 0
);

-- Contact info cards ---------------------------------------------------
create table contact_info (
  id bigserial primary key,
  icon text,                 -- lucide icon name
  title text not null,
  primary_value text,
  sort_order int not null default 0,
  is_published boolean not null default true
);

-- Membership info (singleton row id=1; JSONB blobs) --------------------
create table membership_info (
  id int primary key default 1,
  join_link text,
  local_contact_link text,
  benefits jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  fees jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint membership_singleton check (id = 1)
);
create trigger membership_info_updated before update on membership_info for each row execute function set_updated_at();

-- =====================================================================
-- APPROVAL WORKFLOW + SYSTEM TABLES
-- =====================================================================

-- Moderation queue: all data-entry creates/edits land here as 'pending'.
create table content_submissions (
  id            bigserial primary key,
  target_table  text not null,                 -- e.g. 'events'
  target_id     bigint,                        -- null for 'create'
  action        submission_action not null,
  proposed_data jsonb not null,                -- full row the submitter wants
  status        submission_status not null default 'pending',
  submitted_by  uuid not null references admin_profiles(id),
  submitted_at  timestamptz not null default now(),
  reviewed_by   uuid references admin_profiles(id),
  reviewed_at   timestamptz,
  review_note   text
);
create index content_submissions_status_idx on content_submissions (status, submitted_at desc);

-- Audit trail of privileged actions
create table audit_log (
  id bigserial primary key,
  actor_id uuid references admin_profiles(id),
  action text not null,                         -- approve|reject|delete|login|...
  entity text,
  entity_id bigint,
  detail jsonb,
  created_at timestamptz not null default now()
);

-- In-app notifications (admin bell + realtime)
create table notifications (
  id bigserial primary key,
  recipient_id uuid references admin_profiles(id),   -- null => broadcast to a role
  recipient_role admin_role,
  type text not null,                                -- submission|decision|scheduled|...
  title text not null,
  body text,
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_recipient_idx on notifications (recipient_id, is_read, created_at desc);

-- News ticker items (public, time-windowed)
create table announcements (
  id bigserial primary key,
  title text not null,
  body text,
  link_url text,
  link_label text,
  variant text not null default 'info',   -- info | event | alert
  priority int not null default 0,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  is_active boolean not null default true,
  created_by uuid references admin_profiles(id),
  created_at timestamptz not null default now()
);
create index announcements_active_idx on announcements (is_active, priority desc, starts_at desc);

-- Persisted inbound messages (previously email-only) -------------------
create table contact_submissions (
  id bigserial primary key,
  name text, email text, subject text, message text,
  status text not null default 'new',       -- new | read | resolved
  created_at timestamptz not null default now()
);
create table partnership_submissions (
  id bigserial primary key,
  data jsonb not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
create table feedback (
  id bigserial primary key,
  name text, email text, rating int, message text, page text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table admin_profiles        enable row level security;
alter table events                enable row level security;
alter table executives            enable row level security;
alter table achievements          enable row level security;
alter table collaborations        enable row level security;
alter table faqs                  enable row level security;
alter table moderator_messages    enable row level security;
alter table spotlights            enable row level security;
alter table gallery_photos        enable row level security;
alter table contributors          enable row level security;
alter table organization_types    enable row level security;
alter table partnership_types     enable row level security;
alter table contact_info          enable row level security;
alter table membership_info       enable row level security;
alter table content_submissions   enable row level security;
alter table audit_log             enable row level security;
alter table notifications         enable row level security;
alter table announcements         enable row level security;
alter table contact_submissions   enable row level security;
alter table partnership_submissions enable row level security;
alter table feedback              enable row level security;

-- Admin profiles: self-read; superadmin reads all (writes via service role)
create policy admin_profiles_self   on admin_profiles for select using (id = auth.uid());
create policy admin_profiles_super  on admin_profiles for select using (is_superadmin());

-- Public content reads (writes happen only through the service-role client)
create policy events_public     on events            for select using (is_published and (publish_at is null or publish_at <= now()));
create policy execs_public      on executives        for select using (is_published);
create policy achievements_pub  on achievements      for select using (is_published);
create policy collaborations_pub on collaborations   for select using (is_published);
create policy faqs_pub          on faqs              for select using (is_published);
create policy modmsg_pub        on moderator_messages for select using (is_published);
create policy spotlights_pub    on spotlights        for select using (is_published);
create policy gallery_pub       on gallery_photos    for select using (is_published);
create policy contributors_pub  on contributors      for select using (true);
create policy orgtypes_pub      on organization_types for select using (true);
create policy ptypes_pub        on partnership_types for select using (true);
create policy contactinfo_pub   on contact_info      for select using (is_published);
create policy membership_pub    on membership_info   for select using (true);
create policy announcements_pub on announcements     for select
  using (is_active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at >= now()));

-- Moderation queue: submit, edit-own-pending, read-own, superadmin all. NO delete policy.
create policy subs_insert_self        on content_submissions for insert with check (submitted_by = auth.uid() and is_admin());
create policy subs_update_own_pending on content_submissions for update
  using (submitted_by = auth.uid() and status = 'pending')
  with check (submitted_by = auth.uid() and status = 'pending');
create policy subs_update_super       on content_submissions for update using (is_superadmin());
create policy subs_select             on content_submissions for select using (submitted_by = auth.uid() or is_superadmin());

-- Audit log: superadmin read only (inserts via service role)
create policy audit_read_super on audit_log for select using (is_superadmin());

-- Notifications: recipients read & mark-read their own
create policy notif_select on notifications for select
  using (recipient_id = auth.uid() or recipient_role = current_admin_role());
create policy notif_update on notifications for update
  using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());

-- Inbound forms: anyone may submit; only admins may read
create policy contact_insert on contact_submissions for insert with check (true);
create policy contact_read   on contact_submissions for select using (is_admin());
create policy partner_insert on partnership_submissions for insert with check (true);
create policy partner_read   on partnership_submissions for select using (is_admin());
create policy feedback_insert on feedback for insert with check (true);
create policy feedback_read   on feedback for select using (is_admin());

-- =====================================================================
-- PRIVILEGES (RLS still governs which rows are visible/writable)
-- =====================================================================
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update on content_submissions to authenticated;
grant update on notifications to authenticated;
grant insert on contact_submissions, partnership_submissions, feedback to anon, authenticated;
grant usage, select on all sequences in schema public to authenticated, anon;

-- =====================================================================
-- SEED: promote the first user to superadmin AFTER they sign up in Auth.
--   1) Create the user in Supabase Auth (Dashboard > Authentication > Users).
--   2) Replace the UUID below with that user's id and run:
-- insert into admin_profiles (id, full_name, role)
--   values ('00000000-0000-0000-0000-000000000000', 'Site Owner', 'superadmin')
--   on conflict (id) do update set role = 'superadmin', is_active = true;
-- =====================================================================
