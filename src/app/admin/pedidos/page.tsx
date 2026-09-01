"use client";

import { useEffect, useState } from "react";
import { productService } from "@/modules/products/application/ProductService";
import { billingService, type IssuedInvoiceResult } from "@/modules/billing/application/BillingService";
import { orderRepository } from "@/modules/orders/infrastructure/OrderRepository";
import type { Product } from "@/modules/products/domain/Product";
import type { OrderProps } from "@/modules/orders/domain/Order";
import { MUNICIPIOS, PAYMENT_METHODS } from "@/core/config/constants";
import { formatCOP } from "@/lib/products";
import {
  PlusCircle,
  ShoppingBag,
  User,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Download,
  Loader2,
  ReceiptText,
  Clock,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function AdminOrdersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [invoiceResult, setInvoiceResult] = useState<IssuedInvoiceResult | null>(null);

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerDoc, setCustomerDoc] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [municipalityCode, setMunicipalityCode] = useState("11001");
  const [paymentMethod, setPaymentMethod] = useState("10");

  // Selected items in order
  const [selectedItems, setSelectedItems] = useState<
    Array<{ product: Product; quantity: number }>
  >([]);

  const loadData = async () => {
    const [prods, ords] = await Promise.all([
      productService.getAllProductsForAdmin(),
      orderRepository.findAll(),
    ]);
    setProducts(prods.filter((p) => p.isActive));
    setOrders(ords);
  };

  useEffect(() => {
    loadData();
    const unsub = productService.subscribeToChanges(() => {
      loadData();
    });
    return () => unsub();
  }, []);

  const handleAddItem = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product || !product.isInStock()) {
      toast.error("Producto sin stock disponible");
      return;
    }
    const existing = selectedItems.find((i) => i.product.id === productId);
    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.error(`Solo hay ${product.stock} unidades en stock`);
        return;
      }
      setSelectedItems(
        selectedItems.map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setSelectedItems([...selectedItems, { product, quantity: 1 }]);
    }
  };

  const handleUpdateItemQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setSelectedItems(selectedItems.filter((i) => i.product.id !== productId));
      return;
    }
    const prod = products.find((p) => p.id === productId);
    if (prod && qty > prod.stock) {
      toast.error(`Stock máximo: ${prod.stock}`);
      return;
    }
    setSelectedItems(
      selectedItems.map((i) =>
        i.product.id === productId ? { ...i, quantity: qty } : i
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setSelectedItems(selectedItems.filter((i) => i.product.id !== productId));
  };

  const subtotal = selectedItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const taxAmount = subtotal * 0.19;
  const total = subtotal + taxAmount;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerDoc || !customerEmail || !customerAddress) {
      toast.error("Por favor completa los datos obligatorios del comprador");
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Selecciona al menos un producto para el pedido");
      return;
    }

    setLoading(true);
    toast.loading("Generando pedido y factura DIAN...", { id: "admin-order-loading" });

    const orderItems = selectedItems.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      productPrice: i.product.price,
      quantity: i.quantity,
      subtotal: i.product.price * i.quantity,
    }));

    const result = await billingService.issueInvoice({
      userId: null,
      customer: {
        names: customerName,
        identification: customerDoc,
        email: customerEmail,
        phone: customerPhone,
        address: customerAddress,
        municipalityCode: municipalityCode,
      },
      items: orderItems,
      paymentMethod,
    });

    toast.dismiss("admin-order-loading");

    if (result.success) {
      toast.success("¡Pedido creado y factura DIAN emitida con éxito!");
      setInvoiceResult(result.data);
      // Reset form
      setCustomerName("");
      setCustomerDoc("");
      setCustomerEmail("");
      setCustomerPhone("");
      setCustomerAddress("");
      setSelectedItems([]);
      loadData();
    } else {
      toast.error(result.error as string);
    }
    setLoading(false);
  };

  const handleDownloadPdf = async (number: string) => {
    const res = await billingService.downloadInvoicePDF(number);
    if (res.success) {
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${res.data}`;
      link.download = `factura-${number}.pdf`;
      link.click();
      toast.success(`Factura ${number} descargada en PDF`);
    } else {
      toast.error("Error al descargar PDF");
    }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all";
  const labelClass = "text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black font-sans">
          Crear Pedido Directo (Admin)
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          Genera pedidos en nombre de clientes y emite automáticamente la factura electrónica oficial ante la DIAN.
        </p>
      </div>

      {/* Invoice Success Alert if generated */}
      {invoiceResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-[24px] p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-emerald-900 text-base">
                  ¡Factura #{invoiceResult.number} emitida con éxito!
                </h3>
                <p className="text-xs text-emerald-700 font-mono mt-0.5">
                  Ref: {invoiceResult.reference_code} | CUFE: {invoiceResult.cufe.slice(0, 16)}...
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownloadPdf(invoiceResult.number)}
                className="bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-full hover:bg-emerald-800 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar PDF DIAN
              </button>
              <button
                onClick={() => setInvoiceResult(null)}
                className="text-xs text-emerald-800 hover:underline px-2"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Customer Data & Product Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Info Card */}
          <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <User className="w-5 h-5 text-black" />
              <h2 className="text-base font-bold text-black">Datos del Comprador</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className={labelClass}>Nombre / Razón Social *</label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej. Juan Pérez o Inversiones ABC SAS"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Cédula (CC) o NIT *</label>
                <input
                  value={customerDoc}
                  onChange={(e) => setCustomerDoc(e.target.value)}
                  placeholder="Ej. 1020304050"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Teléfono móvil *</label>
                <input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ej. 3001234567"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Correo (Receptor DIAN) *</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="correo@cliente.com"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Ciudad / Municipio *</label>
                <select
                  value={municipalityCode}
                  onChange={(e) => setMunicipalityCode(e.target.value)}
                  className={inputClass}
                >
                  {MUNICIPIOS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className={labelClass}>Dirección física *</label>
                <input
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Ej. Carrera 7 # 71-21 Torre A"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Product Quick-Add Card */}
          <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h2 className="text-base font-bold text-black">Añadir Productos al Pedido</h2>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Selecciona un producto del catálogo:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                {products.map((prod) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleAddItem(prod.id)}
                    disabled={!prod.isInStock()}
                    className="flex items-center justify-between p-3 rounded-2xl border border-gray-200 hover:border-black hover:bg-gray-50 transition-all text-left disabled:opacity-40"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-black truncate">{prod.name}</p>
                      <p className="text-[11px] text-gray-500 font-semibold">{prod.formattedPrice}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {prod.stock} disp.
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Items Review & Emission (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-black">
                Ítems del Pedido ({selectedItems.length})
              </h2>
              {selectedItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedItems([])}
                  className="text-xs text-red-600 hover:underline font-semibold"
                >
                  Vaciar
                </button>
              )}
            </div>

            {/* Items List */}
            {selectedItems.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                No has añadido productos al pedido aún.
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {selectedItems.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-200/60 text-xs"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-bold text-black truncate">{product.name}</p>
                      <p className="text-gray-500">{product.formattedPrice} c/u</p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleUpdateItemQty(product.id, quantity - 1)}
                        className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold w-4 text-center">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateItemQty(product.id, quantity + 1)}
                        className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(product.id)}
                        className="p-1 text-gray-400 hover:text-red-600 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <label className={labelClass}>Medio de Pago</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={inputClass}
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.code} value={m.code}>
                    {m.icon} {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Summary Totals */}
            <div className="space-y-2 text-xs border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-black">{formatCOP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>IVA DIAN (19%)</span>
                <span className="font-semibold text-black">{formatCOP(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-black pt-2 border-t border-gray-200">
                <span>Total a Facturar</span>
                <span>{formatCOP(total)}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={loading || selectedItems.length === 0}
              className="w-full bg-black text-white font-semibold py-3.5 rounded-full hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 active:scale-95 text-xs sm:text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ReceiptText className="w-4 h-4" />
              )}
              Emitir Pedido y Facturar DIAN
            </button>
          </div>
        </div>
      </div>

      {/* Orders History Table */}
      <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-black" />
          <h2 className="text-lg font-bold text-black">Historial de Pedidos Registrados ({orders.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">ID Pedido</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Identificación</th>
                <th className="py-3 px-4">Ítems</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((ord) => (
                <tr key={ord.id || ord.createdAt} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-xs">{ord.id?.slice(0, 8) || "ORD"}</td>
                  <td className="py-3 px-4 font-semibold text-black">{ord.customer.names}</td>
                  <td className="py-3 px-4 text-gray-600">{ord.customer.identification}</td>
                  <td className="py-3 px-4 text-gray-600">{ord.items.length} productos</td>
                  <td className="py-3 px-4 font-bold text-black">{formatCOP(ord.total)}</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-emerald-600 text-white text-[10px]">Completado</Badge>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No hay pedidos registrados en base de datos.
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
