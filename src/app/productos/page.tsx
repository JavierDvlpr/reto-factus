"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { productService } from "@/modules/products/application/ProductService";
import type { Product } from "@/modules/products/domain/Product";
import { PRODUCT_CATEGORIES } from "@/modules/products/domain/Product";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft, Search, Radio, Loader2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

function ProductosContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("cat") || "Todos";
  const initialQuery = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    const data = await productService.getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();

    // Subscribe to realtime product changes
    const unsub = productService.subscribeToChanges((updated) => {
      setProducts(updated.filter((p) => p.isActive));
    });

    return () => unsub();
  }, []);

  // Sync category or query from URL params when they change
  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat && PRODUCT_CATEGORIES.includes(cat as never)) {
      setActiveCategory(cat);
    }
    const q = searchParams.get("q");
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "Todos" || p.category === activeCategory;
    const matchQuery =
      searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="min-h-screen py-10 sm:py-14 px-4 bg-[#F2F0F1]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-black" />
              </button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-black font-sans">
                  Catálogo de Tecnología
                </h1>
                <Badge className="bg-emerald-600 text-white text-[10px] flex items-center gap-1 font-bold">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-white" />
                  REALTIME
                </Badge>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                {products.length} productos con stock disponible y envío inmediato
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por nombre o marca..."
              className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
            />
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
          {PRODUCT_CATEGORIES.map((cat) => (
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
            {filtered.map((product) => {
              const legacyFormat = {
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                originalPrice: product.originalPrice ?? undefined,
                category: product.category,
                description: product.description,
                specs: product.specs,
                image: product.image ?? "",
                stock: product.stock,
                rating: product.rating,
                reviews: product.reviewsCount,
                badge: product.badge ?? undefined,
                isNewArrival: product.isNewArrival,
                isTopSelling: product.isTopSelling,
              };

              return (
                <Link key={product.id} href={`/productos/${product.id}`}>
                  <ProductCard product={legacyFormat} />
                </Link>
              );
            })}
          </div>

          {filtered.length === 0 && !loading && (
            <div className="text-center py-20 text-gray-500 space-y-3">
              <p className="text-base font-semibold">No se encontraron productos.</p>
              <p className="text-xs text-gray-400">Intenta con otra categoría o término de búsqueda.</p>
              <button
                onClick={() => {
                  setActiveCategory("Todos");
                  setSearchQuery("");
                }}
                className="text-xs font-bold text-black underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F2F0F1]">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
        </div>
      }
    >
      <ProductosContent />
    </Suspense>
  );
}
