"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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
      <SheetContent className="w-full sm:max-w-md flex flex-col gap-0 p-0 bg-card border-border">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Carrito
            {items.length > 0 && (
              <span className="ml-auto text-sm text-muted-foreground font-normal">
                {items.reduce((s, i) => s + i.quantity, 0)} producto(s)
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground">Tu carrito está vacío</p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  Agrega productos para comenzar
                </p>
              </div>
              <Button variant="outline" onClick={onClose}>
                Ver catálogo
              </Button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 rounded-xl bg-muted/40 border border-border/50"
              >
                {/* Product image placeholder */}
                <div className="w-16 h-16 rounded-lg bg-accent flex-shrink-0 overflow-hidden flex items-center justify-center">
                  <div className="text-2xl">💻</div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {formatCOP(product.price)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-auto text-destructive hover:text-destructive"
                      onClick={() => removeItem(product.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCOP(total)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">IVA (19%)</span>
              <span>{formatCOP(total * 0.19)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary text-lg">{formatCOP(total * 1.19)}</span>
            </div>
            <Link href="/checkout" onClick={onClose} className="block">
              <Button className="w-full gradient-brand text-white border-0 gap-2">
                Ir al checkout
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
