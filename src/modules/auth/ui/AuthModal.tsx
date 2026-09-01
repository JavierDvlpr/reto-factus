"use client";

/**
 * Auth Modal — Interactive login form with 1-click demo account switcher.
 * Shows "Ingresar como Administrador" and "Ingresar como Cliente" quick-access buttons.
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
  Zap,
} from "lucide-react";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { signIn, loginAsAdmin, loginAsCustomer, loading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  const handleDemoAdmin = async () => {
    setError(null);
    const result = await loginAsAdmin();
    if (result.success) {
      toast.success(`Bienvenido Administrador 🛡️`, { description: result.data.email });
      onClose();
    } else {
      setError(result.error as string);
    }
  };

  const handleDemoCustomer = async () => {
    setError(null);
    const result = await loginAsCustomer();
    if (result.success) {
      toast.success(`Bienvenido Cliente 🛒`, { description: result.data.email });
      onClose();
    } else {
      setError(result.error as string);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="bg-black text-white p-8 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <LogIn className="w-6 h-6" />
            <h2 className="text-2xl font-extrabold">Iniciar sesión</h2>
          </div>
          <p className="text-gray-400 text-sm">
            Accede a tu cuenta o usa una cuenta demo para explorar la plataforma.
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* Quick Demo Buttons */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Acceso rápido — Cuentas Demo
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDemoAdmin}
                disabled={loading}
                className="flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 border-black bg-black text-white hover:bg-gray-900 transition-all disabled:opacity-60 active:scale-95"
              >
                <Shield className="w-5 h-5" />
                <span className="text-xs font-bold">Administrador</span>
                <span className="text-[10px] text-gray-400">admin@techstore.co</span>
              </button>
              <button
                onClick={handleDemoCustomer}
                disabled={loading}
                className="flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 border-gray-200 hover:border-black hover:bg-gray-50 transition-all disabled:opacity-60 active:scale-95"
              >
                <User className="w-5 h-5" />
                <span className="text-xs font-bold">Cliente</span>
                <span className="text-[10px] text-gray-400">cliente@techstore.co</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">O con tu cuenta</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@empresa.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-semibold py-3.5 rounded-full hover:bg-gray-900 transition-all disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
