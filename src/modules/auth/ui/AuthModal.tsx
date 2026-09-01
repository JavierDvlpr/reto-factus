"use client";

/**
 * Auth Modal — Realistic authentication modal for customers and admins.
 * Provides clean Sign In / Register tabs and discrete test credentials helper.
 */

import { useState } from "react";
import { useAuthStore } from "../application/authStore";
import {
  Shield,
  User,
  Mail,
  Lock,
  Loader2,
  X,
  LogIn,
  UserPlus,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import { DEMO_ACCOUNTS } from "@/core/config/constants";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export default function AuthModal({
  open,
  onClose,
  title,
  subtitle,
}: AuthModalProps) {
  const { signIn, loading } = useAuthStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showDemoHint, setShowDemoHint] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await signIn(email, password);
    if (result.success) {
      toast.success(`Bienvenido, ${result.data.fullName}`);
      onClose();
    } else {
      setError(result.error as string);
    }
  };

  const handleFillDemo = (type: "admin" | "customer") => {
    if (type === "admin") {
      setEmail(DEMO_ACCOUNTS.admin.email);
      setPassword(DEMO_ACCOUNTS.admin.password);
    } else {
      setEmail(DEMO_ACCOUNTS.customer.email);
      setPassword(DEMO_ACCOUNTS.customer.password);
    }
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition-colors z-10 text-gray-500"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-b from-gray-900 to-black text-white p-8 pb-6">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              {mode === "login" ? <LogIn className="w-4 h-4 text-emerald-400" /> : <UserPlus className="w-4 h-4 text-emerald-400" />}
            </div>
            <h2 className="text-2xl font-extrabold">
              {title || (mode === "login" ? "Iniciar sesión" : "Crear cuenta")}
            </h2>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">
            {subtitle || "Accede para gestionar tus compras y facturas electrónicas DIAN."}
          </p>

          {/* Mode Switcher */}
          <div className="flex bg-white/10 rounded-xl p-1 mt-5">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === "login"
                  ? "bg-white text-black shadow"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === "register"
                  ? "bg-white text-black shadow"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Registrarse
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@correo.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs text-red-700 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-semibold py-3.5 rounded-full hover:bg-gray-900 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md active:scale-[0.98] text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === "login" ? (
                <LogIn className="w-4 h-4" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {mode === "login" ? "Ingresar a mi cuenta" : "Crear cuenta"}
            </button>
          </form>

          {/* Discreet Demo Helper Pill (Collapsible) */}
          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowDemoHint(!showDemoHint)}
              className="text-[11px] text-gray-500 hover:text-black flex items-center justify-between w-full font-medium"
            >
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-gray-400" />
                ¿Deseas autorrellenar cuentas de prueba?
              </span>
              <span className="text-gray-400">{showDemoHint ? "▲" : "▼"}</span>
            </button>

            {showDemoHint && (
              <div className="grid grid-cols-2 gap-2 mt-3 animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => handleFillDemo("admin")}
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-black bg-gray-50 hover:bg-white transition-all text-left"
                >
                  <div className="flex items-center gap-1 text-[11px] font-bold text-black">
                    <Shield className="w-3 h-3 text-black" />
                    Admin
                  </div>
                  <p className="text-[10px] text-gray-500 truncate mt-0.5">
                    admin@techstore.co
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleFillDemo("customer")}
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-black bg-gray-50 hover:bg-white transition-all text-left"
                >
                  <div className="flex items-center gap-1 text-[11px] font-bold text-black">
                    <User className="w-3 h-3 text-gray-700" />
                    Cliente
                  </div>
                  <p className="text-[10px] text-gray-500 truncate mt-0.5">
                    cliente@techstore.co
                  </p>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
