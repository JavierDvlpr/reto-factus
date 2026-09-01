"use client";

import { useState } from "react";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProductosPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filtered =
    activeCategory === "Todos"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen py-10 sm:py-14 px-4 bg-[#F2F0F1]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-black" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-black font-sans">
                Catálogo completo de tecnología
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {PRODUCTS.length} productos certificados con factura electrónica DIAN
              </p>
            </div>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2.5 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                activeCategory === cat
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No se encontraron productos en esta categoría.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
