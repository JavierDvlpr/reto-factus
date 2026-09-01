"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { formatCOP } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Loader2,
  CheckCircle2,
  Download,
  ArrowLeft,
  ReceiptText,
  Shield,
  User,
  MapPin,
  ExternalLink,
  QrCode,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  names: z.string().min(3, "Nombre requerido"),
  identification: z.string().min(6, "Cédula/NIT requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(7, "Teléfono requerido"),
  address: z.string().min(5, "Dirección requerida"),
  municipality_id: z.string().min(1, "Municipio requerido"),
  payment_method: z.string().min(1, "Método de pago requerido"),
});

type FormData = z.infer<typeof schema>;

// Municipios principales Colombia (código DIAN)
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
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center px-4 text-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center text-4xl">
          🛒
        </div>
        <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
        <p className="text-muted-foreground">Agrega productos antes de ir al checkout</p>
        <Link href="/">
          <Button className="gradient-brand text-white border-0">
            <ArrowLeft className="w-4 h-4 mr-2" /> Ir al catálogo
          </Button>
        </Link>
      </div>
    );
  }

  // ─── Success state ───────────────────────────────────────────────────────
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
        toast.success("PDF descargado correctamente");
      } catch {
        toast.error("Error al descargar el PDF de Factus");
      } finally {
        setDownloadingPdf(false);
      }
    };

    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-xl">
          <Card className="glass border-green-500/30 glow-brand text-center">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-green-400">
                  ¡Factura Electrónica Validada!
                </h2>
                <p className="text-muted-foreground mt-1">
                  Tu factura fue generada y enviada a la DIAN mediante Factus Sandbox
                </p>
              </div>

              <div className="bg-muted/40 rounded-xl p-5 space-y-3 text-left">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Número de Factura</span>
                  <span className="font-mono font-bold text-primary text-base">
                    {invoiceResult.number}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Referencia</span>
                  <span className="font-mono text-xs">{invoiceResult.reference_code}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Estado DIAN</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    {invoiceResult.is_validated ? "✓ Validada por la DIAN" : "Procesada"}
                  </Badge>
                </div>
                {invoiceResult.validated_at && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Fecha de validación</span>
                    <span className="text-xs">{invoiceResult.validated_at}</span>
                  </div>
                )}
                {invoiceResult.totals?.total && (
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-border/40">
                    <span className="text-muted-foreground">Total Facturado</span>
                    <span className="font-bold text-foreground">
                      {formatCOP(Number(invoiceResult.totals.total))}
                    </span>
                  </div>
                )}
                <div className="text-xs text-muted-foreground pt-2 border-t border-border/40">
                  <span className="block font-medium mb-1">CUFE:</span>
                  <span className="font-mono break-all text-foreground/70 bg-card/60 p-2 rounded block text-[11px]">
                    {invoiceResult.cufe}
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleDownload}
                  disabled={downloadingPdf}
                  className="gradient-brand text-white border-0 gap-2 py-6 text-base font-semibold"
                >
                  {downloadingPdf ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  Descargar Factura PDF
                </Button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {invoiceResult.links?.qr && (
                    <a
                      href={invoiceResult.links.qr}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="w-full gap-2 text-xs">
                        <QrCode className="w-4 h-4 text-primary" />
                        Verificar QR en DIAN
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </a>
                  )}
                  {invoiceResult.links?.public_url && (
                    <a
                      href={invoiceResult.links.public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="w-full gap-2 text-xs">
                        <ReceiptText className="w-4 h-4 text-cyan" />
                        Ver Factura Online
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </a>
                  )}
                </div>

                <Link href="/facturas">
                  <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
                    <ReceiptText className="w-4 h-4" />
                    Ir al Historial de Facturas
                  </Button>
                </Link>

                <Link href="/">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => clearCart()}
                  >
                    ← Seguir comprando en la tienda
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── Checkout form ───────────────────────────────────────────────────────
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
      const error = err as { response?: { data?: { error?: string; message?: string; details?: unknown } }; message?: string };
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
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Checkout</h1>
            <p className="text-muted-foreground text-sm">
              Completa tus datos para emitir la factura electrónica DIAN
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Forms */}
            <div className="lg:col-span-3 space-y-6">
              {/* Customer data */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="w-4 h-4 text-primary" />
                    Datos del comprador (Facturación)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="names">Nombre completo *</Label>
                      <Input
                        id="names"
                        placeholder="Juan Pérez"
                        {...register("names")}
                        className={errors.names ? "border-destructive" : ""}
                      />
                      {errors.names && (
                        <p className="text-xs text-destructive">{errors.names.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="identification">Cédula de ciudadanía / NIT *</Label>
                      <Input
                        id="identification"
                        placeholder="1020304050"
                        {...register("identification")}
                        className={errors.identification ? "border-destructive" : ""}
                      />
                      {errors.identification && (
                        <p className="text-xs text-destructive">
                          {errors.identification.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="juan.perez@ejemplo.com"
                        {...register("email")}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono / Celular *</Label>
                      <Input
                        id="phone"
                        placeholder="3001234567"
                        {...register("phone")}
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && (
                        <p className="text-xs text-destructive">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MapPin className="w-4 h-4 text-primary" />
                    Ubicación y Dirección
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      placeholder="Carrera 7 # 71-21, Oficina 402"
                      {...register("address")}
                      className={errors.address ? "border-destructive" : ""}
                    />
                    {errors.address && (
                      <p className="text-xs text-destructive">{errors.address.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="municipality_id">Municipio (DIAN) *</Label>
                    <Select
                      defaultValue="11001"
                      onValueChange={(val) => setValue("municipality_id", val as string)}
                    >
                      <SelectTrigger id="municipality_id">
                        <SelectValue placeholder="Selecciona municipio" />
                      </SelectTrigger>
                      <SelectContent>
                        {MUNICIPIOS.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.municipality_id && (
                      <p className="text-xs text-destructive">
                        {errors.municipality_id.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CreditCard className="w-4 h-4 text-primary" />
                    Método de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    defaultValue="10"
                    onValueChange={(val) => setValue("payment_method", val as string)}
                  >
                    <SelectTrigger id="payment_method">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">Efectivo (Código 10)</SelectItem>
                      <SelectItem value="42">Consignación bancaria (Código 42)</SelectItem>
                      <SelectItem value="48">Tarjeta de Crédito (Código 48)</SelectItem>
                      <SelectItem value="49">Transferencia Electrónica PSE (Código 49)</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            {/* Right: Order summary */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border-border sticky top-24">
                <CardHeader>
                  <CardTitle className="text-base">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {items.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="flex justify-between text-sm py-2 border-b border-border/40 last:border-0"
                      >
                        <div className="min-w-0 mr-2">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {quantity} x {formatCOP(product.price)}
                          </p>
                        </div>
                        <span className="font-medium shrink-0">
                          {formatCOP(product.price * quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal neto</span>
                      <span>{formatCOP(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IVA (19.00%)</span>
                      <span className="text-cyan">{formatCOP(total * 0.19)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total a Facturar</span>
                      <span className="text-primary">{formatCOP(totalWithIVA)}</span>
                    </div>
                  </div>

                  {/* DIAN badge */}
                  <div className="flex items-start gap-2.5 text-xs text-muted-foreground bg-muted/40 rounded-lg p-3 border border-border/50">
                    <Shield className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span>
                      Facturación Electrónica oficial en tiempo real con <strong>Factus Sandbox</strong> conectada a la <strong>DIAN</strong>.
                    </span>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full gradient-brand text-white border-0 gap-2 py-6 text-base font-semibold"
                    id="submit-checkout"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Validando con la DIAN...
                      </>
                    ) : (
                      <>
                        <ReceiptText className="w-5 h-5" />
                        Pagar y Emitir Factura DIAN
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
