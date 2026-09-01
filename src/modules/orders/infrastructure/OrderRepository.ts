/**
 * Order Repository — Persists orders in Supabase.
 * Falls back to in-memory for local mode.
 */

import { supabase, isSupabaseConfigured } from "@/core/database/supabase";
import type { OrderProps } from "../domain/Order";
import type { Result } from "@/core/types";
import { ok, fail } from "@/core/types";

export class OrderRepository {
  async create(props: OrderProps): Promise<Result<{ id: string }>> {
    if (!isSupabaseConfigured()) {
      // Return a mock ID for local mode
      const mockId = `local-${Date.now()}`;
      return ok({ id: mockId });
    }
    try {
      const orderPayload: Record<string, unknown> = {
        user_id: props.userId ?? null,
        customer_name: props.customer.names,
        customer_email: props.customer.email,
        customer_phone: props.customer.phone,
        customer_identification: props.customer.identification,
        customer_address: props.customer.address,
        municipality_code: props.customer.municipalityCode,
        status: "completed",
        payment_method: props.paymentMethod,
        payment_status: "approved",
        subtotal: props.subtotal,
        tax_amount: props.taxAmount,
        total: props.total,
        notes: props.notes ?? null,
      };

      const { data: order, error } = await supabase
        .from("orders")
        .insert([orderPayload])
        .select("id")
        .single();

      if (error) return fail(error.message);
      if (!order) return fail("No se pudo crear la orden");

      // Insert order items
      const itemsPayload = props.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        product_price: item.productPrice,
        quantity: item.quantity,
        subtotal: item.subtotal,
      }));

      await supabase.from("order_items").insert(itemsPayload);

      return ok({ id: order.id });
    } catch (e) {
      return fail(e instanceof Error ? e.message : "Error al guardar orden");
    }
  }

  async findAll(): Promise<OrderProps[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      return (data ?? []).map((row: Record<string, any>) => ({
        id: row.id,
        userId: row.user_id,
        customer: {
          names: row.customer_name,
          email: row.customer_email,
          phone: row.customer_phone,
          identification: row.customer_identification,
          address: row.customer_address,
          municipalityCode: row.municipality_code,
        },
        items: (row.order_items ?? []).map((i: Record<string, any>) => ({
          productId: i.product_id,
          productName: i.product_name,
          productPrice: Number(i.product_price),
          quantity: Number(i.quantity),
          subtotal: Number(i.subtotal),
        })),
        status: row.status,
        paymentMethod: row.payment_method,
        paymentStatus: row.payment_status,
        subtotal: Number(row.subtotal),
        taxAmount: Number(row.tax_amount),
        total: Number(row.total),
        notes: row.notes,
        createdAt: row.created_at,
      }));
    } catch {
      return [];
    }
  }

  async markCompleted(orderId: string): Promise<Result<void>> {
    if (!isSupabaseConfigured()) return ok(undefined);
    const { error } = await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("id", orderId);
    if (error) return fail(error.message);
    return ok(undefined);
  }

  async saveInvoice(data: {
    orderId: string;
    factusNumber: string;
    referenceCode: string;
    cufe: string;
    isValidated: boolean;
    validatedAt?: string | null;
    qrUrl?: string | null;
    publicUrl?: string | null;
    total: number;
    customerName: string;
    customerEmail: string;
    customerIdentification: string;
  }): Promise<Result<void>> {
    if (!isSupabaseConfigured()) return ok(undefined);
    try {
      const invoicePayload: Record<string, unknown> = {
        order_id: data.orderId,
        factus_number: data.factusNumber,
        reference_code: data.referenceCode,
        cufe: data.cufe,
        is_validated: data.isValidated,
        validated_at: data.validatedAt ?? null,
        qr_url: data.qrUrl ?? null,
        public_url: data.publicUrl ?? null,
        total: data.total,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_identification: data.customerIdentification,
      };

      const { error } = await supabase.from("invoices").insert([invoicePayload]);
      if (error) return fail(error.message);
      return ok(undefined);
    } catch (e) {
      return fail(e instanceof Error ? e.message : "Error al guardar factura");
    }
  }

  async findAllInvoices(): Promise<Array<Record<string, any>>> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });
      return data ?? [];
    } catch {
      return [];
    }
  }
}

export const orderRepository = new OrderRepository();
