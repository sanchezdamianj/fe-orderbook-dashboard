import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Terrace custom font
const terraceFont = localFont({
  src: "../public/fonts/terrace-font.woff2",
  variable: "--font-terrace",
  display: "swap",
  weight: "400 700",
});

// Monospace font for orderbook numbers
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "orderbook dashboard",
  description: "Real-time cryptocurrency orderbook viewer powered by Binance API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${terraceFont.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
