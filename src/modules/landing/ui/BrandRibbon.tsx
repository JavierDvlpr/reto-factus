"use client";

import React from "react";

// ─── Verified Official SVG Brand Logos from CDN ─────────────────────────────

interface BrandItem {
  name: string;
  logoUrl: string;
  widthClass?: string;
}

const BRANDS: BrandItem[] = [
  {
    name: "Apple",
    logoUrl: "https://cdn.simpleicons.org/apple/ffffff",
  },
  {
    name: "NVIDIA",
    logoUrl: "https://cdn.simpleicons.org/nvidia/ffffff",
  },
  {
    name: "ASUS",
    logoUrl: "https://cdn.simpleicons.org/asus/ffffff",
  },
  {
    name: "Sony",
    logoUrl: "https://cdn.simpleicons.org/sony/ffffff",
  },
  {
    name: "Samsung",
    logoUrl: "https://cdn.simpleicons.org/samsung/ffffff",
  },
  {
    name: "Intel",
    logoUrl: "https://cdn.simpleicons.org/intel/ffffff",
  },
  {
    name: "AMD",
    logoUrl: "https://cdn.simpleicons.org/amd/ffffff",
  },
  {
    name: "Razer",
    logoUrl: "https://cdn.simpleicons.org/razer/ffffff",
  },
  {
    name: "Corsair",
    logoUrl: "https://cdn.simpleicons.org/corsair/ffffff",
  },
  {
    name: "MSI",
    logoUrl: "https://cdn.simpleicons.org/msi/ffffff",
  },
  {
    name: "Dell",
    logoUrl: "https://cdn.simpleicons.org/dell/ffffff",
  },
  {
    name: "Lenovo",
    logoUrl: "https://cdn.simpleicons.org/lenovo/ffffff",
  },
  {
    name: "HP",
    logoUrl: "https://cdn.simpleicons.org/hp/ffffff",
  },
  {
    name: "LG",
    logoUrl: "https://cdn.simpleicons.org/lg/ffffff",
  },
  {
    name: "Alienware",
    logoUrl: "https://cdn.simpleicons.org/alienware/ffffff",
  },
  {
    name: "PlayStation",
    logoUrl: "https://cdn.simpleicons.org/playstation/ffffff",
  },
];

export default function BrandRibbon() {
  return (
    <section className="bg-black text-white py-8 sm:py-10 overflow-hidden relative border-y border-white/10">
      {/* Infinite Marquee Track with Horizontal Gradient Fade Mask */}
      <div
        className="w-full overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <div className="animate-marquee flex items-center gap-16 sm:gap-24">
          {/* First loop set of brand SVG logos */}
          {BRANDS.map((brand, idx) => (
            <div
              key={`brand-1-${idx}`}
              className="flex items-center justify-center opacity-75 hover:opacity-100 hover:scale-110 transition-all duration-200 shrink-0 cursor-pointer select-none"
              title={brand.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.logoUrl}
                alt={`${brand.name} logo`}
                loading="lazy"
                className="h-7 sm:h-9 w-auto max-w-[90px] object-contain"
              />
            </div>
          ))}

          {/* Second duplicate loop set for seamless infinite scrolling */}
          {BRANDS.map((brand, idx) => (
            <div
              key={`brand-2-${idx}`}
              className="flex items-center justify-center opacity-75 hover:opacity-100 hover:scale-110 transition-all duration-200 shrink-0 cursor-pointer select-none"
              title={brand.name}
              aria-hidden="true"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.logoUrl}
                alt={`${brand.name} logo`}
                loading="lazy"
                className="h-7 sm:h-9 w-auto max-w-[90px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
