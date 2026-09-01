"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/application/authStore";
import Link from "next/link";
import { Shield, Lock, ArrowLeft } from "lucide-react";

export default function FacturasRedirectPage() {
  const router = useRouter();
  const { getUser, initialized, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const user = getUser();
  const isAdmin = user?.isAdmin();

  useEffect(() => {
    if (initialized && isAdmin) {
      router.replace("/admin/facturas");
    }
  }, [initialized, isAdmin, router]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center py-16 bg-[#F2F0F1]">
      <div className="bg-white rounded-[32px] p-8 sm:p-12 max-w-md shadow-xl border border-gray-200 space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-700">
          <Lock className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            Acceso Administrativo
          </span>
          <h1 className="text-2xl font-extrabold text-black mt-3">
            Historial de Facturas DIAN
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Por disposición de seguridad y privacidad, el historial general de facturas electrónicas solo está disponible para usuarios Administradores.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/admin/facturas">
            <button className="w-full bg-black text-white font-semibold py-3.5 rounded-full hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-md">
              <Shield className="w-4 h-4" />
              Ingresar al Panel de Facturas Admin
            </button>
          </Link>

          <Link href="/">
            <button className="w-full py-3 rounded-full border border-gray-300 text-sm font-semibold text-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver a la tienda
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
