"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  ReceiptText,
  User as UserIcon,
  Shield,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/modules/auth/ui/AuthModal";
import UserMenu from "@/modules/auth/ui/UserMenu";
import { useAuthStore } from "@/modules/auth/application/authStore";

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const totalItems = useCartStore((s) => s.getTotalItems());
  const { getUser, initialized, initialize } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    initialize();
  }, [initialize]);

  const user = mounted ? getUser() : null;
  const isAdmin = Boolean(mounted && user?.isAdmin());
  const displayTotalItems = mounted ? totalItems : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/productos?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
            <Link href="/" className="shrink-0 flex items-center gap-2">
              <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-black font-sans">
                TechStore
              </span>
            </Link>

            {/* Desktop Navigation links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
              <Link
                href="/productos"
                className="hover:text-black transition-colors"
              >
                Catálogo
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
                href="/blog"
                className="hover:text-black transition-colors font-semibold"
              >
                Blog
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="hover:text-black transition-colors flex items-center gap-1.5 text-black font-bold bg-gray-100 px-3 py-1.5 rounded-full"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Admin Panel
                </Link>
              )}
            </nav>

            {/* Search Bar (Center) */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg items-center relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar laptops, monitores, periféricos..."
                className="w-full bg-[#F0F0F0] text-black text-sm rounded-full pl-11 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-black/10 transition-all placeholder:text-gray-400"
              />
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setCartOpen(true)}
                className="p-2.5 text-black hover:bg-gray-100 rounded-full transition-colors relative"
                aria-label="Ver carrito de compras"
              >
                <ShoppingCart className="w-5 h-5" />
                {displayTotalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-black text-white border-0 font-bold">
                    {displayTotalItems > 9 ? "9+" : displayTotalItems}
                  </Badge>
                )}
              </button>

              {/* User Menu / Login Button */}
              {user ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-2 bg-black text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-900 transition-all shadow-sm active:scale-95"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Ingresar</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile search bar */}
          <form onSubmit={handleSearchSubmit} className="md:hidden pb-4">
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
          </form>

          {/* Mobile menu dropdown */}
          {mobileOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4 space-y-2">
              <Link
                href="/productos"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 rounded-lg"
              >
                Catálogo completo
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
                href="/blog"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-base font-bold text-black hover:bg-gray-100 rounded-lg"
              >
                Blog & Guías Tech
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-base font-bold text-black bg-gray-100 rounded-lg flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Panel de Administración
                </Link>
              )}

              {!user && (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 text-base font-semibold text-black hover:bg-gray-100 rounded-lg flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  Iniciar sesión (Demo)
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
