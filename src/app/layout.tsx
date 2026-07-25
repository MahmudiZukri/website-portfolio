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
  title: `${siteConfig.shortName} | ${siteConfig.title}`,
  description: siteConfig.bio,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${pixelifySans.variable} h-full antialiased dark`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
        <AiChat />
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
