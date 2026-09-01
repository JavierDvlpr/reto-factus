"use client";

import { useState } from "react";
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
import type { PaymentMethodCode } from "@/modules/orders/application/PaymentSimulationService";
import {
  CreditCard,
  Loader2,
  CheckCircle2,
  Download,
  ArrowLeft,
  ReceiptText,
  ShieldCheck,
  User,
  MapPin,
  ExternalLink,
  QrCode,
  Lock,
  ShoppingBag,
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
  const { getUser } = useAuthStore();
  const user = getUser();

  const [loading, setLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [invoiceResult, setInvoiceResult] = useState<IssuedInvoiceResult | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [savedFormData, setSavedFormData] = useState<FormData | null>(null);

  const total = getTotalPrice();
  const totalWithIVA = total * 1.19;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      names: user?.fullName || "",
      email: user?.email || "",
      municipality_id: "11001",
    },
  });

  // ─── Empty Cart State ───────────────────────────────────────────────────────
  if (items.length === 0 && !invoiceResult) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center py-16">
        <div className="w-20 h-20 rounded-full bg-[#F0F0F0] flex items-center justify-center text-3xl mb-4">
          🛒
        </div>
        <h2 className="text-2xl font-extrabold text-black">Tu carrito está vacío</h2>
        <p className="text-gray-500 mt-2 max-w-sm text-sm">
          Agrega productos desde la tienda para proceder con la simulación de pago y facturación electrónica DIAN.
        </p>
        <Link href="/productos" className="mt-6">
          <button className="bg-black text-white font-semibold px-8 py-3.5 rounded-full hover:bg-black/85 transition-colors">
            ← Volver al catálogo
          </button>
        </Link>
      </div>
    );
  }

  // ─── Invoice Issued Success Screen ──────────────────────────────────────────
  if (invoiceResult) {
    const handleDownload = async () => {
      setDownloadingPdf(true);
      const res = await billingService.downloadInvoicePDF(invoiceResult.number);
      if (res.success) {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${res.data}`;
        link.download = `factura-${invoiceResult.number}.pdf`;
        link.click();
        toast.success("Factura descargada exitosamente en PDF");
      } else {
        toast.error("Error al descargar el PDF de la factura");
      }
      setDownloadingPdf(false);
    };

    return (
      <div className="min-h-screen py-16 px-4 bg-[#F2F0F1]">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-xl border border-gray-200 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Validada oficialmente por la DIAN
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-3">
                ¡Factura electrónica emitida!
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Comprobante generado en tiempo real vía API Factus V2
              </p>
            </div>

            {/* Voucher Details */}
            <div className="bg-[#F0EEED] rounded-[20px] p-6 space-y-3 text-left">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Número de factura</span>
                <span className="font-extrabold text-black font-mono">{invoiceResult.number}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Código de referencia</span>
                <span className="font-mono text-xs text-gray-700">{invoiceResult.reference_code}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Estado DIAN</span>
                <Badge className="bg-emerald-600 text-white text-[11px]">Validada UBL 2.1</Badge>
              </div>
              {invoiceResult.totals?.total && (
                <div className="flex justify-between items-center text-sm border-t border-gray-300/60 pt-2">
                  <span className="text-black font-bold">Total facturado (con IVA)</span>
                  <span className="font-extrabold text-base text-black">
                    {formatCOP(Number(invoiceResult.totals.total))}
                  </span>
                </div>
              )}
            </div>

            {/* CUFE */}
            {invoiceResult.cufe && (
              <div className="bg-gray-50 border border-gray-200 rounded-[16px] p-4 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                  <ReceiptText className="w-3.5 h-3.5 text-emerald-600" />
                  CUFE (Código Único de Factura Electrónica)
                </div>
                <p className="text-[10px] font-mono text-gray-500 break-all leading-tight">
                  {invoiceResult.cufe}
                </p>
              </div>
            )}

            {/* QR / DIAN link */}
            {invoiceResult.links?.public_url && (
              <a
                href={invoiceResult.links.public_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
              >
                <QrCode className="w-4 h-4" />
                Verificar comprobante en portal oficial DIAN / Factus
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleDownload}
                disabled={downloadingPdf}
                className="w-full bg-black text-white font-semibold py-4 rounded-full hover:bg-black/85 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-60 active:scale-[0.98]"
              >
                {downloadingPdf ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                Descargar factura en PDF
              </button>

              <Link href="/">
                <button className="w-full py-3.5 rounded-full border border-gray-300 text-sm font-semibold text-black hover:bg-gray-50 transition-colors">
                  Volver a la tienda
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Step 1: Trigger Form Submission -> Open Payment Simulation ─────────────
  const onFormSubmit = (data: FormData) => {
    setSavedFormData(data);
    setPaymentModalOpen(true);
  };

  // ─── Step 2: Payment Simulation Approved -> Issue Invoice ───────────────────
  const handlePaymentApproved = async (transactionId: string, methodCode: PaymentMethodCode) => {
    if (!savedFormData) return;
    setLoading(true);
    toast.loading("Emitiendo factura electrónica ante la DIAN...", { id: "factus-loading" });

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
      toast.success("¡Factura validada por la DIAN exitosamente!");
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
                Facturación electrónica DIAN oficial con Factus API V2
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Emisión UBL 2.1 en tiempo real
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-[32px] p-6 sm:p-10 border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <User className="w-5 h-5 text-black" />
              <h2 className="text-lg font-bold text-black">Datos del comprador para la DIAN</h2>
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
                <label className={labelClass}>Correo electrónico (Factura DIAN) *</label>
                <input {...register("email")} type="email" placeholder="correo@empresa.com" className={inputClass} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Dirección de entrega *</label>
                <input {...register("address")} placeholder="Ej. Calle 100 # 15-20 Apto 402" className={inputClass} />
                {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Municipio / Ciudad (Código DIAN) *</label>
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
                Proceder al pago y facturación DIAN
              </button>

              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  Transacción 100% simulada y protegida
                </div>
                <p className="text-[10px] text-gray-400">
                  Al completar el pago, Factus API genera el CUFE y emite la factura UBL 2.1 ante la DIAN.
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
    </div>
  );
}
