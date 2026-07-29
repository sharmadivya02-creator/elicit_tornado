import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ELICIT'26 — MUJ ACM Student Chapter",
  description: "A retro pixel-art space-themed interactive website for the ELICIT'26 tech fest by Manipal University Jaipur ACM Student Chapter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
