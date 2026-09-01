"use client";

import { useState } from "react";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Truck, ReceiptText } from "lucide-react";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filtered =
    activeCategory === "Todos"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-grid py-20 px-4">
        {/* Gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-6 gradient-brand text-white border-0 px-4 py-1.5 text-sm">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Facturación electrónica DIAN incluida
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="gradient-text">Tecnología</span>
            <br />
            <span className="text-foreground">sin límites</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Los mejores productos tech con garantía de factura electrónica DIAN.
            Compra con total seguridad y cumplimiento tributario.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-green-400" />
              Factura electrónica DIAN
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="w-4 h-4 text-blue-400" />
              Envío a toda Colombia
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ReceiptText className="w-4 h-4 text-purple-400" />
              Soporte post-venta
            </div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Category filter */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              id={`filter-${cat.toLowerCase()}`}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className={
                activeCategory === cat
                  ? "gradient-brand text-white border-0 shrink-0"
                  : "shrink-0"
              }
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No hay productos en esta categoría
          </div>
        )}
      </section>
    </div>
  );
}
