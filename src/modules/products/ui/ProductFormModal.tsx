"use client";

/**
 * Product Form Modal — Create / Edit product form for the Admin panel.
 * Used by admin/productos/page.tsx.
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Product } from "../domain/Product";
import { PRODUCT_CATEGORIES } from "../domain/Product";
import { productService } from "../application/ProductService";
import { X, Loader2, Package, Save } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(3, "Nombre requerido (mín. 3 chars)"),
  brand: z.string().min(2, "Marca requerida"),
  price: z.coerce.number().positive("Precio debe ser positivo"),
  original_price: z.coerce.number().optional().nullable(),
  category: z.string().min(1, "Categoría requerida"),
  description: z.string().min(10, "Descripción requerida (mín. 10 chars)"),
  image: z.string().optional().nullable(),
  stock: z.coerce.number().int().min(0, "Stock mínimo 0"),
  badge: z.string().optional().nullable(),
  is_new_arrival: z.boolean().optional(),
  is_top_selling: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editProduct?: Product | null;
}

export default function ProductFormModal({
  open,
  onClose,
  onSuccess,
  editProduct,
}: ProductFormModalProps) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!editProduct;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      brand: "",
      price: 0,
      original_price: null,
      category: "Laptops",
      description: "",
      image: "",
      stock: 1,
      badge: "",
      is_new_arrival: false,
      is_top_selling: false,
    },
  });

  useEffect(() => {
    if (editProduct) {
      reset({
        name: editProduct.name,
        brand: editProduct.brand,
        price: editProduct.price,
        original_price: editProduct.originalPrice ?? null,
        category: editProduct.category,
        description: editProduct.description,
        image: editProduct.image ?? "",
        stock: editProduct.stock,
        badge: editProduct.badge ?? "",
        is_new_arrival: editProduct.isNewArrival,
        is_top_selling: editProduct.isTopSelling,
      });
    } else {
      reset({
        name: "",
        brand: "",
        price: 0,
        original_price: null,
        category: "Laptops",
        description: "",
        image: "",
        stock: 1,
        badge: "",
        is_new_arrival: false,
        is_top_selling: false,
      });
    }
  }, [editProduct, reset]);

  if (!open) return null;

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const payload = {
      name: data.name,
      brand: data.brand,
      price: data.price,
      originalPrice: data.original_price ?? null,
      category: data.category,
      description: data.description,
      image: data.image || null,
      stock: data.stock,
      badge: data.badge || null,
      isNewArrival: Boolean(data.is_new_arrival),
      isTopSelling: Boolean(data.is_top_selling),
      specs: editProduct?.specs ?? {},
      rating: editProduct?.rating ?? 4.5,
      reviewsCount: editProduct?.reviewsCount ?? 0,
      isActive: true,
    };

    const result = isEdit
      ? await productService.updateProduct(editProduct!.id, payload)
      : await productService.createProduct(payload);

    if (result.success) {
      toast.success(isEdit ? "Producto actualizado ✓" : "Producto creado ✓");
      onSuccess();
      onClose();
    } else {
      toast.error(result.error as string);
    }
    setLoading(false);
  };

  const inputClass =
    "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all";
  const labelClass = "text-xs font-bold text-gray-600 uppercase tracking-wider";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-black text-white px-8 py-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5" />
            <h2 className="text-xl font-extrabold">
              {isEdit ? "Editar producto" : "Nuevo producto"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          id="product-form"
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto flex-1 p-8 space-y-5"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <label className={labelClass}>Nombre del producto</label>
              <input
                {...register("name")}
                className={inputClass}
                placeholder='MacBook Pro 16" M4 Pro'
              />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Marca</label>
              <input {...register("brand")} className={inputClass} placeholder="Apple" />
              {errors.brand && (
                <p className="text-xs text-red-600">{errors.brand.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Categoría</label>
              <select {...register("category")} className={inputClass}>
                {PRODUCT_CATEGORIES.filter((c) => c !== "Todos").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Precio (COP)</label>
              <input
                {...register("price")}
                type="number"
                className={inputClass}
                placeholder="12499000"
              />
              {errors.price && (
                <p className="text-xs text-red-600">{errors.price.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Precio original (opcional)</label>
              <input
                {...register("original_price")}
                type="number"
                className={inputClass}
                placeholder="13999000"
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Stock</label>
              <input
                {...register("stock")}
                type="number"
                className={inputClass}
                placeholder="10"
              />
              {errors.stock && (
                <p className="text-xs text-red-600">{errors.stock.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Badge (ej: -11%)</label>
              <input
                {...register("badge")}
                className={inputClass}
                placeholder="-11%"
              />
            </div>
            <div className="col-span-2 space-y-1">
              <label className={labelClass}>URL de imagen</label>
              <input
                {...register("image")}
                className={inputClass}
                placeholder="https://images.unsplash.com/..."
              />
              {errors.image && (
                <p className="text-xs text-red-600">{errors.image.message}</p>
              )}
            </div>
            <div className="col-span-2 space-y-1">
              <label className={labelClass}>Descripción</label>
              <textarea
                {...register("description")}
                rows={3}
                className={inputClass + " resize-none"}
                placeholder="Descripción del producto..."
              />
              {errors.description && (
                <p className="text-xs text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="col-span-2 flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("is_new_arrival")}
                  type="checkbox"
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-semibold">Nueva llegada</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("is_top_selling")}
                  type="checkbox"
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-semibold">Más vendido</span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-gray-300 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isEdit ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </div>
    </div>
  );
}
