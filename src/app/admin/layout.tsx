"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/modules/auth/application/authStore";
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
  LogIn,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DEMO_ACCOUNTS } from "@/core/config/constants";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { getUser, initialized, initialize, signIn, loading } = useAuthStore();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const user = getUser();
  const isAdmin = user?.isAdmin();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const result = await signIn(adminEmail, adminPassword);
    if (result.success) {
      if (result.data.isAdmin()) {
        toast.success(`Acceso concedido al panel administrativo`);
      } else {
        setLoginError("Esta cuenta no tiene privilegios de Administrador.");
      }
    } else {
      setLoginError(result.error as string);
    }
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/productos", label: "Productos & Stock", icon: ShoppingBag },
    { href: "/admin/pedidos", label: "Crear Pedido", icon: PlusCircle },
    { href: "/admin/facturas", label: "Facturas DIAN", icon: ReceiptText },
  ];

  // If not admin, show dedicated professional Admin Portal Login
  if (initialized && !isAdmin) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 bg-[#F2F0F1]">
        <div className="bg-white rounded-[32px] p-8 sm:p-12 max-w-md w-full shadow-2xl border border-gray-200 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center mx-auto text-white shadow-md">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-black font-sans">
                Portal de Administración
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Ingresa con tus credenciales de Administrador para gestionar inventario, pedidos y facturas DIAN.
              </p>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Usuario / Correo
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@techstore.co"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Contraseña
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs text-red-700 font-medium">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-semibold py-3.5 rounded-full hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 text-sm active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              Ingresar al Panel
            </button>
          </form>

          {/* Discreet Admin Auto-fill for test evaluation */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <button
              type="button"
              onClick={() => {
                setAdminEmail(DEMO_ACCOUNTS.admin.email);
                setAdminPassword(DEMO_ACCOUNTS.admin.password);
              }}
              className="text-[11px] text-gray-400 hover:text-black underline"
            >
              Autocompletar credenciales admin de prueba
            </button>
            <Link href="/" className="text-[11px] text-gray-500 hover:text-black font-semibold">
              ← Ir a la tienda
            </Link>
          </div>
        </div>
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
    </div>
  );
}
