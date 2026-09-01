"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  ReceiptText,
  User,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store";
import CartDrawer from "@/components/CartDrawer";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const totalItems = useCartStore((s) => s.getTotalItems());

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4 sm:gap-8">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-black hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Abrir menú de navegación"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center gap-1.5">
              <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-black font-sans">
                Tech.co
              </span>
            </Link>

            {/* Desktop Navigation links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
              <Link
                href="/#catalogo"
                className="hover:text-black transition-colors flex items-center gap-1"
              >
                Tienda
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </Link>
              <Link
                href="/#nuevas-llegadas"
                className="hover:text-black transition-colors"
              >
                Nuevas llegadas
              </Link>
              <Link
                href="/#mas-vendidos"
                className="hover:text-black transition-colors"
              >
                Más vendidos
              </Link>
              <Link
                href="/facturas"
                className="hover:text-black transition-colors flex items-center gap-1 text-emerald-700 font-semibold"
              >
                <ReceiptText className="w-4 h-4" />
                Facturas DIAN
              </Link>
            </nav>

            {/* Search Bar (Center) */}
            <div className="hidden md:flex flex-1 max-w-lg items-center relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar laptops, monitores, periféricos..."
                className="w-full bg-[#F0F0F0] text-black text-sm rounded-full pl-11 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-black/10 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setCartOpen(true)}
                className="p-2.5 text-black hover:bg-gray-100 rounded-full transition-colors relative"
                aria-label="Ver carrito de compras"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-black text-white border-0 font-bold">
                    {totalItems > 9 ? "9+" : totalItems}
                  </Badge>
                )}
              </button>

              <Link
                href="/facturas"
                className="p-2.5 text-black hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
                title="Historial de facturas electrónicas"
              >
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="md:hidden pb-4">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tecnología..."
                className="w-full bg-[#F0F0F0] text-black text-sm rounded-full pl-11 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-black/10 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {mobileOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4 space-y-2">
              <Link
                href="/#catalogo"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 rounded-lg"
              >
                Tienda completa
              </Link>
              <Link
                href="/#nuevas-llegadas"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 rounded-lg"
              >
                Nuevas llegadas
              </Link>
              <Link
                href="/#mas-vendidos"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 rounded-lg"
              >
                Más vendidos
              </Link>
              <Link
                href="/facturas"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-base font-semibold text-emerald-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
              >
                <ReceiptText className="w-5 h-5" />
                Historial de facturas DIAN
              </Link>
            </div>
          )}
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
