import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@livekit/components-styles";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Voice AI Trivia Game",
    template: "%s | Voice AI Trivia",
  },
  description:
    "An interactive voice AI trivia game powered by LiveKit Agents and OpenAI Realtime API. Perfect for tech talks and demonstrations of real-time voice AI technology.",
  keywords: [
    "voice AI",
    "trivia game",
    "LiveKit",
    "OpenAI Realtime API",
    "real-time voice",
    "AI assistant",
    "tech demo",
  ],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "Voice AI Trivia Game",
    description: "Interactive voice AI trivia game for tech demonstrations",
    siteName: "Voice AI Trivia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voice AI Trivia Game",
    description: "Interactive voice AI trivia game for tech demonstrations",
    creator: "@yourusername",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
