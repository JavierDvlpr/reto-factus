"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Por favor ingresa un correo válido");
      return;
    }
    setSubscribed(true);
    toast.success("¡Gracias por suscribirte!", {
      description: "Recibirás nuestras promociones y novedades tecnológicas.",
    });
    setEmail("");
  };

  return (
    <div className="bg-black text-white rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7">
          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Mantente al día con nuestras últimas ofertas y novedades tech
          </h3>
          <p className="text-gray-400 text-sm mt-2">
            Descuentos exclusivos en hardware y tutoriales sobre facturación electrónica en Colombia.
          </p>
        </div>
        <div className="lg:col-span-5 space-y-3">
          {subscribed ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full px-6 py-4 flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ¡Te has suscrito con éxito!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo electrónico"
                  className="w-full bg-white text-black rounded-full pl-12 pr-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-400 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white text-black font-semibold text-sm rounded-full py-3 hover:bg-gray-100 transition-colors shadow-sm active:scale-[0.99]"
              >
                Suscribirme al boletín
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
