// app/layout.tsx
import "./globals.css";
import { righteous } from "./fonts";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Yideshare",
  description: "Find and share rides",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${righteous.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
