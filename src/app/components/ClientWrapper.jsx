'use client';

import { ThemeProvider } from './Theme/ThemeProvider';

export default function ClientWrapper({ children }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}