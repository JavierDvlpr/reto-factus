/**
 * Billing Application Service — Orchestrates purchase flow:
 * 1. Atomically reserves stock via Supabase RPC (FOR UPDATE lock, no overselling)
 * 2. Falls back to in-memory stock decrement if not in DB or non-UUID id
 * 3. Generates electronic invoice via Factus API
 * 4. Saves Order and Invoice to Supabase
 */

import axios from "axios";
import { supabase, isSupabaseConfigured } from "@/core/database/supabase";
import { orderRepository } from "@/modules/orders/infrastructure/OrderRepository";
import { productService } from "@/modules/products/application/ProductService";
import type { CustomerData, OrderItemData } from "@/modules/orders/domain/Order";
import type { Result } from "@/core/types";
import { ok, fail } from "@/core/types";

export interface CreateInvoiceParams {
  userId?: string | null;
  customer: CustomerData;
  items: OrderItemData[];
  paymentMethod: string;
}

export interface IssuedInvoiceResult {
  number: string;
  reference_code: string;
  cufe: string;
  is_validated: boolean;
  validated_at?: string;
  links?: {
    qr?: string;
    public_url?: string;
  };
  totals?: {
    total: string;
  };
}

/** Result shape returned by the reserve_and_decrement_stock RPC */
interface StockReservationResult {
  success: boolean;
  error?: string;
  available?: number;
  remaining?: number;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class BillingService {
  /**
   * Complete purchase flow with atomic stock reservation:
   * 1. FOR EACH item:
   *    - If valid UUID and Supabase is configured: call `reserve_and_decrement_stock` RPC
   *    - If non-UUID or offline: decrement via productService fallback
   * 2. Generate invoice via Factus API
   * 3. Persist Order + Invoice in Supabase
   */
  async issueInvoice(params: CreateInvoiceParams): Promise<Result<IssuedInvoiceResult>> {
    try {
      const subtotal = params.items.reduce((s, i) => s + i.productPrice * i.quantity, 0);
      const taxAmount = subtotal * 0.19;
      const total = subtotal + taxAmount;

      // ── Step 1: Atomic stock reservation ─────────────────────────────────────
      for (const item of params.items) {
        if (isSupabaseConfigured() && UUID_REGEX.test(item.productId)) {
          try {
            const { data, error } = await supabase.rpc("reserve_and_decrement_stock", {
              p_product_id: item.productId,
              p_quantity: item.quantity,
            });

            if (error) {
              // If RPC function is not yet created in Supabase SQL editor, fallback to productService
              await productService.decrementStock(item.productId, item.quantity);
            } else {
              const rpcResult = data as StockReservationResult;
              if (rpcResult && !rpcResult.success) {
                return fail(
                  rpcResult.error ||
                  `Stock insuficiente para "${item.productName}". Por favor actualiza tu carrito.`
                );
              }
            }
          } catch {
            await productService.decrementStock(item.productId, item.quantity);
          }
        } else {
          // Fallback for non-UUID mock items or local state
          await productService.decrementStock(item.productId, item.quantity);
        }
      }

      // ── Step 2: Generate invoice via Factus API ───────────────────────────────
      const factusPayload = {
        customer: {
          identification: params.customer.identification,
          names: params.customer.names,
          address: params.customer.address,
          email: params.customer.email,
          phone: params.customer.phone,
          municipality_id: params.customer.municipalityCode,
        },
        items: params.items.map((item) => ({
          id: item.productId,
          name: item.productName,
          quantity: item.quantity,
          price: item.productPrice,
        })),
        paymentMethod: params.paymentMethod,
      };

      const res = await axios.post("/api/factus/invoice", factusPayload);
      if (!res.data?.success || !res.data?.invoice) {
        return fail(res.data?.error || "Error al generar el comprobante de pago");
      }

      const invoiceData = res.data.invoice as IssuedInvoiceResult;

      // ── Step 3: Persist Order in Supabase ─────────────────────────────────────
      const orderRes = await orderRepository.create({
        userId: params.userId,
        customer: params.customer,
        items: params.items,
        status: "completed",
        paymentMethod: params.paymentMethod,
        paymentStatus: "approved",
        subtotal,
        taxAmount,
        total,
      });

      const orderId = orderRes.success ? orderRes.data.id : `ORD-${Date.now()}`;

      // ── Step 4: Persist Invoice in Supabase ───────────────────────────────────
      await orderRepository.saveInvoice({
        orderId,
        factusNumber: invoiceData.number,
        referenceCode: invoiceData.reference_code,
        cufe: invoiceData.cufe,
        isValidated: invoiceData.is_validated ?? true,
        validatedAt: invoiceData.validated_at,
        qrUrl: invoiceData.links?.qr,
        publicUrl: invoiceData.links?.public_url,
        total,
        customerName: params.customer.names,
        customerEmail: params.customer.email,
        customerIdentification: params.customer.identification,
      });

      return ok(invoiceData);
    } catch (e: unknown) {
      const axiosErr = e as { response?: { data?: { error?: string } }; message?: string };
      const message =
        axiosErr.response?.data?.error ||
        axiosErr.message ||
        "Error en el proceso de compra. Por favor intenta de nuevo.";
      return fail(message);
    }
  }

  /**
   * Downloads invoice PDF in base64 (admin-only feature)
   */
  async downloadInvoicePDF(invoiceNumber: string): Promise<Result<string>> {
    try {
      const res = await axios.get(`/api/factus/pdf/${invoiceNumber}`);
      if (res.data?.pdf) {
        return ok(res.data.pdf);
      }
      return fail("No se encontró el comprobante PDF");
    } catch (e) {
      return fail(e instanceof Error ? e.message : "Error al descargar el comprobante");
    }
  }

  /**
   * Retrieves all invoices for the Admin panel
   */
  async getAllInvoices() {
    return orderRepository.findAllInvoices();
  }
}

export const billingService = new BillingService();
