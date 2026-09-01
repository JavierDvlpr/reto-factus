import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechStore CO — Tecnología de punta en Colombia",
  description:
    "Compra laptops, monitores, periféricos y más con facturación electrónica DIAN. Los mejores productos tech con factura electrónica garantizada.",
  keywords: ["tecnología", "laptops", "Colombia", "factura electrónica", "DIAN"],
  openGraph: {
    title: "TechStore CO",
    description: "Tecnología de punta con facturación electrónica DIAN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Navbar />
        <main>{children}</main>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
