"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/lib/store";
import { useAuthStore } from "@/modules/auth/application/authStore";
import { formatCOP } from "@/lib/products";
import { MUNICIPIOS } from "@/core/config/constants";
import { billingService, type IssuedInvoiceResult } from "@/modules/billing/application/BillingService";
import PaymentSimulationModal from "@/modules/orders/ui/PaymentSimulationModal";
import AuthModal from "@/modules/auth/ui/AuthModal";
import type { PaymentMethodCode } from "@/modules/orders/application/PaymentSimulationService";
import {
  CreditCard,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  User,
  Lock,
  ShoppingBag,
  LogIn,
  Package,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  names: z.string().min(3, "Ingresa tu nombre completo"),
  identification: z.string().min(6, "Ingresa un número de documento válido"),
  email: z.string().email("Correo electrónico no válido"),
  phone: z.string().min(7, "Teléfono requerido (mín. 7 dígitos)"),
  address: z.string().min(5, "Dirección requerida"),
  municipality_id: z.string().min(1, "Selecciona un municipio"),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { getUser, initialize, initialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const user = getUser();

  const [loading, setLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [invoiceResult, setInvoiceResult] = useState<IssuedInvoiceResult | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [savedFormData, setSavedFormData] = useState<FormData | null>(null);

  const total = getTotalPrice();
  const totalWithIVA = total * 1.19;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      names: user?.fullName || "",
      email: user?.email || "",
      municipality_id: "11001",
    },
  });

  // Keep form synchronized when user logs in
  useEffect(() => {
    if (user) {
      if (user.fullName) setValue("names", user.fullName);
      if (user.email) setValue("email", user.email);
    }
  }, [user, setValue]);

  // ─── Empty Cart State ───────────────────────────────────────────────────────
  if (items.length === 0 && !invoiceResult) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center py-16">
        <div className="w-20 h-20 rounded-full bg-[#F0F0F0] flex items-center justify-center text-3xl mb-4">
          🛒
        </div>
        <h2 className="text-2xl font-extrabold text-black">Tu carrito está vacío</h2>
        <p className="text-gray-500 mt-2 max-w-sm text-sm">
          Agrega productos desde la tienda para proceder con el pago y envío de tu pedido.
        </p>
        <Link href="/productos" className="mt-6">
          <button className="bg-black text-white font-semibold px-8 py-3.5 rounded-full hover:bg-black/85 transition-colors">
            ← Volver al catálogo
          </button>
        </Link>
      </div>
    );
  }

  // ─── Order Confirmed Success Screen ─────────────────────────────────────────
  if (invoiceResult) {
    return (
      <div className="min-h-screen py-16 px-4 bg-[#F2F0F1]">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-xl border border-gray-200 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Pago confirmado
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-3">
                ¡Pedido realizado con éxito!
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Recibirás un correo de confirmación con los detalles de tu envío.
              </p>
            </div>

            {/* Order summary */}
            <div className="bg-[#F0EEED] rounded-[20px] p-6 space-y-3 text-left">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Número de pedido</span>
                <span className="font-extrabold text-black font-mono">#{invoiceResult.number}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Referencia</span>
                <span className="font-mono text-xs text-gray-700">{invoiceResult.reference_code}</span>
              </div>
              {invoiceResult.totals?.total && (
                <div className="flex justify-between items-center text-sm border-t border-gray-300/60 pt-2">
                  <span className="text-black font-bold">Total pagado (IVA incluido)</span>
                  <span className="font-extrabold text-base text-black">
                    {formatCOP(Number(invoiceResult.totals.total))}
                  </span>
                </div>
              )}
            </div>

            {/* Delivery info */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left">
              <Package className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-800">En preparación</p>
                <p className="text-xs text-blue-600 mt-0.5">Tu pedido será despachado en 1-2 días hábiles. Recibirás el número de guía por correo.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <Link href="/productos">
                <button className="w-full bg-black text-white font-semibold py-4 rounded-full hover:bg-black/85 transition-colors shadow-md active:scale-[0.98]">
                  Seguir comprando
                </button>
              </Link>
              <Link href="/">
                <button className="w-full py-3.5 rounded-full border border-gray-300 text-sm font-semibold text-black hover:bg-gray-50 transition-colors">
                  Volver al inicio
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Step 1: Form Submit -> Open Payment Simulation ─────────────────────────
  const onFormSubmit = (data: FormData) => {
    setSavedFormData(data);
    setPaymentModalOpen(true);
  };

  // ─── Step 2: Payment Simulation Approved -> Issue Invoice ───────────────────
  const handlePaymentApproved = async (transactionId: string, methodCode: PaymentMethodCode) => {
    if (!savedFormData) return;
    setLoading(true);
    toast.loading("Confirmando pedido y procesando orden...", { id: "factus-loading" });

    const orderItems = items.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      productPrice: i.product.price,
      quantity: i.quantity,
      subtotal: i.product.price * i.quantity,
    }));

    const result = await billingService.issueInvoice({
      userId: user?.id || null,
      customer: {
        names: savedFormData.names,
        email: savedFormData.email,
        phone: savedFormData.phone,
        identification: savedFormData.identification,
        address: savedFormData.address,
        municipalityCode: savedFormData.municipality_id,
      },
      items: orderItems,
      paymentMethod: methodCode,
    });

    toast.dismiss("factus-loading");

    if (result.success) {
      toast.success("¡Pedido confirmado exitosamente!");
      clearCart();
      setInvoiceResult(result.data);
    } else {
      toast.error(result.error as string);
    }
    setLoading(false);
  };

  const inputClass = "w-full bg-[#F0F0F0] border-0 rounded-2xl px-4 py-3.5 text-sm text-black placeholder:text-gray-400 focus:ring-2 focus:ring-black outline-none transition-all";
  const labelClass = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5";

  return (
    <div className="min-h-screen py-10 sm:py-14 px-4 bg-[#F2F0F1]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/productos">
              <button className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-black" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-black font-sans">
                Finalizar compra
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm">
                Compra segura · Envío confirmado
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Pago 100% seguro y encriptado
          </div>
        </div>

        {/* Customer Auth Prompt if guest */}
        {!user && (
          <div className="mb-6 bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">
                  ¿Ya tienes una cuenta de cliente?
                </p>
                <p className="text-xs text-gray-500">
                  Inicia sesión para autocompletar tus datos fiscales y guardar tu factura.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-gray-900 transition-all shrink-0 flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              Iniciar sesión
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-[32px] p-6 sm:p-10 border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <User className="w-5 h-5 text-black" />
              <h2 className="text-lg font-bold text-black">Datos de envío y facturación</h2>
            </div>

            <form id="checkout-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className={labelClass}>Nombre completo / Razón Social *</label>
                <input {...register("names")} placeholder="Ej. Juan Pérez o Tech Solutions SAS" className={inputClass} />
                {errors.names && <p className="text-xs text-red-500">{errors.names.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelClass}>Cédula (CC) o NIT *</label>
                  <input {...register("identification")} placeholder="Ej. 1020304050" className={inputClass} />
                  {errors.identification && <p className="text-xs text-red-500">{errors.identification.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Teléfono móvil *</label>
                  <input {...register("phone")} placeholder="Ej. 3001234567" className={inputClass} />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Correo electrónico *</label>
                <input {...register("email")} type="email" placeholder="correo@empresa.com" className={inputClass} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Dirección de entrega *</label>
                <input {...register("address")} placeholder="Ej. Calle 100 # 15-20 Apto 402" className={inputClass} />
                {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Ciudad / Municipio *</label>
                <select {...register("municipality_id")} className={inputClass}>
                  {MUNICIPIOS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>

          {/* Right Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-black border-b border-gray-100 pb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-black" />
                Resumen del pedido ({items.length} {items.length === 1 ? "ítem" : "ítems"})
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl bg-[#F0EEED] overflow-hidden shrink-0 flex items-center justify-center">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                      ) : (
                        <span>💻</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-black truncate">{product.name}</p>
                      <p className="text-[11px] text-gray-500">Cant: {quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-black shrink-0">
                      {formatCOP(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">{formatCOP(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>IVA discriminado (19%)</span>
                  <span className="font-semibold text-black">{formatCOP(total * 0.19)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío nacional</span>
                  <span className="font-semibold text-emerald-600">Gratis</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-black pt-2 border-t border-gray-100">
                  <span>Total a pagar</span>
                  <span>{formatCOP(totalWithIVA)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full bg-black text-white font-semibold py-4 rounded-full hover:bg-black/85 transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CreditCard className="w-5 h-5" />
                )}
                Confirmar y pagar
              </button>

              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  Transacción protegida con encriptación SSL
                </div>
                <p className="text-[10px] text-gray-400">
                  Tus datos de pago están protegidos. Nunca almacenamos tu información bancaria.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Simulation Modal */}
      <PaymentSimulationModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onApproved={handlePaymentApproved}
        total={totalWithIVA}
      />

      {/* Auth Modal for Customer at checkout if needed */}
      <AuthModal
        open={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          // If user logged in, allow them to proceed
          if (savedFormData) {
            setPaymentModalOpen(true);
          }
        }}
        title="Identifícate para continuar"
        subtitle="Inicia sesión o regístrate para guardar tu pedido y datos de envío."
      />
    </div>
  );
}
