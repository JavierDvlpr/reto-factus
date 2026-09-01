"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft,
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
      const error = err as {
        response?: { data?: { error?: string; message?: string } };
        message?: string;
      };
      setError(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Error al cargar facturas desde Factus Sandbox"
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
    <div className="min-h-screen py-10 sm:py-14 px-4 bg-[#F2F0F1]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-black" />
              </button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-black font-sans">
                  Facturas electrónicas
                </h1>
                <Badge className="bg-emerald-600 text-white text-xs">
                  Sandbox DIAN
                </Badge>
              </div>
              <p className="text-gray-500 text-sm mt-0.5">
                Historial de comprobantes emitidos en tiempo real vía API Factus V2
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchInvoices}
              disabled={loading}
              className="bg-white border border-gray-300 text-black font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Actualizar lista
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-[20px] p-5 mb-6 flex items-start gap-3 text-red-800">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Error de conexión con Factus</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3 w-60" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-10 w-32 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && invoices.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-[#F0F0F0] flex items-center justify-center mx-auto mb-4">
              <ReceiptText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-black mb-1">Sin facturas registradas</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              Realiza una compra en la tienda para emitir tu primera factura electrónica ante la DIAN.
            </p>
            <Link href="/">
              <button className="bg-black text-white font-semibold px-8 py-3.5 rounded-full hover:bg-black/85 transition-colors">
                Ir a comprar al catálogo
              </button>
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
                <div
                  key={invoiceNum + idx}
                  className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-[14px] bg-[#F0EEED] flex items-center justify-center shrink-0">
                        <ReceiptText className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-extrabold font-mono text-base text-black">
                            #{invoiceNum}
                          </span>
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Validada DIAN
                          </span>
                          {invoice.reference_code && (
                            <span className="text-xs text-gray-400 font-mono">
                              Ref: {invoice.reference_code}
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-semibold text-gray-800 mt-1">
                          {customerName}
                          {invoice.customer?.email && (
                            <span className="text-gray-500 font-normal ml-2 text-xs">
                              ({invoice.customer.email})
                            </span>
                          )}
                        </p>

                        {invoice.created_at && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            Emitida el: {invoice.created_at}
                          </p>
                        )}

                        {totalAmount && (
                          <p className="text-sm font-extrabold text-black mt-2">
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
                          <button className="border border-gray-300 text-black font-semibold text-xs px-3.5 py-2 rounded-full flex items-center gap-1 hover:bg-gray-50 transition-colors">
                            DIAN QR
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </a>
                      )}

                      <button
                        onClick={() => handleDownload(invoiceNum)}
                        disabled={downloadingNumber === invoiceNum}
                        className="bg-black text-white font-semibold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 hover:bg-black/85 transition-colors shadow-sm disabled:opacity-50"
                        id={`download-btn-${invoiceNum}`}
                      >
                        {downloadingNumber === invoiceNum ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        Descargar PDF
                      </button>
                    </div>
                  </div>

                  {/* CUFE footer */}
                  {invoice.cufe && (
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-start gap-2">
                      <span className="text-[11px] font-bold text-gray-500 shrink-0">
                        CUFE:
                      </span>
                      <span className="font-mono text-[11px] text-gray-600 break-all bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                        {invoice.cufe}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
