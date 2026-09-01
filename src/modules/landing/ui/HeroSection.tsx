"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-[#F2F0F1] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10 pb-8 sm:pb-16">
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm text-xs font-semibold text-gray-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Envío gratis · Garantía oficial · Devoluciones 30 días
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-black leading-[1.08] font-sans">
              Encuentra la tecnología que se adapta a tu estilo
            </h1>

            <p className="text-gray-600 text-sm sm:text-base max-w-xl leading-relaxed">
              Explora nuestra colección curada de laptops, monitores, periféricos y
              componentes de alta gama. Stock en tiempo real, precios competitivos
              y entrega garantizada a todo Colombia.
            </p>

            <div>
              <Link href="/#catalogo">
                <button className="w-full sm:w-auto bg-black text-white text-sm sm:text-base font-semibold px-12 py-4 rounded-full hover:bg-black/85 transition-all shadow-md active:scale-95">
                  Comprar ahora
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-300/60 max-w-lg">
              {[
                { value: "200+", label: "Marcas líderes" },
                { value: "2,000+", label: "Productos tech" },
                { value: "30,000+", label: "Pedidos entregados" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <h4 className="text-2xl sm:text-4xl font-extrabold text-black">{value}</h4>
                  <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="absolute top-6 right-4 sm:right-8 text-black z-20 animate-pulse">
              <Sparkles className="w-12 h-12 fill-black stroke-black" />
            </div>
            <div className="absolute bottom-28 left-4 text-black z-20">
              <Sparkles className="w-7 h-7 fill-black stroke-black" />
            </div>
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
  );
}
