"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { billingService } from "@/modules/billing/application/BillingService";
import { formatCOP } from "@/lib/products";
import {
  ReceiptText,
  Download,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type InvoiceItem = {
  id?: number | string;
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
  customer_name?: string;
  customer_email?: string;
  customer_identification?: string;
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

export default function AdminFacturasPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingNumber, setDownloadingNumber] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch from Factus API
      const res = await axios.get("/api/factus/invoices");
      const list =
        res.data?.data?.data ||
        res.data?.data ||
        (Array.isArray(res.data) ? res.data : []);

      // 2. Also fetch local/Supabase invoices to ensure all are listed
      const dbInvoices = await billingService.getAllInvoices();
      const combined = [...list];

      // Merge DB invoices if not already present
      for (const d of dbInvoices) {
        if (!combined.some((c) => c.number === d.factus_number)) {
          combined.push({
            id: d.id,
            number: d.factus_number,
            reference_code: d.reference_code,
            cufe: d.cufe,
            is_validated: d.is_validated,
            created_at: d.created_at,
            validated_at: d.validated_at,
            customer: {
              names: d.customer_name,
              email: d.customer_email,
              identification: d.customer_identification,
            },
            total: d.total,
            links: {
              qr: d.qr_url,
              public_url: d.public_url,
            },
          });
        }
      }

      setInvoices(combined);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      setError(e?.response?.data?.error || e?.message || "Error al cargar facturas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownload = async (number: string) => {
    setDownloadingNumber(number);
    const res = await billingService.downloadInvoicePDF(number);
    if (res.success) {
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${res.data}`;
      link.download = `factura-${number}.pdf`;
      link.click();
      toast.success(`Factura ${number} descargada en PDF`);
    } else {
      toast.error(`Error al descargar factura ${number}`);
    }
    setDownloadingNumber(null);
  };

  const filtered = invoices.filter((inv) => {
    const term = search.toLowerCase();
    const num = (inv.number || "").toLowerCase();
    const ref = (inv.reference_code || "").toLowerCase();
    const name = (
      inv.customer?.names ||
      inv.customer?.graphic_representation_name ||
      inv.customer_name ||
      ""
    ).toLowerCase();
    const doc = (inv.customer?.identification || inv.customer_identification || "").toLowerCase();
    return num.includes(term) || ref.includes(term) || name.includes(term) || doc.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-black font-sans">
              Facturas Electrónicas DIAN
            </h1>
            <Badge className="bg-emerald-600 text-white text-xs">
              Sandbox DIAN
            </Badge>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Auditoría de todos los comprobantes emitidos en tiempo real vía API Factus V2.
          </p>
        </div>

        <button
          onClick={fetchInvoices}
          disabled={loading}
          className="bg-white border border-gray-300 text-black font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2 shrink-0 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar lista
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-[20px] p-5 flex items-start gap-3 text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Error de conexión con Factus</p>
            <p className="text-xs text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-[24px] p-4 sm:p-6 border border-gray-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por número, CUFE, cliente o cédula..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
          />
        </div>
        <span className="text-xs text-gray-500 font-semibold hidden sm:inline">
          {filtered.length} facturas encontradas
        </span>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">Número Factura</th>
                <th className="py-4 px-4">Cliente / Receptor</th>
                <th className="py-4 px-4">Fecha Emisión</th>
                <th className="py-4 px-4">Total</th>
                <th className="py-4 px-4 text-center">Estado DIAN</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map((inv) => {
                const customerName =
                  inv.customer?.names ||
                  inv.customer?.graphic_representation_name ||
                  inv.customer_name ||
                  "Consumidor Final";
                const customerDoc =
                  inv.customer?.identification || inv.customer_identification || "N/A";
                const totalAmount =
                  inv.totals?.total || inv.total || 0;
                const formattedTotal =
                  typeof totalAmount === "number"
                    ? formatCOP(totalAmount)
                    : isNaN(Number(totalAmount))
                    ? totalAmount
                    : formatCOP(Number(totalAmount));

                return (
                  <tr key={inv.number || inv.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Number & Ref */}
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-mono font-bold text-black text-sm block">
                          {inv.number}
                        </span>
                        {inv.reference_code && (
                          <span className="text-[11px] text-gray-400 font-mono">
                            Ref: {inv.reference_code}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4">
                      <div>
                        <span className="font-semibold text-black block">{customerName}</span>
                        <span className="text-xs text-gray-500 font-mono">CC/NIT: {customerDoc}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-xs text-gray-500">
                      {inv.created_at || inv.validated_at
                        ? new Date(inv.created_at || inv.validated_at!).toLocaleDateString("es-CO", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Reciente"}
                    </td>

                    {/* Total */}
                    <td className="py-4 px-4 font-bold text-black">
                      {formattedTotal}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="w-3 h-3" />
                        Validada
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.links?.public_url && (
                          <a
                            href={inv.links.public_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-black transition-colors"
                            title="Ver en portal DIAN / Factus"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDownload(inv.number)}
                          disabled={downloadingNumber === inv.number}
                          className="bg-black text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-900 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-60"
                        >
                          <Download className="w-3.5 h-3.5" />
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 text-sm">
                    No se encontraron facturas con el criterio de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
