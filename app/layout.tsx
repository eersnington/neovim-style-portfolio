import type React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { GeistMono } from "geist/font/mono";
import { PostHogProvider } from "@/components/PostHogProvider";

import "@/app/globals.css";
import config from "@/lib/config";

export const metadata: Metadata = {
  title: `${config.pageTitle}`,
  description: "A Neovim-inspired personal homepage with keybinds",
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
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        />
      </head>
      <body className={GeistMono.className}>
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
