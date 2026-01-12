import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "ZOKA CARD | The Ultimate Element Showdown",
  description: "A premium realtime turn-based card game with element counters.",
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-outfit antialiased bg-[#020617]`} suppressHydrationWarning>
        {children}
        <Toaster position="top-center" richColors theme="dark" closeButton />
      </body>
    </html>
  );
}
