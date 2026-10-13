import NavBar from './components/Shares/NavBar/NavBar.jsx';
import NewsTickerBar from './components/NewsTicker/NewsTickerBar.jsx';
import Footer from './components/Shares/Footer/Footer.jsx';
import ChatbotButton from './components/ChatbotButton/ChatbotButton.jsx';
import HideOnAdmin from './components/HideOnAdmin.jsx';
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/app/Theme/ThemeProvider.jsx";
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ieeegub.vercel.app';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'IEEE SB Green University of Bangladesh — IEEE GUB',
    template: '%s | IEEE SB GUB',
  },
  description:
    'Official website of the IEEE Student Branch at Green University of Bangladesh (IEEE GUB) — events, achievements, leadership, projects and opportunities in technology and innovation.',
  keywords: ['IEEE', 'Green University', 'GUB', 'IEEE Student Branch', 'IEEE GUB', 'Bangladesh', 'technology', 'engineering', 'student branch'],
  authors: [{ name: 'IEEE GUB Team', url: `${SITE_URL}/` }],
  applicationName: 'IEEE SB GUB',
  alternates: { canonical: '/' },
  icons: {
    icon: '/favicon/favicon-96x96.png',
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'IEEE SB Green University of Bangladesh',
    description: 'Connect. Innovate. Lead. IEEE Student Branch of Green University of Bangladesh',
    url: SITE_URL,
    siteName: 'IEEE SB GUB',
    images: [{ url: '/images/hero.jpg', alt: 'IEEE SB Green University of Bangladesh' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IEEE SB Green University of Bangladesh',
    description: 'Connect. Innovate. Lead. IEEE Student Branch of Green University of Bangladesh',
    images: ['/images/hero.jpg'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

// Dev-only: the "ResizeObserver loop completed with undelivered notifications"
// browser warning is harmless (the spec just defers observations to the next
// frame), but Next.js's dev error overlay catches it as a window `error` event
// and then hammers /__nextjs_original-stack-frames trying to symbolicate a
// stack that doesn't exist — an endless request flood on pages with animated /
// transitioning layout. We swallow only that one message, before Next's client
// runtime registers its handler (this runs during initial HTML parse, so our
// listener is first and stopImmediatePropagation keeps the overlay from seeing
// it). Real errors are untouched, and nothing ships to production.
const RESIZE_OBSERVER_OVERLAY_FIX = `(function(){
  if (typeof window === 'undefined') return;
  var MSGS = ['ResizeObserver loop completed with undelivered notifications', 'ResizeObserver loop limit exceeded'];
  var isRo = function(m){ return typeof m === 'string' && MSGS.some(function(s){ return m.indexOf(s) !== -1; }); };
  window.addEventListener('error', function(e){
    if (isRo(e && e.message)) { e.stopImmediatePropagation(); e.preventDefault(); }
  }, true);
})();`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'IEEE Student Branch, Green University of Bangladesh',
      alternateName: 'IEEE SB GUB',
      url: SITE_URL,
      logo: `${SITE_URL}/images/IEEELogo.png`,
      sameAs: ['https://www.facebook.com/ieeesbgub/'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'IEEE SB Green University of Bangladesh',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV !== 'production' && (
          <script dangerouslySetInnerHTML={{ __html: RESIZE_OBSERVER_OVERLAY_FIX }} />
        )}
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#10b981" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>
          <HideOnAdmin>
            <NavBar />
            <NewsTickerBar />
          </HideOnAdmin>
          <main className="flex-grow">{children}</main>
          <HideOnAdmin>
            <ChatbotButton />
            <Footer />
          </HideOnAdmin>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
