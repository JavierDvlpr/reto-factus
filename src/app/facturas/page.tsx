"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCOP } from "@/lib/products";
import {
  ReceiptText,
  Download,
  RefreshCw,
  AlertCircle,
  Loader2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

type InvoiceItem = {
  id?: number;
  number: string;
  reference_code?: string;
  is_validated?: boolean;
  status?: string | number;
  cufe?: string;
  created_at?: string;
  validated_at?: string;
  customer?: {
    names?: string;
    email?: string;
    identification?: string;
    graphic_representation_name?: string;
  };
  totals?: {
    total?: string | number;
    gross_amount?: string | number;
    tax_amount?: string | number;
  };
  total?: string | number;
  links?: {
    qr?: string;
    public_url?: string;
  };
};

export default function FacturasPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingNumber, setDownloadingNumber] = useState<string | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/factus/invoices");
      const list =
        res.data?.data?.data ||
        res.data?.data ||
        (Array.isArray(res.data) ? res.data : []);
      setInvoices(list);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
      setError(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Error al cargar facturas. Verifica las credenciales de Factus en .env.local"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownload = async (number: string) => {
    setDownloadingNumber(number);
    try {
      const res = await axios.get(`/api/factus/pdf/${number}`);
      const base64 = res.data.pdf;
      if (!base64) {
        throw new Error("No se recibió el archivo PDF");
      }
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${base64}`;
      link.download = `factura-${number}.pdf`;
      link.click();
      toast.success(`Factura ${number} descargada correctamente`);
    } catch {
      toast.error(`Error al descargar el PDF de la factura ${number}`);
    } finally {
      setDownloadingNumber(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold gradient-text">Facturas Electrónicas</h1>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                Sandbox DIAN
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              Historial de comprobantes emitidos en tiempo real vía API Factus V2
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                ← Volver a la Tienda
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchInvoices}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5 mb-6">
            <CardContent className="flex items-start gap-3 pt-4 pb-4">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Error al consultar Factus</p>
                <p className="text-xs text-muted-foreground mt-1">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="py-5 px-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-3 w-60" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-9 w-28" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && invoices.length === 0 && (
          <div className="text-center py-20 bg-card/40 rounded-2xl border border-border/50">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <ReceiptText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Sin facturas emitidas</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
              Realiza una compra en la tienda para emitir tu primera factura electrónica ante la DIAN.
            </p>
            <Link href="/">
              <Button className="gradient-brand text-white border-0">
                Ir a comprar al catálogo
              </Button>
            </Link>
          </div>
        )}

        {/* Invoices list */}
        {!loading && invoices.length > 0 && (
          <div className="space-y-4">
            {invoices.map((invoice, idx) => {
              const invoiceNum = invoice.number || `FAC-${idx + 1}`;
              const customerName =
                invoice.customer?.names ||
                invoice.customer?.graphic_representation_name ||
                "Cliente Mostrador";
              const totalAmount =
                invoice.totals?.total ||
                invoice.total ||
                null;

              return (
                <Card
                  key={invoiceNum + idx}
                  className="bg-card border-border hover:border-primary/40 transition-all card-hover"
                >
                  <CardContent className="py-5 px-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <ReceiptText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-bold font-mono text-base text-foreground">
                              #{invoiceNum}
                            </span>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              Validada DIAN
                            </Badge>
                            {invoice.reference_code && (
                              <span className="text-xs text-muted-foreground font-mono">
                                Ref: {invoice.reference_code}
                              </span>
                            )}
                          </div>

                          <p className="text-sm font-medium text-foreground/90 mt-1">
                            {customerName}
                            {invoice.customer?.email && (
                              <span className="text-muted-foreground font-normal ml-2 text-xs">
                                ({invoice.customer.email})
                              </span>
                            )}
                          </p>

                          {invoice.created_at && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Emitida: {invoice.created_at}
                            </p>
                          )}

                          {totalAmount && (
                            <p className="text-sm font-bold text-primary mt-2">
                              {formatCOP(Number(totalAmount))}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {invoice.cufe && (
                          <a
                            href={`https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=${invoice.cufe}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                              DIAN QR
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </a>
                        )}

                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleDownload(invoiceNum)}
                          disabled={downloadingNumber === invoiceNum}
                          className="gradient-brand text-white border-0 gap-1.5 text-xs font-semibold"
                          id={`download-btn-${invoiceNum}`}
                        >
                          {downloadingNumber === invoiceNum ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                          Descargar PDF
                        </Button>
                      </div>
                    </div>

                    {/* CUFE */}
                    {invoice.cufe && (
                      <div className="mt-4 pt-3 border-t border-border/50 flex items-start gap-2">
                        <span className="text-[11px] font-semibold text-muted-foreground shrink-0">
                          CUFE:
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground/80 break-all bg-background/50 px-2 py-0.5 rounded">
                          {invoice.cufe}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
