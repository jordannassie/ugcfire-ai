import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ugcfire.ai';
const OG_IMAGE = `${APP_URL}/og-image.png`;

export const metadata: Metadata = {
  title: "UGCFire.ai — Create Branded UGC Content with AI",
  description:
    "Upload your product, logo, and brand style. Generate images, videos, hooks, and content assets in minutes.",
  icons: {
    icon: [{ url: "/favicon.png?v=3" }],
    shortcut: [{ url: "/favicon.png?v=3" }],
    apple: [{ url: "/apple-touch-icon.png?v=3" }],
  },
  openGraph: {
    title: "UGCFire.ai",
    description: "Create branded UGC content yourself with AI.",
    type: "website",
    url: APP_URL,
    siteName: "UGCFire.ai",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "UGCFire.ai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UGCFire.ai",
    description: "Create branded UGC content yourself with AI.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
