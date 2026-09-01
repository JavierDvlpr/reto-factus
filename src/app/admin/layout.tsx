"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/modules/auth/application/authStore";
import AuthModal from "@/modules/auth/ui/AuthModal";
import {
  LayoutDashboard,
  ShoppingBag,
  ReceiptText,
  PlusCircle,
  Shield,
  ArrowLeft,
  Zap,
  Lock,
  Radio,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { getUser, initialized, initialize } = useAuthStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const user = getUser();
  const isAdmin = user?.isAdmin();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/productos", label: "Productos & Stock", icon: ShoppingBag },
    { href: "/admin/pedidos", label: "Crear Pedido", icon: PlusCircle },
    { href: "/admin/facturas", label: "Facturas DIAN", icon: ReceiptText },
  ];

  // If not admin, show Access Denied / Login prompt
  if (initialized && !isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center bg-[#F2F0F1]">
        <div className="bg-white rounded-[32px] p-8 sm:p-12 max-w-md shadow-xl border border-gray-200 space-y-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
            <Lock className="w-10 h-10" />
          </div>
          <div>
            <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              Acceso Restringido
            </span>
            <h2 className="text-2xl font-extrabold text-black mt-3">
              Solo para Administradores
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Esta sección requiere permisos de Administrador para gestionar inventario, emitir pedidos y consultar facturas DIAN.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="w-full bg-black text-white font-semibold py-3.5 rounded-full hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <Shield className="w-4 h-4" />
              Iniciar sesión como Administrador
            </button>

            <Link href="/">
              <button className="w-full py-3 rounded-full border border-gray-300 text-sm font-semibold text-black hover:bg-gray-50 transition-colors">
                Volver a la tienda
              </button>
            </Link>
          </div>
        </div>

        <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F0F1] flex flex-col lg:flex-row">
      {/* Sidebar (Desktop) */}
      <aside className="w-full lg:w-72 bg-white border-r border-gray-200 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-black leading-tight">Admin Panel</h3>
                <p className="text-[11px] text-gray-500 font-medium">TechStore CO</p>
              </div>
            </div>
            <Badge className="bg-emerald-600 text-white text-[10px] flex items-center gap-1 font-bold">
              <Radio className="w-2.5 h-2.5 animate-pulse text-white" />
              LIVE
            </Badge>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    active
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-white" : "text-gray-400"}`} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Back to store link */}
        <div className="pt-6 border-t border-gray-100 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
            <Zap className="w-3.5 h-3.5" />
            Sincronización en tiempo real activa
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la tienda pública
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-x-hidden">
        {children}
      </main>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
