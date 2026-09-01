"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { formatCOP } from "@/lib/products";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  names: z.string().min(3, "Ingresa tu nombre completo"),
  identification: z.string().min(6, "Ingresa un número de documento válido"),
  email: z.string().email("Correo electrónico no válido"),
  phone: z.string().min(7, "Teléfono requerido"),
  address: z.string().min(5, "Dirección requerida"),
  municipality_id: z.string().min(1, "Selecciona un municipio"),
  payment_method: z.string().min(1, "Selecciona un medio de pago"),
});

type FormData = z.infer<typeof schema>;

const MUNICIPIOS = [
  { id: "11001", name: "Bogotá D.C. (Cundinamarca)" },
  { id: "05001", name: "Medellín (Antioquia)" },
  { id: "76001", name: "Cali (Valle del Cauca)" },
  { id: "08001", name: "Barranquilla (Atlántico)" },
  { id: "13001", name: "Cartagena (Bolívar)" },
  { id: "68001", name: "Bucaramanga (Santander)" },
  { id: "17001", name: "Manizales (Caldas)" },
  { id: "73001", name: "Ibagué (Tolima)" },
  { id: "63001", name: "Armenia (Quindío)" },
  { id: "66001", name: "Pereira (Risaralda)" },
];

type InvoiceResult = {
  number: string;
  reference_code: string;
  is_validated: boolean;
  validated_at?: string;
  created_at?: string;
  cufe: string;
  links?: {
    qr?: string;
    public_url?: string;
  };
  totals?: {
    total: string;
  };
};

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [invoiceResult, setInvoiceResult] = useState<InvoiceResult | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const total = getTotalPrice();
  const totalWithIVA = total * 1.19;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { municipality_id: "11001", payment_method: "10" },
  });

  if (items.length === 0 && !invoiceResult) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center py-16">
        <div className="w-20 h-20 rounded-full bg-[#F0F0F0] flex items-center justify-center text-3xl mb-4">
          🛒
        </div>
        <h2 className="text-2xl font-extrabold text-black">Tu carrito está vacío</h2>
        <p className="text-gray-500 mt-2 max-w-sm">
          Agrega productos desde la tienda para proceder con la facturación electrónica.
        </p>
        <Link href="/" className="mt-6">
          <button className="bg-black text-white font-semibold px-8 py-3.5 rounded-full hover:bg-black/85 transition-colors">
            ← Volver al catálogo
          </button>
        </Link>
      </div>
    );
  }

  // ─── Estado de Éxito: Factura DIAN Emitida ──────────────────────────────────
  if (invoiceResult) {
    const handleDownload = async () => {
      setDownloadingPdf(true);
      try {
        const res = await axios.get(`/api/factus/pdf/${invoiceResult.number}`);
        const base64 = res.data.pdf;
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${base64}`;
        link.download = `factura-${invoiceResult.number}.pdf`;
        link.click();
        toast.success("Factura descargada exitosamente en formato PDF");
      } catch {
        toast.error("Error al descargar el PDF desde Factus API");
      } finally {
        setDownloadingPdf(false);
      }
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

            <div className="bg-[#F0EEED] rounded-[20px] p-6 space-y-3 text-left">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Número de factura</span>
                <span className="font-extrabold text-black text-base font-mono">
                  {invoiceResult.number}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Código de referencia</span>
                <span className="font-mono text-xs text-gray-700">
                  {invoiceResult.reference_code}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Estado DIAN</span>
                <Badge className="bg-emerald-600 text-white text-xs">
                  Validado
                </Badge>
              </div>
              {invoiceResult.totals?.total && (
                <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-300">
                  <span className="text-gray-700 font-bold">Total facturado</span>
                  <span className="font-extrabold text-black text-lg">
                    {formatCOP(Number(invoiceResult.totals.total))}
                  </span>
                </div>
              )}
              <div className="text-xs pt-2 border-t border-gray-300">
                <span className="block font-bold text-gray-700 mb-1">CUFE:</span>
                <span className="font-mono break-all text-gray-600 bg-white p-2.5 rounded-lg block text-[11px] border border-gray-200">
                  {invoiceResult.cufe}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleDownload}
                disabled={downloadingPdf}
                className="w-full bg-black text-white font-semibold text-base py-4 rounded-full flex items-center justify-center gap-2 hover:bg-black/85 transition-all shadow-md"
              >
                {downloadingPdf ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                Descargar factura en PDF
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {invoiceResult.links?.qr && (
                  <a
                    href={invoiceResult.links.qr}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="w-full border border-gray-300 text-black font-semibold text-xs py-3 rounded-full flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      Consultar en DIAN
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </a>
                )}
                {invoiceResult.links?.public_url && (
                  <a
                    href={invoiceResult.links.public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="w-full border border-gray-300 text-black font-semibold text-xs py-3 rounded-full flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors">
                      <ReceiptText className="w-4 h-4 text-blue-600" />
                      Ver factura web
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </a>
                )}
              </div>

              <Link href="/facturas">
                <button className="w-full text-gray-600 hover:text-black font-semibold text-sm py-2 transition-colors">
                  Ir al historial de todas las facturas →
                </button>
              </Link>

              <Link href="/">
                <button
                  onClick={() => clearCart()}
                  className="w-full text-gray-500 hover:text-black text-xs py-1 transition-colors"
                >
                  ← Seguir comprando en la tienda
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Formulario de Checkout ───────────────────────────────────────────────
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = {
        customer: {
          identification: data.identification,
          names: data.names,
          email: data.email,
          phone: data.phone,
          address: data.address,
          municipality_id: data.municipality_id,
        },
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
        paymentMethod: data.payment_method,
      };

      const res = await axios.post("/api/factus/invoice", payload);
      if (res.data.success && res.data.invoice) {
        setInvoiceResult(res.data.invoice);
        toast.success("Factura electrónica emitida exitosamente ante la DIAN");
      } else {
        throw new Error(res.data.error || "Error generando factura");
      }
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { error?: string; message?: string } };
        message?: string;
      };
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Error al procesar la compra";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-14 px-4 bg-[#F2F0F1]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <Link href="/">
            <button className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-black" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-black font-sans">
              Checkout & Facturación DIAN
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Ingresa tus datos para la emisión de la factura electrónica oficial
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column (Left 7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card: Datos Personales */}
              <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <User className="w-5 h-5 text-black" />
                  <h2 className="font-bold text-lg text-black">
                    Datos del comprador (Facturación)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Nombre completo *
                    </label>
                    <input
                      placeholder="Juan Pérez"
                      {...register("names")}
                      className={`w-full bg-[#F0F0F0] text-black text-sm rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-black/20 transition-all ${
                        errors.names ? "ring-2 ring-red-500" : ""
                      }`}
                    />
                    {errors.names && (
                      <p className="text-xs text-red-500 font-medium pl-2">
                        {errors.names.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Cédula de ciudadanía o NIT *
                    </label>
                    <input
                      placeholder="1020304050"
                      {...register("identification")}
                      className={`w-full bg-[#F0F0F0] text-black text-sm rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-black/20 transition-all ${
                        errors.identification ? "ring-2 ring-red-500" : ""
                      }`}
                    />
                    {errors.identification && (
                      <p className="text-xs text-red-500 font-medium pl-2">
                        {errors.identification.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      placeholder="juan.perez@ejemplo.com"
                      {...register("email")}
                      className={`w-full bg-[#F0F0F0] text-black text-sm rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-black/20 transition-all ${
                        errors.email ? "ring-2 ring-red-500" : ""
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 font-medium pl-2">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Teléfono de contacto *
                    </label>
                    <input
                      placeholder="3001234567"
                      {...register("phone")}
                      className={`w-full bg-[#F0F0F0] text-black text-sm rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-black/20 transition-all ${
                        errors.phone ? "ring-2 ring-red-500" : ""
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 font-medium pl-2">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Card: Dirección y Municipio */}
              <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <MapPin className="w-5 h-5 text-black" />
                  <h2 className="font-bold text-lg text-black">
                    Dirección y ubicación tributaria
                  </h2>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Dirección de residencia o empresa *
                    </label>
                    <input
                      placeholder="Carrera 7 # 71-21, Oficina 402"
                      {...register("address")}
                      className={`w-full bg-[#F0F0F0] text-black text-sm rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-black/20 transition-all ${
                        errors.address ? "ring-2 ring-red-500" : ""
                      }`}
                    />
                    {errors.address && (
                      <p className="text-xs text-red-500 font-medium pl-2">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Municipio DIAN *
                    </label>
                    <select
                      defaultValue="11001"
                      onChange={(e) => setValue("municipality_id", e.target.value)}
                      className="w-full bg-[#F0F0F0] text-black text-sm rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-black/20 transition-all cursor-pointer"
                    >
                      {MUNICIPIOS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Card: Método de Pago */}
              <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <CreditCard className="w-5 h-5 text-black" />
                  <h2 className="font-bold text-lg text-black">Método de pago</h2>
                </div>

                <select
                  defaultValue="10"
                  onChange={(e) => setValue("payment_method", e.target.value)}
                  className="w-full bg-[#F0F0F0] text-black text-sm rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-black/20 transition-all cursor-pointer"
                >
                  <option value="10">Efectivo (Código 10 - Factus DIAN)</option>
                  <option value="42">Consignación bancaria (Código 42)</option>
                  <option value="48">Tarjeta de Crédito (Código 48)</option>
                  <option value="49">Transferencia electrónica PSE (Código 49)</option>
                </select>
              </div>
            </div>

            {/* Summary Column (Right 5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-200 shadow-sm sticky top-28 space-y-6">
                <h2 className="font-extrabold text-xl text-black">
                  Resumen del pedido
                </h2>

                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-[10px] bg-[#F0EEED] relative shrink-0 p-1">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="text-lg flex items-center justify-center h-full">
                              💻
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-black truncate">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-gray-500 font-medium">
                            Cant: {quantity}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-black shrink-0">
                        {formatCOP(product.price * quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-gray-200" />

                {/* Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal neto</span>
                    <span className="font-semibold text-black">{formatCOP(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IVA (19.00%)</span>
                    <span className="font-semibold text-black">{formatCOP(total * 0.19)}</span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between items-center text-lg font-extrabold text-black pt-1">
                    <span>Total a pagar</span>
                    <span className="text-2xl">{formatCOP(totalWithIVA)}</span>
                  </div>
                </div>

                {/* Security and DIAN guarantee badge */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-[16px] p-4 flex items-start gap-3 text-xs text-emerald-800">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Facturación Electrónica DIAN</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Validación instantánea con CUFE y código QR oficial emitido por Factus.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white font-semibold text-base py-4 rounded-full flex items-center justify-center gap-2 hover:bg-black/85 transition-all shadow-md active:scale-95 disabled:opacity-50"
                  id="submit-checkout"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Validando con la DIAN...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Pagar y emitir factura DIAN
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
