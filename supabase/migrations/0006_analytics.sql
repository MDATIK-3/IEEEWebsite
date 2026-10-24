-- =====================================================================
-- IEEE GUB Website — self-hosted visitor analytics
-- Migration 0006  |  Target: Supabase (PostgreSQL)
--
-- A privacy-friendly pageview store (no IP, no cookies). Each hit is recorded
-- by the server-side /api/track route via the SERVICE-ROLE client, with a
-- daily-rotating, non-reversible visitor hash for unique-visitor counts.
--
-- Security model: RLS is ENABLED with NO policies and no anon/authenticated
-- grants, so page_views is completely invisible to the public (anon) API.
-- Both the writer (/api/track) and the reader (admin dashboard) use the
-- service-role client, which bypasses RLS. The aggregation functions below are
-- SECURITY DEFINER but EXECUTE is revoked from everyone except service_role, so
-- raw rows and rollups can never be pulled through the public key.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Raw pageview events
-- ---------------------------------------------------------------------
create table if not exists page_views (
  id            bigserial primary key,
  path          text not null,              -- normalized pathname, no query/hash
  referrer_host text,                        -- external referrer host only (null = direct/internal)
  visitor_hash  text,                        -- sha256(day + ip + ua + salt), rotates daily; not reversible
  session_id    text,                        -- random per-tab id (sessionStorage); for session counts
  device        text,                        -- desktop | mobile | tablet | unknown
  country       text,                        -- 2-letter code from the CDN geo header (may be null)
  created_at    timestamptz not null default now()
);

create index if not exists page_views_created_idx          on page_views (created_at desc);
create index if not exists page_views_created_visitor_idx  on page_views (created_at, visitor_hash);
create index if not exists page_views_path_idx             on page_views (path);

alter table page_views enable row level security;
-- Belt-and-suspenders: new tables are not auto-granted to anon/authenticated,
-- but revoke explicitly so intent is obvious. Service role bypasses all of this.
revoke all on page_views from anon, authenticated;

-- ---------------------------------------------------------------------
-- Aggregation functions (service_role only). All bucket by Asia/Dhaka wall
-- time so "today"/"this month" line up with the club's local calendar.
-- ---------------------------------------------------------------------

-- Time series bucketed by 'day' or 'month', with correct per-bucket distinct
-- visitor counts (distinct can't be summed from a finer grain, so we bucket in SQL).
create or replace function analytics_series(bucket text, since_days int)
returns table(period timestamptz, views bigint, visitors bigint)
language sql stable security definer set search_path = public as $$
  select date_trunc(
           case when bucket = 'month' then 'month' else 'day' end,
           created_at at time zone 'Asia/Dhaka'
         ) at time zone 'Asia/Dhaka' as period,
         count(*)::bigint                        as views,
         count(distinct visitor_hash)::bigint    as visitors
  from page_views
  where created_at >= now() - make_interval(days => greatest(since_days, 1))
  group by 1
  order by 1;
$$;

-- Headline totals for the stat tiles.
create or replace function analytics_summary()
returns table(
  total_views    bigint, total_visitors  bigint,
  views_today    bigint, visitors_today  bigint,
  views_7d       bigint, visitors_7d     bigint,
  views_30d      bigint, visitors_30d    bigint
)
language sql stable security definer set search_path = public as $$
  with b as (
    select date_trunc('day', now() at time zone 'Asia/Dhaka') at time zone 'Asia/Dhaka' as today_start
  )
  select
    count(*)::bigint,
    count(distinct visitor_hash)::bigint,
    count(*) filter (where created_at >= (select today_start from b))::bigint,
    count(distinct visitor_hash) filter (where created_at >= (select today_start from b))::bigint,
    count(*) filter (where created_at >= now() - interval '7 days')::bigint,
    count(distinct visitor_hash) filter (where created_at >= now() - interval '7 days')::bigint,
    count(*) filter (where created_at >= now() - interval '30 days')::bigint,
    count(distinct visitor_hash) filter (where created_at >= now() - interval '30 days')::bigint
  from page_views;
$$;

-- Most-visited pages in the window.
create or replace function analytics_top_paths(since_days int, max_rows int)
returns table(path text, views bigint, visitors bigint)
language sql stable security definer set search_path = public as $$
  select path,
         count(*)::bigint                     as views,
         count(distinct visitor_hash)::bigint as visitors
  from page_views
  where created_at >= now() - make_interval(days => greatest(since_days, 1))
  group by path
  order by views desc, path
  limit greatest(max_rows, 1);
$$;

-- Device-type split in the window.
create or replace function analytics_devices(since_days int)
returns table(device text, views bigint)
language sql stable security definer set search_path = public as $$
  select coalesce(nullif(device, ''), 'unknown') as device,
         count(*)::bigint                        as views
  from page_views
  where created_at >= now() - make_interval(days => greatest(since_days, 1))
  group by 1
  order by views desc;
$$;

-- Top external referrers in the window.
create or replace function analytics_referrers(since_days int, max_rows int)
returns table(referrer_host text, views bigint)
language sql stable security definer set search_path = public as $$
  select referrer_host, count(*)::bigint as views
  from page_views
  where created_at >= now() - make_interval(days => greatest(since_days, 1))
    and referrer_host is not null and referrer_host <> ''
  group by 1
  order by views desc, referrer_host
  limit greatest(max_rows, 1);
$$;

-- Lock the functions down to the service role (they are SECURITY DEFINER).
revoke all on function
  analytics_series(text, int),
  analytics_summary(),
  analytics_top_paths(int, int),
  analytics_devices(int),
  analytics_referrers(int, int)
from public, anon, authenticated;

grant execute on function
  analytics_series(text, int),
  analytics_summary(),
  analytics_top_paths(int, int),
  analytics_devices(int),
  analytics_referrers(int, int)
to service_role;
