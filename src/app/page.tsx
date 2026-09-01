"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import {
  Star,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Mail,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  const [reviewIdx, setReviewIdx] = useState(0);

  const newArrivals = PRODUCTS.filter((p) => p.isNewArrival);
  const topSelling = PRODUCTS.filter((p) => p.isTopSelling);

  const reviews = [
    {
      name: "Carlos Mendoza",
      date: "Hace 2 días",
      text: "Excelente servicio. Compré una MacBook Pro M4 Pro y la factura electrónica de la DIAN llegó a mi correo de inmediato con el CUFE verificado en el portal oficial de Factus. 100% recomendado.",
    },
    {
      name: "Valentina Restrepo",
      date: "Hace 3 días",
      text: "Compré el monitor Samsung Odyssey y unos audífonos Sony. La experiencia en la tienda fue súper fluida y el PDF de la factura se descarga al instante para legalizar en mi empresa.",
    },
    {
      name: "Andrés Gómez",
      date: "Hace 1 semana",
      text: "La laptop ASUS ROG llegó impecable. Lo que más me gustó fue la transparencia con los impuestos (IVA 19%) y la factura electrónica generada automáticamente por Factus.",
    },
    {
      name: "Mariana Torres",
      date: "Hace 2 semanas",
      text: "Excelente catálogo de periféricos. El teclado Keychron tiene una calidad inmejorable y pude consultar el código QR directamente en los servidores de la DIAN sin problemas.",
    },
  ];

  return (
    <div className="bg-white text-black min-h-screen">
      {/* ─── 1. Hero Section ────────────────────────────────────────────────── */}
      <section className="bg-[#F2F0F1] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Text & Stats */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10 pb-8 sm:pb-16">
              <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm text-xs font-semibold text-gray-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Facturación electrónica DIAN oficial con Factus
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-black leading-[1.08] font-sans">
                Encuentra la tecnología que se adapta a tu estilo
              </h1>

              <p className="text-gray-600 text-sm sm:text-base max-w-xl leading-relaxed">
                Explora nuestra colección curada de laptops, monitores, periféricos y
                componentes de alta gama. Cada compra emite automáticamente su factura
                electrónica UBL 2.1 ante la DIAN.
              </p>

              <div>
                <Link href="/#catalogo">
                  <button className="w-full sm:w-auto bg-black text-white text-sm sm:text-base font-semibold px-12 py-4 rounded-full hover:bg-black/85 transition-all shadow-md active:scale-95">
                    Comprar ahora
                  </button>
                </Link>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-300/60 max-w-lg">
                <div>
                  <h4 className="text-2xl sm:text-4xl font-extrabold text-black">200+</h4>
                  <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
                    Marcas líderes
                  </p>
                </div>
                <div className="border-l border-gray-300/60 pl-4 sm:pl-6">
                  <h4 className="text-2xl sm:text-4xl font-extrabold text-black">2,000+</h4>
                  <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
                    Productos tech
                  </p>
                </div>
                <div className="border-l border-gray-300/60 pl-4 sm:pl-6">
                  <h4 className="text-2xl sm:text-4xl font-extrabold text-black">30,000+</h4>
                  <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
                    Facturas DIAN
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Image with Star Sparkles */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              {/* Decorative Stars */}
              <div className="absolute top-6 right-4 sm:right-8 text-black z-20 animate-pulse">
                <Sparkles className="w-12 h-12 fill-black stroke-black" />
              </div>
              <div className="absolute bottom-28 left-4 text-black z-20">
                <Sparkles className="w-7 h-7 fill-black stroke-black" />
              </div>

              {/* Image */}
              <div className="relative w-full max-w-md lg:max-w-none h-[420px] sm:h-[540px] rounded-t-3xl overflow-hidden">
                <Image
                  src="/images/hero_tech.jpg"
                  alt="Tecnología de última generación con TechStore"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. Brand Logos Ribbon ──────────────────────────────────────────── */}
      <section className="bg-black text-white py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-8 sm:gap-12 opacity-90">
            <span className="font-extrabold text-2xl sm:text-3xl tracking-widest font-serif">
              APPLE
            </span>
            <span className="font-extrabold text-2xl sm:text-3xl tracking-wider font-mono">
              ASUS ROG
            </span>
            <span className="font-extrabold text-2xl sm:text-3xl tracking-widest font-sans">
              NVIDIA
            </span>
            <span className="font-extrabold text-2xl sm:text-3xl tracking-widest font-serif">
              SONY
            </span>
            <span className="font-extrabold text-2xl sm:text-3xl tracking-widest font-sans">
              SAMSUNG
            </span>
            <span className="font-extrabold text-2xl sm:text-3xl tracking-widest font-mono hidden md:inline">
              LOGITECH
            </span>
          </div>
        </div>
      </section>

      {/* ─── 3. Section: Nuevas Llegadas (New Arrivals) ──────────────────────── */}
      <section id="nuevas-llegadas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-black font-sans">
            Nuevas llegadas
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/productos">
            <button className="w-full sm:w-auto px-16 py-3.5 rounded-full border border-gray-300 text-sm font-semibold text-black hover:bg-gray-50 transition-colors">
              Ver todo
            </button>
          </Link>
        </div>

        <hr className="mt-16 sm:mt-20 border-gray-200" />
      </section>

      {/* ─── 4. Section: Más Vendidos (Top Selling) ─────────────────────────── */}
      <section id="mas-vendidos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-black font-sans">
            Más vendidos
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {topSelling.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/productos">
            <button className="w-full sm:w-auto px-16 py-3.5 rounded-full border border-gray-300 text-sm font-semibold text-black hover:bg-gray-50 transition-colors">
              Ver todo
            </button>
          </Link>
        </div>
      </section>

      {/* ─── 5. Section: Explora por Estilo Tecnológico (Browse by Style) ───── */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-[#F0F0F0] rounded-[32px] sm:rounded-[40px] p-6 sm:p-14">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-black font-sans">
              Explora por estilo tecnológico
            </h2>
          </div>

          {/* Asymmetric 2x2 Grid matching Shop.co */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* 1. Gaming & Esports (40% width) */}
            <Link
              href="/productos"
              className="md:col-span-5 group relative h-[240px] sm:h-[290px] rounded-[24px] bg-black overflow-hidden p-6 flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <span className="font-extrabold text-2xl sm:text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] z-10">
                Gaming
              </span>
              <Image
                src="/images/category_gaming.jpg"
                alt="Equipos para Gaming y Streaming"
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30 pointer-events-none" />
            </Link>

            {/* 2. Oficina & Productividad (60% width) */}
            <Link
              href="/productos"
              className="md:col-span-7 group relative h-[240px] sm:h-[290px] rounded-[24px] bg-black overflow-hidden p-6 flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <span className="font-extrabold text-2xl sm:text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] z-10">
                Productividad
              </span>
              <Image
                src="/images/category_office.jpg"
                alt="Oficina y Productividad Profesional"
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30 pointer-events-none" />
            </Link>

            {/* 3. Audio & Creación (60% width) */}
            <Link
              href="/productos"
              className="md:col-span-7 group relative h-[240px] sm:h-[290px] rounded-[24px] bg-black overflow-hidden p-6 flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <span className="font-extrabold text-2xl sm:text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] z-10">
                Audio & Hi-Fi
              </span>
              <Image
                src="/images/category_audio.jpg"
                alt="Audio profesional y auriculares"
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30 pointer-events-none" />
            </Link>

            {/* 4. Setup & Periféricos (40% width) */}
            <Link
              href="/productos"
              className="md:col-span-5 group relative h-[240px] sm:h-[290px] rounded-[24px] bg-black overflow-hidden p-6 flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <span className="font-extrabold text-2xl sm:text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] z-10">
                Periféricos
              </span>
              <Image
                src="/images/category_peripherals.jpg"
                alt="Teclados mecánicos y periféricos"
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30 pointer-events-none" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 6. Section: Testimonios de Clientes (Reviews) ─────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-black font-sans">
            Nuestros clientes satisfechos
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setReviewIdx((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Testimonio anterior"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setReviewIdx((prev) => (prev === reviews.length - 1 ? 0 : prev + 1))}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Siguiente testimonio"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-[20px] p-6 sm:p-8 space-y-3 bg-white hover:shadow-md transition-shadow"
            >
              {/* 5 Stars */}
              <div className="flex items-center gap-1 text-[#FFC633]">
                {[...Array(5)].map((_, starI) => (
                  <Star key={starI} className="w-4 h-4 fill-[#FFC633]" />
                ))}
              </div>

              {/* Customer Name & Verified Badge */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="font-bold text-base text-black">{rev.name}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500 text-white" />
              </div>

              {/* Review Text */}
              <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{rev.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. Floating Newsletter Card + Footer Wrapper ───────────────────── */}
      <div className="relative mt-20 pt-10 bg-[#F0F0F0]">
        {/* Floating Dark Newsletter Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 absolute -top-24 left-0 right-0 z-20">
          <div className="bg-black text-white rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Mantente al día con nuestras últimas ofertas y novedades tech
                </h3>
              </div>
              <div className="lg:col-span-5 space-y-3">
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    className="w-full bg-white text-black rounded-full pl-12 pr-4 py-3 text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
                <button className="w-full bg-white text-black font-semibold text-sm rounded-full py-3 hover:bg-gray-100 transition-colors shadow-sm">
                  Suscribirme al boletín
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 8. Multi-column Footer ───────────────────────────────────────── */}
        <footer className="pt-32 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-12 gap-8 pb-12 border-b border-gray-300/80">
              {/* Brand Column */}
              <div className="col-span-2 md:col-span-4 space-y-4">
                <span className="font-extrabold text-3xl tracking-tight text-black font-sans">
                  Tech.co
                </span>
                <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                  Tecnología de última generación con facturación electrónica DIAN
                  oficial impulsada por la API de Factus en Colombia.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all"
                    aria-label="X (Twitter)"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all"
                    aria-label="Facebook"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all"
                    aria-label="Instagram"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://github.com/JavierDvlpr/reto-factus"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all"
                    aria-label="GitHub"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Column: Empresa */}
              <div className="col-span-1 md:col-span-2 space-y-3">
                <h4 className="font-bold text-sm text-black tracking-wider">Empresa</h4>
                <ul className="space-y-2.5 text-sm text-gray-500">
                  <li>
                    <Link href="/" className="hover:text-black transition-colors">
                      Acerca de
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-black transition-colors">
                      Características
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-black transition-colors">
                      Trabajos
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-black transition-colors">
                      Prensa
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column: Ayuda */}
              <div className="col-span-1 md:col-span-2 space-y-3">
                <h4 className="font-bold text-sm text-black tracking-wider">Ayuda</h4>
                <ul className="space-y-2.5 text-sm text-gray-500">
                  <li>
                    <Link href="/" className="hover:text-black transition-colors">
                      Soporte técnico
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-black transition-colors">
                      Detalles de envío
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-black transition-colors">
                      Términos de servicio
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-black transition-colors">
                      Política de privacidad
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column: Facturación DIAN */}
              <div className="col-span-1 md:col-span-2 space-y-3">
                <h4 className="font-bold text-sm text-black tracking-wider">Facturación</h4>
                <ul className="space-y-2.5 text-sm text-gray-500">
                  <li>
                    <Link href="/facturas" className="hover:text-black transition-colors">
                      Historial facturas
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://developers.factus.com.co"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-black transition-colors"
                    >
                      Factus API V2
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://catalogo-vpfe-hab.dian.gov.co"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-black transition-colors"
                    >
                      Portal DIAN
                    </a>
                  </li>
                  <li>
                    <Link href="/checkout" className="hover:text-black transition-colors">
                      Simular compra
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column: Recursos */}
              <div className="col-span-1 md:col-span-2 space-y-3">
                <h4 className="font-bold text-sm text-black tracking-wider">Recursos</h4>
                <ul className="space-y-2.5 text-sm text-gray-500">
                  <li>
                    <Link href="/" className="hover:text-black transition-colors">
                      Guías de compra
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-black transition-colors">
                      Comparador tech
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-black transition-colors">
                      Blog tecnológico
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-black transition-colors">
                      Tutoriales DIAN
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
              <p>Tech.co © 2026. Todos los derechos reservados. Desarrollado para el Reto Factus.</p>
              <div className="flex items-center gap-3 font-semibold text-gray-600">
                <span className="bg-white px-2.5 py-1 rounded border border-gray-200 text-[11px]">
                  VISA
                </span>
                <span className="bg-white px-2.5 py-1 rounded border border-gray-200 text-[11px]">
                  MASTERCARD
                </span>
                <span className="bg-white px-2.5 py-1 rounded border border-gray-200 text-[11px]">
                  PSE
                </span>
                <span className="bg-white px-2.5 py-1 rounded border border-gray-200 text-[11px]">
                  FACTUS DIAN
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
