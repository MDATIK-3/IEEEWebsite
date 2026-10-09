-- =====================================================================
-- Migration 0002 — composite / partial indexes for the public read paths
-- Safe to run multiple times (IF NOT EXISTS). Partial `where is_published`
-- indexes keep the public hot path small as the tables grow.
-- =====================================================================

-- Events: published list ordered by date; + type filter
create index if not exists events_published_order_idx
  on events (starts_at desc) where is_published;
create index if not exists events_type_idx
  on events (event_type) where is_published;

-- Executives: filter by year/committee/group, then ordered
create index if not exists executives_full_idx
  on executives (year desc, committee, member_group, sort_order) where is_published;

-- FAQs: by category, ordered
create index if not exists faqs_category_idx
  on faqs (category, sort_order) where is_published;

-- Ordered content lists
create index if not exists moderator_messages_order_idx
  on moderator_messages (sort_order) where is_published;
create index if not exists spotlights_order_idx
  on spotlights (id) where is_published;
create index if not exists collaborations_order_idx
  on collaborations (id) where is_published;
create index if not exists contact_info_order_idx
  on contact_info (sort_order) where is_published;
create index if not exists achievements_year_idx
  on achievements (year desc) where is_published;
create index if not exists gallery_photos_date_idx
  on gallery_photos (taken_on desc nulls last) where is_published;

-- Admin workflow hot paths
create index if not exists content_submissions_submitter_idx
  on content_submissions (submitted_by, status, submitted_at desc);
create index if not exists notifications_role_idx
  on notifications (recipient_role, is_read, created_at desc);

analyze;
