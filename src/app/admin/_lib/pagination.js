/**
 * Shared helpers for server-side admin list pagination.
 *
 * Admin list pages read the 1-based `?page=` search param, translate it into a
 * Supabase `.range()` window, and ask PostgREST for an exact row `count` so the
 * pager knows how many pages exist. Keeping the math here means every list page
 * (and the `Pagination` component) agrees on page size and bounds.
 *
 * Plain JS (no React / no 'use server'|'use client') so it is importable from
 * both server components and client components.
 */

/** Default rows per page across the admin panel. */
export const PAGE_SIZE = 25;

/**
 * Parse a 1-based page number from a raw search-param value (string | string[] |
 * undefined), clamping anything invalid or < 1 to page 1.
 */
export function parsePage(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/**
 * Supabase `.range()` bounds (0-based, inclusive) for a 1-based page.
 * @returns {{ from: number, to: number }}
 */
export function pageRange(page, pageSize = PAGE_SIZE) {
  const from = (Math.max(1, page) - 1) * pageSize;
  return { from, to: from + pageSize - 1 };
}

/** Total number of pages for a row count (always >= 1). */
export function pageCount(total, pageSize = PAGE_SIZE) {
  return Math.max(1, Math.ceil((Number(total) || 0) / pageSize));
}

/**
 * Build a querystring from the current search params plus overrides. A value of
 * null / '' / undefined in `overrides` removes that key (and array params keep
 * only their first value — these lists are all single-valued). Used by both the
 * list pages (to redirect an out-of-range page) and the `Pagination` links, so
 * navigating pages preserves the active filters/search/tab.
 */
export function buildQuery(current, overrides = {}) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(current || {})) {
    const val = Array.isArray(v) ? v[0] : v;
    if (val != null && val !== '') params.set(k, String(val));
  }
  for (const [k, v] of Object.entries(overrides)) {
    if (v == null || v === '') params.delete(k);
    else params.set(k, String(v));
  }
  return params.toString();
}
