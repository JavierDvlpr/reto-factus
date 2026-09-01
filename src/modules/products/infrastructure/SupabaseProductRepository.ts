/**
 * Supabase Product Repository — Concrete implementation with Realtime support.
 * Falls back to legacy in-memory data when Supabase is not configured.
 */

import { supabase, isSupabaseConfigured } from "@/core/database/supabase";
import { Product } from "../domain/Product";
import type { IProductRepository } from "../domain/IProductRepository";
import type { ProductProps } from "../domain/Product";
import type { Result } from "@/core/types";
import { ok, fail } from "@/core/types";
import { PRODUCTS as LEGACY_PRODUCTS } from "@/lib/products";

export class SupabaseProductRepository implements IProductRepository {
  // ─── Reader ────────────────────────────────────────────────────────────────
  async findAll(filters?: { category?: string; active?: boolean }): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
      return this._legacyFindAll(filters);
    }
    try {
      let query = supabase.from("products").select("*").order("created_at", { ascending: false });
      if (filters?.active !== false) query = query.eq("is_active", true);
      if (filters?.category && filters.category !== "Todos") {
        query = query.eq("category", filters.category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map(Product.fromDB);
    } catch {
      return this._legacyFindAll(filters);
    }
  }

  async findById(id: string): Promise<Product | null> {
    if (!isSupabaseConfigured()) {
      return this._legacyFindById(id);
    }
    try {
      const { data, error } = await supabase
        .from("products").select("*").eq("id", id).single();
      if (error) return this._legacyFindById(id);
      return data ? Product.fromDB(data) : null;
    } catch {
      return this._legacyFindById(id);
    }
  }

  async findNewArrivals(): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
      return LEGACY_PRODUCTS.filter((p) => p.isNewArrival).map(Product.fromLegacy);
    }
    try {
      const { data } = await supabase
        .from("products").select("*").eq("is_new_arrival", true).eq("is_active", true).order("created_at", { ascending: false });
      return (data ?? []).map(Product.fromDB);
    } catch {
      return LEGACY_PRODUCTS.filter((p) => p.isNewArrival).map(Product.fromLegacy);
    }
  }

  async findTopSelling(): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
      return LEGACY_PRODUCTS.filter((p) => p.isTopSelling).map(Product.fromLegacy);
    }
    try {
      const { data } = await supabase
        .from("products").select("*").eq("is_top_selling", true).eq("is_active", true).order("created_at", { ascending: false });
      return (data ?? []).map(Product.fromDB);
    } catch {
      return LEGACY_PRODUCTS.filter((p) => p.isTopSelling).map(Product.fromLegacy);
    }
  }

  // ─── Writer ────────────────────────────────────────────────────────────────
  async create(data: Omit<ProductProps, "id" | "createdAt" | "updatedAt">): Promise<Result<Product>> {
    if (!isSupabaseConfigured()) return fail("Supabase no configurado");
    try {
      const payload: Record<string, unknown> = {
        name: data.name,
        brand: data.brand,
        price: data.price,
        original_price: data.originalPrice,
        category: data.category,
        description: data.description,
        specs: data.specs,
        image: data.image,
        stock: data.stock,
        rating: data.rating,
        reviews_count: data.reviewsCount,
        badge: data.badge,
        is_new_arrival: data.isNewArrival ?? false,
        is_top_selling: data.isTopSelling ?? false,
        is_active: data.isActive ?? true,
      };

      const { data: row, error } = await supabase.from("products").insert([payload]).select().single();
      if (error) return fail(error.message);
      return ok(Product.fromDB(row));
    } catch (e) {
      return fail(e instanceof Error ? e.message : "Error al crear producto");
    }
  }

  async update(id: string, data: Partial<ProductProps>): Promise<Result<Product>> {
    if (!isSupabaseConfigured()) return fail("Supabase no configurado");
    try {
      const updateData: Record<string, unknown> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.brand !== undefined) updateData.brand = data.brand;
      if (data.price !== undefined) updateData.price = data.price;
      if (data.originalPrice !== undefined) updateData.original_price = data.originalPrice;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.specs !== undefined) updateData.specs = data.specs;
      if (data.image !== undefined) updateData.image = data.image;
      if (data.stock !== undefined) updateData.stock = data.stock;
      if (data.badge !== undefined) updateData.badge = data.badge;
      if (data.isNewArrival !== undefined) updateData.is_new_arrival = data.isNewArrival;
      if (data.isTopSelling !== undefined) updateData.is_top_selling = data.isTopSelling;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;

      const { data: row, error } = await supabase
        .from("products").update(updateData).eq("id", id).select().single();
      if (error) return fail(error.message);
      return ok(Product.fromDB(row));
    } catch (e) {
      return fail(e instanceof Error ? e.message : "Error al actualizar producto");
    }
  }

  async delete(id: string): Promise<Result<void>> {
    if (!isSupabaseConfigured()) return fail("Supabase no configurado");
    try {
      const { error } = await supabase.from("products").update({ is_active: false }).eq("id", id);
      if (error) return fail(error.message);
      return ok(undefined);
    } catch (e) {
      return fail(e instanceof Error ? e.message : "Error al eliminar producto");
    }
  }

  // ─── Stock Manager ─────────────────────────────────────────────────────────
  async updateStock(id: string, newStock: number): Promise<Result<Product>> {
    if (!isSupabaseConfigured()) return fail("Supabase no configurado");
    return this.update(id, { stock: newStock });
  }

  async decrementStock(id: string, quantity: number): Promise<Result<Product>> {
    if (!isSupabaseConfigured()) return fail("Supabase no configurado");
    try {
      const product = await this.findById(id);
      if (!product) return fail("Producto no encontrado");
      if (!product.canAddToCart(quantity)) return fail(`Stock insuficiente. Disponible: ${product.stock}`);
      return this.updateStock(id, product.stock - quantity);
    } catch (e) {
      return fail(e instanceof Error ? e.message : "Error al decrementar stock");
    }
  }

  // ─── Realtime ──────────────────────────────────────────────────────────────
  subscribeToChanges(callback: (products: Product[]) => void): () => void {
    if (!isSupabaseConfigured()) return () => {};
    const channel = supabase
      .channel("products-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, async () => {
        const products = await this.findAll();
        callback(products);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }

  // ─── Legacy Fallbacks ──────────────────────────────────────────────────────
  private _legacyFindAll(filters?: { category?: string }): Product[] {
    let products = LEGACY_PRODUCTS.map(Product.fromLegacy);
    if (filters?.category && filters.category !== "Todos") {
      products = products.filter((p) => p.category === filters.category);
    }
    return products;
  }

  private _legacyFindById(id: string): Product | null {
    const legacy = LEGACY_PRODUCTS.find((p) => p.id === id);
    return legacy ? Product.fromLegacy(legacy) : null;
  }
}
