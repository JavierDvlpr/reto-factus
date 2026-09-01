/**
 * Billing Application Service — Orchestrates electronic invoicing,
 * order creation, stock decrement, and invoice persistence.
 */

import axios from "axios";
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

export class BillingService {
  /**
   * Complete purchase & electronic invoice generation:
   * 1. Generates DIAN invoice via Factus API
   * 2. Decrements product stock in DB
   * 3. Saves Order and Invoice in Supabase
   */
  async issueInvoice(params: CreateInvoiceParams): Promise<Result<IssuedInvoiceResult>> {
    try {
      const subtotal = params.items.reduce((s, i) => s + i.productPrice * i.quantity, 0);
      const taxAmount = subtotal * 0.19;
      const total = subtotal + taxAmount;

      // 1. Call Factus API endpoint
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
        return fail(res.data?.error || "Error al emitir factura en Factus");
      }

      const invoiceData = res.data.invoice as IssuedInvoiceResult;

      // 2. Decrement stock for all items
      for (const item of params.items) {
        await productService.decrementStock(item.productId, item.quantity);
      }

      // 3. Persist Order in Supabase
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

      // 4. Persist Invoice in Supabase
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
        "Error en el proceso de facturación electrónica";
      return fail(message);
    }
  }

  /**
   * Downloads invoice PDF in base64
   */
  async downloadInvoicePDF(invoiceNumber: string): Promise<Result<string>> {
    try {
      const res = await axios.get(`/api/factus/pdf/${invoiceNumber}`);
      if (res.data?.pdf) {
        return ok(res.data.pdf);
      }
      return fail("No se encontró el contenido del PDF");
    } catch (e) {
      return fail(e instanceof Error ? e.message : "Error al descargar PDF");
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
