import Navbar from '@/app/components/Shares/NavBar/page';
import Footer from '@/app/components/Shares/Footer/page';
import FeedbackButton from '@/app/components/FeedbackButton/page';
import './globals.css';

export const metadata = {
  title: 'IEEE Green University of Bangladesh',
  description: 'Official website of IEEE Student Branch, Green University of Bangladesh',
  keywords: ['IEEE', 'Green University', 'GUB', 'IEEE Student Branch', 'Bangladesh'],
  authors: [{ name: 'IEEE GUB Team', url: 'https://ieee-gub.org' }],
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  robots: 'index, follow',
  other: {
    'google-site-verification': 'your-google-site-verification-code',
    author: 'IEEE GUB',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body className="bg-white text-gray-900 antialiased" suppressHydrationWarning>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <FeedbackButton />
        <Footer />
      </body>
    </html>
  );
}
