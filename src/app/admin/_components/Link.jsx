import NextLink from 'next/link';

/**
 * Admin-wide drop-in for `next/link` that disables prefetch by default.
 *
 * Every /admin/* route is `force-dynamic` and auth-gated, so Next.js's default
 * viewport prefetching is wasted work: as links scroll into view it floods the
 * network with repeated RSC (`?_rsc=`) requests for pages that still have to be
 * re-fetched on click. Routing all admin links through this wrapper kills that
 * in every case, while a caller can still opt back in with `prefetch`.
 */
export default function Link({ prefetch = false, ...props }) {
  return <NextLink prefetch={prefetch} {...props} />;
}
