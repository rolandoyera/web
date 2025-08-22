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

export const metadata: Metadata = {
  metadataBase: new URL("https://canbriinteriors.com"), // ← your production domain
  title: {
    default: "Coming Soon | Canbri Interiors",
    template: "Coming Soon | Canbri Interiors",
  },
  description:
    "Made-to-order excellence in furniture and lighting. Canbri Interiors partners with clients and designers to deliver flawless finishes and a perfect fit.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Canbri Interiors",
    title: "Canbri Interiors",
    description:
      "Made-to-order excellence in furniture and lighting. Canbri Interiors partners with clients and designers to deliver flawless finishes and a perfect fit.",
    images: [
      {
        url: "/og/logo-white-og.jpg", // put a 1600×425 image in public/og/
        width: 1600,
        height: 425,
        alt: "Canbri— bespoke furniture & lighting",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Canbri Interiors",
    description:
      "Made-to-order excellence in furniture and lighting. Canbri Interiors partners with clients and designers to deliver flawless finishes and a perfect fit.",
    images: ["/og/logo-white-og.jpg"],
    creator: "@canbriinteriors", // optional
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
