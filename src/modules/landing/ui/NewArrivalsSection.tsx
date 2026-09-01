"use client";

import Link from "next/link";
import type { Product } from "@/modules/products/domain/Product";
import ProductCard from "@/components/ProductCard";

interface NewArrivalsSectionProps {
  products: Product[];
}

export default function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  // Convert Product domain entities to legacy format for ProductCard (which still uses legacy type)
  const legacyProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    category: p.category,
    description: p.description,
    specs: p.specs,
    image: p.image ?? "",
    stock: p.stock,
    rating: p.rating,
    reviews: p.reviewsCount,
    badge: p.badge ?? undefined,
    isNewArrival: p.isNewArrival,
    isTopSelling: p.isTopSelling,
  }));

  return (
    <section id="nuevas-llegadas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-black font-sans">
          Nuevas llegadas
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {legacyProducts.map((product) => (
          <Link key={product.id} href={`/productos/${product.id}`}>
            <ProductCard product={product} />
          </Link>
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
  );
}
