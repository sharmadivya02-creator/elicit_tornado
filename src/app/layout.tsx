import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "ELICIT'26 — MUJ ACM Student Chapter",
  description:
    "A retro pixel-art space-themed interactive website for the ELICIT'26 tech fest by Manipal University Jaipur ACM Student Chapter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} min-h-screen`}>
      <body className="antialiased min-h-screen bg-black text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}