import { NextResponse } from 'next/server';
import { getTickerItemsLive } from '@/lib/queries';

/**
 * Live news-ticker feed.
 *
 * The ticker is rendered in the root layout, which is baked into every
 * statically generated page — so a time-scheduled announcement would not
 * appear / disappear on time from the cached HTML alone. The client polls this
 * dynamic, never-cached endpoint so items go live and expire on schedule
 * regardless of the page's ISR state. Row Level Security (anon key) filters to
 * active items inside their `starts_at` / `ends_at` window, so nothing is
 * leaked before its publish time.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const items = await getTickerItemsLive();
  return NextResponse.json(
    { items },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
