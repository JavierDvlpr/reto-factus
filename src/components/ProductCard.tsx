"use client";

import { Product, formatCOP } from "@/lib/products";
import { useCartStore } from "@/lib/store";
import { Star, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} agregado al carrito`, {
      description: formatCOP(product.price),
    });
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="group flex flex-col gap-3">
      {/* Image container */}
      <div className="relative aspect-square w-full rounded-[20px] bg-[#F0EEED] overflow-hidden flex items-center justify-center p-4">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-5xl select-none">💻</div>
        )}

        {/* Quick add floating button on hover */}
        <button
          onClick={handleAdd}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          title="Agregar al carrito"
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>

      {/* Details */}
      <div className="space-y-1">
        <h3 className="font-bold text-base text-black line-clamp-1 group-hover:underline cursor-pointer">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
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
          <span className="text-xs text-gray-500 font-medium">
            {product.rating}/<span className="text-gray-400">5</span>
          </span>
        </div>

        {/* Prices */}
        <div className="flex items-center gap-2.5 pt-1">
          <span className="text-lg sm:text-xl font-extrabold text-black">
            {formatCOP(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm sm:text-base font-bold text-gray-400 line-through">
              {formatCOP(product.originalPrice)}
            </span>
          )}
          {discount && (
            <span className="text-xs font-semibold text-[#FF3333] bg-[#FF3333]/10 px-2.5 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
