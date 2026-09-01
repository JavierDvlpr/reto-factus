import { PRODUCTS, CATEGORIES } from "@/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo de Productos — TechStore CO",
  description: "Explora toda nuestra gama de productos tecnológicos en TechStore CO",
};

export default function ProductosPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Catálogo completo</h1>
          <p className="text-muted-foreground mt-2">
            {PRODUCTS.length} productos disponibles en {CATEGORIES.length - 1} categorías
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              className="glass border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-primary bg-primary/10 rounded-md px-2 py-0.5">
                      {p.category}
                    </span>
                    {p.badge && (
                      <span className="text-xs text-muted-foreground">{p.badge}</span>
                    )}
                  </div>
                  <h2 className="font-semibold text-sm">{p.name}</h2>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {p.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-primary">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(p.price)}
                  </p>
                  <p className="text-xs text-muted-foreground">{p.stock} en stock</p>
                </div>
              </div>

              {/* Specs */}
              <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-2 gap-1">
                {Object.entries(p.specs)
                  .slice(0, 4)
                  .map(([key, val]) => (
                    <div key={key} className="text-xs">
                      <span className="text-muted-foreground">{key}: </span>
                      <span className="text-foreground/80">{val}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
