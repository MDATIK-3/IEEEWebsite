import Link from 'next/link';

// Rendered when an event id doesn't resolve (page.jsx calls notFound()). Unlike
// the previous inline component, this returns a real HTTP 404 so search engines
// drop the URL instead of indexing a soft-404.
export default function EventNotFound() {
  return (
    <main className="text-center py-20 text-gray-700 dark:text-gray-300">
      <h1 className="text-2xl font-semibold mb-4">Event Not Found</h1>
      <p className="mb-6">Please check the link or try searching for other events.</p>
      <Link
        href="/Activities/Events"
        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Browse all events
      </Link>
    </main>
  );
}
