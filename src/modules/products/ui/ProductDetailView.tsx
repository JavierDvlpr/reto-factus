"use client";

/**
 * Product Detail View — Full product page component.
 * Shows gallery, specs, stock badge, quantity selector and add-to-cart.
 */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "../domain/Product";
import { useCartStore } from "@/lib/store";
import {
  Star,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Package,
  ChevronRight,
  Minus,
  Plus,
  Shield,
  Truck,
  ReceiptText,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAdd = async () => {
    if (!product.canAddToCart(qty)) {
      toast.error(`Solo hay ${product.stock} unidades disponibles`);
      return;
    }
    setAddingToCart(true);
    // Slight delay for the animation feel
    await new Promise((r) => setTimeout(r, 400));
    // We pass a legacy-compatible product to the existing cart store
    addItem({
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
    });
    toast.success(`${product.name} agregado al carrito`, {
      description: `${qty} unidad(es) — ${product.formattedPrice}`,
    });
    setAddingToCart(false);
  };

  const stockStatus = product.stockStatus;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-black transition-colors">Inicio</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/productos" className="hover:text-black transition-colors">Productos</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left — Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-[28px] bg-[#F0EEED] overflow-hidden flex items-center justify-center p-8">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-8"
                />
              ) : (
                <span className="text-8xl select-none">💻</span>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <span className="bg-[#FF3333] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="bg-black text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    Nuevo
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right — Details */}
          <div className="space-y-6">
            {/* Brand & Category */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-semibold">
                {product.brand}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
            </div>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-black leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-[#FFC633] fill-[#FFC633]"
                        : "text-gray-300 fill-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {product.rating}/5
              </span>
              <span className="text-sm text-gray-500">
                ({product.reviewsCount} reseñas)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-extrabold text-black">
                {product.formattedPrice}
              </span>
              {product.formattedOriginalPrice && (
                <span className="text-xl text-gray-400 line-through font-semibold">
                  {product.formattedOriginalPrice}
                </span>
              )}
              {product.discountPercentage && (
                <span className="text-sm font-bold text-[#FF3333] bg-[#FF3333]/10 px-3 py-1 rounded-full">
                  -{product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Stock Status */}
            <div className={`flex items-center gap-2 text-sm font-semibold ${
              stockStatus === "out" ? "text-red-600" :
              stockStatus === "low" ? "text-amber-600" : "text-emerald-600"
            }`}>
              {stockStatus === "out" ? (
                <><Package className="w-4 h-4" /> Agotado</>
              ) : stockStatus === "low" ? (
                <><AlertTriangle className="w-4 h-4" /> Solo {product.stock} en stock</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> En stock ({product.stock} unidades)</>
              )}
            </div>

            {/* Quantity Selector */}
            {product.isInStock() && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-700">Cantidad:</span>
                <div className="flex items-center gap-3 bg-[#F0F0F0] rounded-full px-2 py-1">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={!product.isInStock() || addingToCart}
                className="flex-1 bg-black text-white font-semibold py-4 rounded-full hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {addingToCart ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShoppingBag className="w-5 h-5" />
                )}
                {product.isInStock() ? "Agregar al carrito" : "Agotado"}
              </button>
              <Link href="/checkout">
                <button
                  disabled={!product.isInStock()}
                  className="px-6 py-4 rounded-full border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  Comprar ya
                </button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              {[
                { icon: Shield, label: "Garantía oficial" },
                { icon: Truck, label: "Envío rápido" },
                { icon: ReceiptText, label: "Factura DIAN" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gray-700" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* Specs Table */}
            <div className="bg-[#F0F0F0] rounded-[20px] p-6">
              <h3 className="font-bold text-sm text-black uppercase tracking-wider mb-4 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Especificaciones técnicas
              </h3>
              <div className="space-y-2.5">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex items-start justify-between gap-4 text-sm">
                    <span className="text-gray-500 font-medium shrink-0">{key}</span>
                    <span className="text-black font-semibold text-right">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Back link */}
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
