"use client";

/**
 * User Menu — Dropdown shown in Navbar when the user is authenticated.
 * Displays role badge, quick links and sign-out button.
 */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "../application/authStore";
import {
  Shield,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  ShoppingBag,
  ReceiptText,
} from "lucide-react";
import { toast } from "sonner";

export default function UserMenu() {
  const { getUser, signOut, loading } = useAuthStore();
  const user = getUser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    toast.info("Sesión cerrada exitosamente");
    setOpen(false);
  };

  const isAdmin = user.isAdmin();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all"
        aria-label="Menú de usuario"
      >
        {/* Avatar */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
            isAdmin ? "bg-black" : "bg-gray-600"
          }`}
        >
          {user.initials}
        </div>

        {/* Role Badge */}
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            isAdmin
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {isAdmin ? "ADMIN" : "CLIENTE"}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Profile Info */}
          <div className="px-4 py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                  isAdmin ? "bg-black" : "bg-gray-600"
                }`}
              >
                {user.initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-black truncate">{user.fullName}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="py-2 px-2">
            {isAdmin && (
              <>
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-black hover:bg-gray-100 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-gray-600" />
                  Panel de Administración
                </Link>
                <Link
                  href="/admin/productos"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-gray-400" />
                  Gestionar Productos
                </Link>
                <Link
                  href="/admin/facturas"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <ReceiptText className="w-4 h-4 text-gray-400" />
                  Facturas DIAN
                </Link>
              </>
            )}

            {!isAdmin && (
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700">
                <User className="w-4 h-4 text-gray-400" />
                Mi cuenta
              </div>
            )}
          </nav>

          {/* Sign Out */}
          <div className="border-t border-gray-100 py-2 px-2">
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 font-semibold hover:bg-red-50 transition-colors"
            >
              {isAdmin ? (
                <Shield className="w-4 h-4" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
