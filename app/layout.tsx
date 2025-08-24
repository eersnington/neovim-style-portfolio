import { GeistMono } from 'geist/font/mono';
import type { Metadata } from 'next';
import type React from 'react';
import { ThemeProvider } from '@/components/theme-provider';

import '@/app/globals.css';
import config from '@/lib/config';

export const metadata: Metadata = {
  title: `${config.pageTitle}`,
  description: 'A Neovim-inspired personal homepage with keybinds',
  metadataBase: new URL('https://eers.dev'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={GeistMono.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
