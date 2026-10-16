import { pageMetadata } from '@/lib/seo';

// The Gallery page itself is a client component (interactive filtering, modal),
// so its SEO metadata lives here in a server layout wrapper.
export const metadata = pageMetadata({
  title: 'Gallery',
  description:
    'Photo gallery capturing events, workshops and memorable moments of the IEEE Student Branch at Green University of Bangladesh (IEEE GUB).',
  path: '/Gallery',
});

export default function GalleryLayout({ children }) {
  return children;
}
