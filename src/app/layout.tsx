import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const pixelifySans = Pixelify_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

import { AiChat } from "@/components/ai-chat/ai-chat";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.shortName} | ${siteConfig.title}`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.bio,
  openGraph: {
    title: `${siteConfig.shortName} | ${siteConfig.title}`,
    description: siteConfig.bio,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.shortName} | ${siteConfig.title}`,
    description: siteConfig.bio,
    creator: "@mahmudizukri",
  },
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${pixelifySans.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground font-sans transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          {children}
          <AiChat />
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
