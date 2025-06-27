import Navbar from '@/app/components/Shares/NavBar/page';
import Footer from '@/app/components/Shares/Footer/page';
import './globals.css';

export const metadata = {
  title: 'IEEE Green University of Bangladesh',
  description: 'Official website of IEEE Student Branch, Green University of Bangladesh',
  keywords: ['IEEE', 'Green University', 'GUB', 'IEEE Student Branch', 'Bangladesh'],
  authors: [{ name: 'IEEE GUB Team', url: 'https://ieee-gub.org' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/images/IEEE_SB.png',
    shortcut: '/images/IEEE_SB.png',
    apple: '/images/IEEE_SB.png',
  },
  robots: 'index, follow',
  other: {
    'google-site-verification': 'your-google-site-verification-code',
    author: 'IEEE GUB',
  },
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
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
