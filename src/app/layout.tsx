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
  title: "MonoPixel – Draw Pixel Art Online",
  description:
    "A lightweight and intuitive pixel drawing app. Zoom, pan, choose colors, and create pixel art with ease.",
  keywords: [
    "pixel art",
    "drawing app",
    "canvas",
    "zoom and pan",
    "online pixel editor",
    "create pixel art",
    "Next.js app",
  ],
  authors: [{ name: "Jetchomen Husain" }],
  creator: "Jetchomen Husain",
  applicationName: "MonoPixel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
