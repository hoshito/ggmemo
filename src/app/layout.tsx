import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/Layout";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GGMemo - Track Your Gaming Journey",
  description: "A competitive gaming companion for tracking matches, analyzing strategies, and improving your gameplay",
  applicationName: "GGMemo",
  keywords: ["gaming", "match tracking", "game analysis", "esports", "competitive gaming", "match history"],
  authors: [{ name: "GGMemo Team" }],
  creator: "GGMemo Team",
  publisher: "GGMemo",
  robots: "index, follow",
  alternates: {
    canonical: "https://ggmemo.pokekoyomi.com",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ggmemo.pokekoyomi.com",
    siteName: "GGMemo",
    title: "GGMemo - Track Your Gaming Journey",
    description: "A competitive gaming companion for tracking matches, analyzing strategies, and improving your gameplay",
    images: [
      {
        url: "https://ggmemo.pokekoyomi.com/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "GGMemo - Your Gaming Companion",
      }
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "GGMemo - Track Your Gaming Journey",
    description: "A competitive gaming companion for tracking matches, analyzing strategies, and improving your gameplay",
    images: ["https://ggmemo.pokekoyomi.com/icon-512x512.png"],
    creator: "@hoshitonton",
    site: "@hoshitonton",
  },

  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/icon-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/icon-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: { url: "/favicon.svg", type: "image/svg+xml" },
  },
  manifest: "/manifest.json",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "GGMemo",
              "description": "A competitive gaming companion for tracking matches, analyzing strategies, and improving your gameplay",
              "url": "https://ggmemo.pokekoyomi.com",
              "applicationCategory": "GameApplication",
              "operatingSystem": "Any",
              "author": {
                "@type": "Organization",
                "name": "GGMemo Team"
              }
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        {process.env.NODE_ENV === "production" && <GoogleAnalytics />}
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
