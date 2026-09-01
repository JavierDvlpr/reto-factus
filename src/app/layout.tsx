import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import TopBanner from "@/components/TopBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechStore CO — Lo mejor en tecnología y hardware",
  description:
    "Encuentra laptops, monitores, periféricos y hardware de alto rendimiento con envío a todo Colombia y garantía oficial.",
  keywords: [
    "tecnología",
    "laptops",
    "Colombia",
    "hardware",
    "periféricos",
    "monitores",
    "gaming",
  ],
  openGraph: {
    title: "TechStore CO — Lo mejor en tecnología y hardware",
    description: "Encuentra la mejor tecnología con garantía oficial y envío a todo Colombia.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black min-h-screen flex flex-col font-sans`}
      >
        <TopBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
