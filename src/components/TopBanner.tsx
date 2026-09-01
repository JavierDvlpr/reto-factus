"use client";

import { useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function TopBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-black text-white text-xs sm:text-sm py-2 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center relative pr-8">
        <p className="flex items-center gap-1.5 font-normal">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 inline" />
          <span>
            Compra tecnología con <strong>facturación electrónica DIAN</strong> en tiempo real.
          </span>
          <Link
            href="/checkout"
            className="underline font-semibold ml-1 hover:text-gray-200 transition-colors"
          >
            Pruébalo ahora
          </Link>
        </p>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
          aria-label="Cerrar anuncio"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
