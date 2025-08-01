import NavBar from './components/Shares/NavBar/page.jsx';
import Footer from './components/Shares/Footer/page.jsx';
import FeedbackButton from './components/FeedbackButton/page.jsx';
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/app/Theme/ThemeProvider.jsx";
import { metadata, viewport } from '@/app/utils/metadata.js';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body>
        <Providers>
          <NavBar />
          <main className="flex-grow">{children}</main>
          <FeedbackButton />
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

export { metadata, viewport };
