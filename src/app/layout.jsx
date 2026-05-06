import NavBar from './components/Shares/NavBar/page.jsx';
import Footer from './components/Shares/Footer/page.jsx';
import ChatbotButton from './components/ChatbotButton/page.jsx';
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/app/Theme/ThemeProvider.jsx";
import './globals.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata = {
  title: 'IEEE SB Green University of Bangladesh',
  description: 'Official website of IEEE Student Branch, Green University of Bangladesh',
  keywords: ['IEEE', 'Green University', 'GUB', 'IEEE Student Branch', 'Bangladesh'],
  authors: [{ name: 'IEEE GUB Team', url: 'https://ieeegub.vercel.app/' }],
  icons: {
    icon: '/favicon/favicon-96x96.png',
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
  robots: 'index, follow',
  openGraph: {
    title: 'IEEE SB Green University of Bangladesh',
    description: 'Connect. Innovate. Lead. IEEE Student Branch of Green University of Bangladesh',
    url: 'https://ieeegub.vercel.app',
    siteName: 'IEEE SB GUB',
    images: [
      {
        url: '/favicon/favicon-96x96.png',
        width: 1200,
        height: 630,
        alt: 'IEEE SB GUB Official Website',
      },
    ],
    locale: 'en_US',
    type: 'website',
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body>
        <Providers>
          <NavBar />
          <main className="flex-grow">{children}</main>
          <ChatbotButton />
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
