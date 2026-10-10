-- =====================================================================
-- Migration 0004 — achievements manual ordering
--
-- Why: the admin Achievements panel needs a stable, admin-controlled order
-- (like `executives.sort_order`). The table previously had no such column, so
-- both the public page and the admin list could only fall back to year.
--
-- Model: `sort_order` is the PRIMARY sort, `year desc` the tiebreak. Every row
-- starts at 0, so until an admin assigns orders the list stays grouped exactly
-- as before (newest year first). Lower sort_order shows first.
--
-- Idempotent: safe to run more than once.
-- =====================================================================

-- 1) Add the column (defaults to 0 so existing rows keep today's behaviour).
alter table achievements add column if not exists sort_order int not null default 0;

-- 2) Index the ordering the public read path and admin list use.
create index if not exists achievements_order_idx
  on achievements (sort_order asc, year desc nulls last);
