/**
 * IProductRepository — Interface Segregation Principle
 * Split into reader, writer and stock manager roles.
 */

import type { Product, ProductProps } from "./Product";
import type { Result } from "@/core/types";

export interface IProductReader {
  findAll(filters?: { category?: string; active?: boolean }): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findNewArrivals(): Promise<Product[]>;
  findTopSelling(): Promise<Product[]>;
}

export interface IProductWriter {
  create(data: Omit<ProductProps, "id" | "createdAt" | "updatedAt">): Promise<Result<Product>>;
  update(id: string, data: Partial<ProductProps>): Promise<Result<Product>>;
  delete(id: string): Promise<Result<void>>;
}

export interface IStockManager {
  updateStock(id: string, newStock: number): Promise<Result<Product>>;
  decrementStock(id: string, quantity: number): Promise<Result<Product>>;
}

export interface IProductRepository extends IProductReader, IProductWriter, IStockManager {
  subscribeToChanges(callback: (products: Product[]) => void): () => void;
}
