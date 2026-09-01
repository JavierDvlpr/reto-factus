"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { productService } from "@/modules/products/application/ProductService";
import { Product, PRODUCT_CATEGORIES } from "@/modules/products/domain/Product";
import ProductFormModal from "@/modules/products/ui/ProductFormModal";
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    const data = await productService.getAllProductsForAdmin();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();

    // Realtime subscription: updates automatically if another admin or buyer makes changes
    const unsub = productService.subscribeToChanges((updated) => {
      setProducts(updated);
      toast.info("Inventario sincronizado en tiempo real");
    });

    return () => unsub();
  }, []);

  const handleStockChange = async (productId: string, delta: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const newStock = Math.max(0, prod.stock + delta);
    setUpdatingStockId(productId);

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? Product.fromDB({ ...p.toJSON(), stock: newStock, original_price: p.originalPrice, reviews_count: p.reviewsCount, is_new_arrival: p.isNewArrival, is_top_selling: p.isTopSelling, is_active: p.isActive }) : p))
    );

    const res = await productService.updateStock(productId, newStock);
    if (res.success) {
      toast.success(`Stock de "${prod.name}" actualizado a ${newStock}`);
    } else {
      toast.error(res.error as string);
      loadProducts();
    }
    setUpdatingStockId(null);
  };

  const handleDirectStockInput = async (productId: string, value: string) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < 0) return;
    setUpdatingStockId(productId);
    const res = await productService.updateStock(productId, parsed);
    if (res.success) {
      toast.success(`Stock actualizado a ${parsed}`);
      loadProducts();
    } else {
      toast.error(res.error as string);
    }
    setUpdatingStockId(null);
  };

  const handleDelete = async (productId: string, name: string) => {
    if (!confirm(`¿Estás seguro de desactivar el producto "${name}"?`)) return;
    const res = await productService.deleteProduct(productId);
    if (res.success) {
      toast.success("Producto desactivado correctamente");
      loadProducts();
    } else {
      toast.error(res.error as string);
    }
  };

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-black font-sans">
              Gestión de Productos & Stock
            </h1>
            <Badge className="bg-emerald-600 text-white text-[10px] flex items-center gap-1 font-bold">
              <Radio className="w-2.5 h-2.5 animate-pulse text-white" />
              REALTIME
            </Badge>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Los cambios de stock y productos se sincronizan en vivo en la tienda para todos los clientes.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setModalOpen(true);
          }}
          className="bg-black text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-gray-900 transition-all flex items-center gap-2 shadow-md shrink-0 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          Crear Nuevo Producto
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-[24px] p-4 sm:p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o marca..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-hide">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">Producto</th>
                <th className="py-4 px-4">Categoría</th>
                <th className="py-4 px-4">Precio (COP)</th>
                <th className="py-4 px-4 text-center">Stock en Tiempo Real</th>
                <th className="py-4 px-4 text-center">Estado</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map((product) => {
                const stockStatus = product.stockStatus;
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    {/* Product Name & Brand */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-[#F0EEED] overflow-hidden shrink-0 flex items-center justify-center">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <span>💻</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-black group-hover:underline">
                              {product.name}
                            </span>
                            <Link
                              href={`/productos/${product.id}`}
                              target="_blank"
                              title="Ver página de producto"
                              className="text-gray-400 hover:text-black"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                          <span className="text-xs text-gray-500 font-medium">
                            {product.brand}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <Badge variant="secondary" className="text-xs font-semibold">
                        {product.category}
                      </Badge>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-bold text-black">
                      {product.formattedPrice}
                    </td>

                    {/* Stock Quick Editor */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleStockChange(product.id, -1)}
                          disabled={product.stock <= 0 || updatingStockId === product.id}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center transition-colors"
                          title="Disminuir stock en 1"
                        >
                          <Minus className="w-3.5 h-3.5 text-black" />
                        </button>

                        <input
                          type="number"
                          defaultValue={product.stock}
                          key={product.stock}
                          onBlur={(e) => handleDirectStockInput(product.id, e.target.value)}
                          className="w-16 text-center font-extrabold text-sm bg-gray-50 border border-gray-200 rounded-lg py-1 focus:ring-2 focus:ring-black focus:outline-none"
                        />

                        <button
                          onClick={() => handleStockChange(product.id, 1)}
                          disabled={updatingStockId === product.id}
                          className="w-7 h-7 rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-40 flex items-center justify-center transition-colors"
                          title="Aumentar stock en 1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Stock Status Badge */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full ${
                          stockStatus === "out"
                            ? "bg-red-100 text-red-700"
                            : stockStatus === "low"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {stockStatus === "out" && <AlertTriangle className="w-3 h-3" />}
                        {stockStatus === "low" && <AlertTriangle className="w-3 h-3" />}
                        {stockStatus === "available" && <CheckCircle2 className="w-3 h-3" />}
                        {stockStatus === "out" ? "Agotado" : stockStatus === "low" ? "Stock Bajo" : "Disponible"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setModalOpen(true);
                          }}
                          className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-black transition-colors"
                          title="Editar producto"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          title="Desactivar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 text-sm">
                    No se encontraron productos con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      <ProductFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onSuccess={loadProducts}
        editProduct={editingProduct}
      />
    </div>
  );
}
