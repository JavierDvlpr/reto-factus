"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { productService } from "@/modules/products/application/ProductService";
import type { Product } from "@/modules/products/domain/Product";
import { useCartStore } from "@/lib/store";
import { ShoppingBag, Star, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { formatCOP } from "@/lib/products";

interface RelatedProductsWidgetProps {
  productIds: string[];
}

export default function RelatedProductsWidget({
  productIds,
}: RelatedProductsWidgetProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!productIds || productIds.length === 0) {
      setLoading(false);
      return;
    }

    const load = async () => {
      const items: Product[] = [];
      for (const id of productIds) {
        const prod = await productService.getProductById(id);
        if (prod) items.push(prod);
      }
      setProducts(items);
      setLoading(false);
    };

    load();
  }, [productIds]);

  if (loading || products.length === 0) return null;

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product.toLegacy());
    toast.success(`${product.name} agregado al carrito`, {
      description: product.formattedPrice,
    });
  };

  return (
    <div className="my-12 p-6 sm:p-8 rounded-[28px] bg-[#F2F0F1] border border-gray-200/80 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-base sm:text-lg text-black">
              Hardware recomendado en este artículo
            </h4>
            <p className="text-xs text-gray-500">
              Disponible en nuestra tienda oficial con envío a todo Colombia
            </p>
          </div>
        </div>
        <Link
          href="/productos"
          className="text-xs font-bold text-black hover:underline flex items-center gap-1"
        >
          Ver todo el catálogo
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-black/20"
          >
            {/* Thumbnail */}
            <div className="relative w-20 h-20 rounded-xl bg-[#F0EEED] overflow-hidden shrink-0 flex items-center justify-center p-2">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-1"
                />
              ) : (
                <span className="text-2xl">💻</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <Link href={`/productos/${product.id}`} className="block">
                <p className="font-bold text-sm text-black truncate hover:underline">
                  {product.name}
                </p>
              </Link>
              <p className="text-xs text-gray-500 font-medium">{product.brand}</p>

              <div className="flex items-center justify-between pt-1">
                <span className="font-extrabold text-sm text-black">
                  {product.formattedPrice}
                </span>

                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="bg-black text-white text-xs font-semibold px-3.5 py-1.5 rounded-full hover:bg-gray-800 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                  title="Agregar al carrito"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Comprar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
