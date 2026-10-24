import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Pageview collector for the self-hosted visitor analytics.
 *
 * The client beacon (PageViewTracker) POSTs `{ path, referrer, sid }` on every
 * route change. We derive the device, country and a privacy-preserving visitor
 * hash SERVER-SIDE, then insert via the service-role client (page_views has RLS
 * on with no public access, so it can't be written/read with the anon key).
 *
 * Design choices:
 *  - No IP or user-agent is stored. The visitor hash is sha256(day+ip+ua+salt),
 *    which rotates daily and can't be reversed to a person — enough to count
 *    unique visitors per day without tracking anyone across days.
 *  - Known bots and non-content paths (/admin, /api) are dropped.
 *  - Any failure returns 200 with `{ ok: false }` so a tracking hiccup never
 *    breaks the visitor's navigation.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

const BOT_RE =
  /bot|crawl|spider|slurp|mediapartners|bingpreview|facebookexternalhit|embedly|quora|pinterest|slackbot|telegrambot|whatsapp|discordbot|linkedinbot|twitterbot|applebot|petalbot|ahrefs|semrush|yandex|headless|lighthouse|dataprovider|screaming|preview/i;

function deviceFromUA(ua: string): string {
  if (/ipad|tablet|playbook|silk|kindle|(android(?!.*mobile))/i.test(ua)) return 'tablet';
  if (/mobi|iphone|ipod|android.*mobile|windows phone|blackberry|opera mini/i.test(ua)) return 'mobile';
  return 'desktop';
}

function dailyVisitorHash(ip: string, ua: string): string {
  const salt = process.env.ANALYTICS_SALT || 'ieee-gub-analytics-v1';
  const day = new Date().toISOString().slice(0, 10); // UTC day; rotates the hash
  return crypto.createHash('sha256').update(`${day}|${ip}|${ua}|${salt}`).digest('hex').slice(0, 32);
}

/** Returns the external referrer host, or null for direct/internal/invalid. */
function referrerHost(referrer: unknown, selfHost: string | null): string | null {
  if (typeof referrer !== 'string' || !referrer) return null;
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (!host) return null;
    if (selfHost && host === selfHost.toLowerCase().split(':')[0]) return null; // internal nav
    return host.slice(0, 120);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    // Validate + normalize the path (the only field we trust from the client).
    let path = typeof body.path === 'string' ? body.path.trim() : '';
    if (!path || !path.startsWith('/')) {
      return NextResponse.json({ ok: false }, { status: 400, headers: NO_STORE });
    }
    path = path.split('?')[0].split('#')[0].slice(0, 300);

    // Never record the admin panel or API traffic.
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return NextResponse.json({ ok: true, skipped: true }, { headers: NO_STORE });
    }

    const ua = request.headers.get('user-agent') || '';
    if (!ua || BOT_RE.test(ua)) {
      return NextResponse.json({ ok: true, skipped: true }, { headers: NO_STORE });
    }

    const ipRaw =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      '';
    const ip = ipRaw.split(',')[0].trim() || 'unknown';
    const country = (request.headers.get('x-vercel-ip-country') || '').slice(0, 2) || null;
    const sessionId =
      typeof body.sid === 'string' ? body.sid.replace(/[^a-z0-9]/gi, '').slice(0, 40) : null;

    const { error } = await createAdminClient()
      .from('page_views')
      .insert({
        path,
        referrer_host: referrerHost(body.referrer, request.headers.get('host')),
        visitor_hash: dailyVisitorHash(ip, ua),
        session_id: sessionId,
        device: deviceFromUA(ua),
        country,
      });

    if (error) {
      console.error('page_views insert failed:', error.message);
      return NextResponse.json({ ok: false }, { status: 200, headers: NO_STORE });
    }

    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  } catch (e) {
    console.error('track route error:', e);
    return NextResponse.json({ ok: false }, { status: 200, headers: NO_STORE });
  }
}
