// app/layout.tsx
import "./globals.css";
import { righteous } from "./fonts"; // ✅ import font object

export const metadata = {
  title: "Yideshare",
  description: "Find and share rides",
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
