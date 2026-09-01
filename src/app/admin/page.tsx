"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { productService } from "@/modules/products/application/ProductService";
import { orderRepository } from "@/modules/orders/infrastructure/OrderRepository";
import type { Product } from "@/modules/products/domain/Product";
import { formatCOP } from "@/lib/products";
import {
  ShoppingBag,
  ReceiptText,
  AlertTriangle,
  PlusCircle,
  TrendingUp,
  Package,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import ProductFormModal from "@/modules/products/ui/ProductFormModal";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [prods, invs] = await Promise.all([
      productService.getAllProductsForAdmin(),
      orderRepository.findAllInvoices(),
    ]);
    setProducts(prods);
    setInvoices(invs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const unsub = productService.subscribeToChanges(() => {
      loadData();
    });
    return () => unsub();
  }, []);

  const lowStockProducts = products.filter((p) => p.hasLowStock() || !p.isInStock());
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black font-sans">
            Panel de Control
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Resumen de inventario, stock en tiempo real y facturación DIAN
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-black text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-gray-900 transition-all flex items-center gap-2 shadow-md active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            title: "Total Productos",
            value: products.length.toString(),
            subtitle: `${products.filter((p) => p.isActive).length} activos en catálogo`,
            icon: Package,
            color: "bg-blue-50 text-blue-700",
          },
          {
            title: "Unidades en Stock",
            value: totalStockUnits.toString(),
            subtitle: "Inventario global disponible",
            icon: Layers,
            color: "bg-emerald-50 text-emerald-700",
          },
          {
            title: "Alertas de Stock",
            value: lowStockProducts.length.toString(),
            subtitle: "Productos con stock bajo (≤ 5)",
            icon: AlertTriangle,
            color: "bg-amber-50 text-amber-700",
          },
          {
            title: "Facturas DIAN",
            value: invoices.length.toString(),
            subtitle: "Comprobantes registrados",
            icon: ReceiptText,
            color: "bg-purple-50 text-purple-700",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-[24px] p-6 border border-gray-200 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-black">{card.value}</h3>
                <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-[28px] p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            Control en Tiempo Real
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold">
            Gestión Rápida de Inventario & Pedidos
          </h2>
          <p className="text-gray-400 text-sm max-w-xl">
            Crea productos al instante, ajusta el stock con sincronización en vivo o genera pedidos directos para clientes con factura electrónica automática.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/admin/productos">
            <button className="bg-white text-black font-semibold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-sm">
              Editar Stock Realtime
            </button>
          </Link>
          <Link href="/admin/pedidos">
            <button className="bg-white/10 text-white border border-white/20 font-semibold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-white/20 transition-colors">
              Crear Pedido
            </button>
          </Link>
        </div>
      </div>

      {/* Low Stock Warning List */}
      {lowStockProducts.length > 0 && (
        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-lg font-bold text-black">
                Productos que requieren reabastecimiento ({lowStockProducts.length})
              </h2>
            </div>
            <Link
              href="/admin/productos"
              className="text-xs font-bold text-black hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200/80"
              >
                <div>
                  <h4 className="text-sm font-bold text-black line-clamp-1">{p.name}</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {p.brand} • {p.formattedPrice}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full ${
                      p.stock === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {p.stock === 0 ? "Agotado (0)" : `${p.stock} unid.`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
