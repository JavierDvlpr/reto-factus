"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ReceiptText,
  Download,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

type Invoice = {
  id: number;
  number: string;
  status: string;
  cufe: string;
  created_at: string;
  customer?: { names: string; email: string };
  total?: number;
};

export default function FacturasPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/factus/invoices");
      setInvoices(res.data?.data || []);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      setError(error?.response?.data?.error || "Error al cargar facturas. Verifica las credenciales de Factus.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownload = async (invoiceId: number, number: string) => {
    setDownloadingId(invoiceId);
    try {
      const res = await axios.get(`/api/factus/pdf/${invoiceId}`);
      const base64 = res.data.pdf;
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${base64}`;
      link.download = `factura-${number}.pdf`;
      link.click();
      toast.success("PDF descargado");
    } catch {
      toast.error("Error al descargar el PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      validated: { label: "Validada DIAN", className: "bg-green-500/20 text-green-400 border-green-500/30" },
      pending: { label: "Pendiente", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      rejected: { label: "Rechazada", className: "bg-red-500/20 text-red-400 border-red-500/30" },
    };
    const s = statusMap[status?.toLowerCase()] || {
      label: status || "Desconocido",
      className: "bg-muted text-muted-foreground",
    };
    return <Badge className={`text-xs ${s.className}`}>{s.label}</Badge>;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Facturas</h1>
            <p className="text-muted-foreground mt-1">
              Historial de facturas electrónicas emitidas a la DIAN
            </p>
          </div>
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

        {/* Error */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5 mb-6">
            <CardContent className="flex items-start gap-3 pt-4 pb-4">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Error al cargar</p>
                <p className="text-xs text-muted-foreground mt-1">{error}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Asegúrate de haber configurado las variables de entorno en{" "}
                  <code className="font-mono bg-muted px-1 rounded">.env.local</code>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && invoices.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <ReceiptText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Sin facturas aún</h3>
            <p className="text-muted-foreground text-sm">
              Las facturas generadas aparecerán aquí
            </p>
          </div>
        )}

        {/* Invoices list */}
        {!loading && invoices.length > 0 && (
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <Card
                key={invoice.id}
                className="bg-card border-border hover:border-primary/30 transition-colors"
              >
                <CardContent className="py-4 px-5">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <ReceiptText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold font-mono text-sm">
                            #{invoice.number}
                          </span>
                          {getStatusBadge(invoice.status)}
                        </div>
                        {invoice.customer && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {invoice.customer.names} — {invoice.customer.email}
                          </p>
                        )}
                        {invoice.created_at && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(invoice.created_at).toLocaleDateString("es-CO", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(invoice.id, invoice.number)}
                      disabled={downloadingId === invoice.id}
                      className="gap-2 shrink-0"
                      id={`download-invoice-${invoice.id}`}
                    >
                      {downloadingId === invoice.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      PDF
                    </Button>
                  </div>

                  {/* CUFE */}
                  {invoice.cufe && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">CUFE: </span>
                        <span className="font-mono break-all">{invoice.cufe}</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
