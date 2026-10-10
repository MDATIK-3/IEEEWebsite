-- =====================================================================
-- Migration 0003 — announcement scheduling fixes
--
-- Why: the news ticker is meant to publish/unpublish on a schedule via
-- `starts_at` / `ends_at`, but `starts_at` was NOT NULL (default now()).
-- The admin form treats "Show from" as optional and sends NULL when empty,
-- which violated the NOT NULL constraint and broke creation. The public RLS
-- policy already handles `starts_at is null` (= "show immediately"), so the
-- column simply needs to allow NULL to match the intended model.
--
-- Idempotent: safe to run more than once.
-- =====================================================================

-- 1) Let "Show from" be optional. NULL = publish immediately (RLS already
--    reads `starts_at is null or starts_at <= now()`).
alter table announcements alter column starts_at drop not null;
alter table announcements alter column starts_at drop default;

-- 2) Track edits for the admin UI / audit trail (other content tables already
--    have this; announcements was missing it).
alter table announcements add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'announcements_updated'
  ) then
    create trigger announcements_updated
      before update on announcements
      for each row execute function set_updated_at();
  end if;
end$$;

-- 3) Index the public read path: active items inside their time window,
--    ordered by priority then start. Replaces the old is_active-only index.
drop index if exists announcements_active_idx;
create index if not exists announcements_schedule_idx
  on announcements (is_active, priority desc, starts_at desc nulls first, ends_at);

-- 4) Re-assert the public visibility policy so the scheduling window is the
--    single source of truth for what anonymous visitors can read.
drop policy if exists announcements_pub on announcements;
create policy announcements_pub on announcements for select
  using (
    is_active
    and (starts_at is null or starts_at <= now())
    and (ends_at   is null or ends_at   >= now())
  );
