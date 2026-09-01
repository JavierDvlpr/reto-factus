/**
 * Product Application Service — Orchestrates product use cases.
 * Exposes clean API to the UI layer without exposing repository details.
 */

import { SupabaseProductRepository } from "../infrastructure/SupabaseProductRepository";
import type { Product, ProductProps } from "../domain/Product";
import type { Result } from "@/core/types";

export class ProductService {
  private readonly repo: SupabaseProductRepository;

  constructor() {
    this.repo = new SupabaseProductRepository();
  }

  async getAllProducts(category?: string): Promise<Product[]> {
    return this.repo.findAll({ category, active: true });
  }

  async getAllProductsForAdmin(): Promise<Product[]> {
    return this.repo.findAll({ active: undefined }); // admin sees inactive too
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.repo.findById(id);
  }

  async getNewArrivals(): Promise<Product[]> {
    return this.repo.findNewArrivals();
  }

  async getTopSelling(): Promise<Product[]> {
    return this.repo.findTopSelling();
  }

  async createProduct(data: Omit<ProductProps, "id" | "createdAt" | "updatedAt">): Promise<Result<Product>> {
    return this.repo.create(data);
  }

  async updateProduct(id: string, data: Partial<ProductProps>): Promise<Result<Product>> {
    return this.repo.update(id, data);
  }

  async deleteProduct(id: string): Promise<Result<void>> {
    return this.repo.delete(id);
  }

  async updateStock(id: string, newStock: number): Promise<Result<Product>> {
    if (newStock < 0) {
      return { success: false, error: "El stock no puede ser negativo" };
    }
    return this.repo.updateStock(id, newStock);
  }

  async decrementStock(id: string, quantity: number): Promise<Result<Product>> {
    return this.repo.decrementStock(id, quantity);
  }

  subscribeToChanges(callback: (products: Product[]) => void): () => void {
    return this.repo.subscribeToChanges(callback);
  }
}

// Singleton
export const productService = new ProductService();
