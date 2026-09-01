"use client";

import { Product, formatCOP } from "@/lib/products";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Star, Zap } from "lucide-react";
import { toast } from "sonner";

const PRODUCT_EMOJIS: Record<string, string> = {
  Laptops: "💻",
  Monitores: "🖥️",
  Audio: "🎧",
  Periféricos: "🖱️",
  Tablets: "📱",
  Componentes: "⚡",
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const emoji = PRODUCT_EMOJIS[product.category] || "📦";
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAdd = () => {
    addItem(product);
    toast.success(`${product.name} agregado al carrito`, {
      description: formatCOP(product.price),
    });
  };

  return (
    <Card className="card-hover group relative flex flex-col bg-card border-border overflow-hidden">
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="gradient-brand text-white border-0 text-xs">
            {product.badge}
          </Badge>
        </div>
      )}
      {discount > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="destructive" className="text-xs">
            -{discount}%
          </Badge>
        </div>
      )}

      {/* Image area */}
      <div className="relative h-48 bg-gradient-to-br from-muted to-accent flex items-center justify-center overflow-hidden">
        <div className="text-7xl transition-transform duration-300 group-hover:scale-110 select-none">
          {emoji}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {product.brand}
          </p>
          <h3 className="font-semibold text-sm leading-snug mt-0.5 line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {product.rating} ({product.reviews.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-2 mt-auto">
          <span className="text-lg font-bold text-primary">
            {formatCOP(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through mb-0.5">
              {formatCOP(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Stock */}
        {product.stock <= 5 && (
          <p className="text-xs text-amber-400 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Solo {product.stock} en stock
          </p>
        )}

        {/* CTA */}
        <Button
          id={`add-to-cart-${product.id}`}
          onClick={handleAdd}
          className="w-full gap-2 gradient-brand text-white border-0 mt-1"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4" />
          Agregar al carrito
        </Button>
      </div>
    </Card>
  );
}
