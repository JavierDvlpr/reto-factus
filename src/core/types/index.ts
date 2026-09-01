/**
 * Core Domain Types — Result Pattern & Shared Interfaces
 * Enables type-safe error handling without exceptions leaking across layers.
 */

// ─── Result Pattern ────────────────────────────────────────────────────────────
export type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };

export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function fail<E = string>(error: E): Result<never, E> {
  return { success: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success;
}

// ─── Pagination ────────────────────────────────────────────────────────────────
export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PagedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

// ─── Timestamps ────────────────────────────────────────────────────────────────
export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

// ─── Currency ─────────────────────────────────────────────────────────────────
export type CurrencyCode = "COP" | "USD";

// ─── Common Statuses ──────────────────────────────────────────────────────────
export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "processing" | "approved" | "rejected";
export type InvoiceStatus = "draft" | "validated" | "cancelled";
