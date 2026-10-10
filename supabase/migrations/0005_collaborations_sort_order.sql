-- =====================================================================
-- Migration 0005 — collaborations manual ordering
--
-- Why: the public collaborations strip and the admin list could only order by
-- `id` (insertion order), so partner logos couldn't be reordered. This adds an
-- admin-controlled `sort_order` (like `contact_info` / `achievements`).
--
-- Model: `sort_order` is the PRIMARY sort, `id asc` the tiebreak. Every row
-- starts at 0, so until an admin assigns orders the list stays in insertion
-- order exactly as before. Lower sort_order shows first.
--
-- Note: 0002 already created `collaborations_order_idx on (id) where
-- is_published`; this adds a separate `collaborations_sort_idx` for the new
-- ordering rather than reusing that name (a different definition under the same
-- name would be skipped by `if not exists`).
--
-- Idempotent: safe to run more than once.
-- =====================================================================

-- 1) Add the column (defaults to 0 so existing rows keep today's behaviour).
alter table collaborations add column if not exists sort_order int not null default 0;

-- 2) Index the ordering the public read path and admin list use.
create index if not exists collaborations_sort_idx
  on collaborations (sort_order asc, id asc) where is_published;
