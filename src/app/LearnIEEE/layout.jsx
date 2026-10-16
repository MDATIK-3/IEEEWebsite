import { pageMetadata } from '@/lib/seo';

// The LearnIEEE page is a client component (language/tab state), so its SEO
// metadata lives here in a server layout wrapper.
export const metadata = pageMetadata({
  title: 'Learn About IEEE',
  description:
    "Discover what IEEE is — the world's largest technical professional organization — its mission, global impact and membership benefits, in English and Bangla.",
  path: '/LearnIEEE',
});

export default function LearnIEEELayout({ children }) {
  return children;
}
