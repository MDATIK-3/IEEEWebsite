import NextLink from 'next/link';

/**
 * Admin-wide drop-in for `next/link`.
 *
 * Admin routes are all `force-dynamic`. We previously forced `prefetch={false}`
 * here because, with no loading boundary, auto-prefetch re-downloaded the whole
 * dynamic payload for every link in view — the `?_rsc=` flood. That also meant
 * every click was a cold round-trip, which made navigation feel slow.
 *
 * Now that `admin/loading.jsx` exists, Next's *default* (auto) prefetch stops at
 * that lightweight loading boundary and caches it (~30s): hovering/scrolling
 * warms a route cheaply, and a click shows the skeleton instantly. So we use
 * Next's default prefetch and let any caller override per-link with `prefetch`.
 *
 * (Avoid `prefetch={true}` on these routes — that forces a full dynamic
 * prefetch and brings the flood back.)
 */
export default function Link(props) {
  return <NextLink {...props} />;
}
