"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/store";
import { formatCOP } from "@/lib/products";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const total = getTotalPrice();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col gap-0 p-0 bg-white text-black border-l border-gray-200">
        <SheetHeader className="p-6 border-b border-gray-200">
          <SheetTitle className="flex items-center gap-2 text-black font-extrabold text-xl font-sans">
            <ShoppingBag className="w-5 h-5 text-black" />
            Tu carrito
            {items.length > 0 && (
              <span className="ml-auto text-xs text-gray-500 font-semibold bg-gray-100 px-2.5 py-1 rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-72 text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#F0F0F0] flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="font-bold text-base text-black">Tu carrito está vacío</p>
                <p className="text-sm text-gray-500 mt-1">
                  Agrega productos desde el catálogo para facturar
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 bg-black text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-black/85 transition-colors"
              >
                Ver productos
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-4 p-4 rounded-[16px] bg-[#F0EEED] border border-gray-200/50"
              >
                {/* Product thumbnail */}
                <div className="w-18 h-18 rounded-[12px] bg-white flex-shrink-0 overflow-hidden relative p-1">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      💻
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-black truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">{product.brand}</p>
                    </div>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-[#FF3333] hover:text-[#FF3333]/80 p-1 transition-colors"
                      title="Eliminar producto"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-extrabold text-black">
                      {formatCOP(product.price)}
                    </span>

                    {/* Quantity controls matching Shop.co pill */}
                    <div className="flex items-center gap-2 bg-[#F0F0F0] px-2.5 py-1 rounded-full border border-gray-200">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-0.5 text-black hover:text-gray-600 transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-0.5 text-black hover:text-gray-600 transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer breakdown */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-white space-y-4 shadow-lg">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal neto</span>
                <span className="font-semibold text-black">{formatCOP(total)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>IVA (19.00%)</span>
                <span className="font-semibold text-black">{formatCOP(total * 0.19)}</span>
              </div>
              <Separator className="bg-gray-200" />
              <div className="flex items-center justify-between text-base font-extrabold text-black pt-1">
                <span>Total estimado</span>
                <span className="text-xl">{formatCOP(total * 1.19)}</span>
              </div>
            </div>

            <Link href="/checkout" onClick={onClose} className="block">
              <button className="w-full bg-black text-white font-semibold text-sm py-4 rounded-full flex items-center justify-center gap-2 hover:bg-black/85 transition-all shadow-md active:scale-95">
                Continuar con la compra
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
