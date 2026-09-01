"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Zap, Menu, X, Package, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store";
import CartDrawer from "@/components/CartDrawer";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const totalItems = useCartStore((s) => s.getTotalItems());

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center glow-brand">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="font-bold text-lg gradient-text hidden sm:block">
                TechStore CO
              </span>
            </Link>

            {/* Nav links (desktop) */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Catálogo
              </Link>
              <Link
                href="/facturas"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ReceiptText className="w-4 h-4" />
                Facturas
              </Link>
              <Link
                href="/productos"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Package className="w-4 h-4" />
                Productos
              </Link>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setCartOpen(true)}
                aria-label="Abrir carrito"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs gradient-brand border-0">
                    {totalItems > 9 ? "9+" : totalItems}
                  </Badge>
                )}
              </Button>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menú"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden border-t border-border/50 py-3 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                Catálogo
              </Link>
              <Link
                href="/facturas"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                Facturas
              </Link>
              <Link
                href="/productos"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                Productos
              </Link>
            </div>
          )}
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
