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
import { Preloader } from "@/components/ui/preloader";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { BackToTop } from "@/components/ui/back-to-top";
import { ParallaxBg } from "@/components/ui/parallax-bg";

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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: siteConfig.name,
              url: siteConfig.url,
              jobTitle: siteConfig.title,
              description: siteConfig.bio,
              sameAs: [
                siteConfig.social.github,
                siteConfig.social.linkedin,
                siteConfig.social.twitter
              ].filter(Boolean)
            })
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-transparent text-foreground font-sans transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <ParallaxBg />
          <Preloader />
          <CustomCursor />
          {children}
          <AiChat />
          <BackToTop />
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
