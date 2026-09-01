import { NextResponse } from "next/server";
import { createInvoice, getNumberingRanges, deleteUnvalidatedInvoice } from "@/lib/factus";
import type { CreateInvoicePayloadV2, FactusInvoiceItemV2 } from "@/lib/factus";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, items, paymentMethod } = body;

    // Calcular montos
    let totalTaxable = 0;
    const factusItems: FactusInvoiceItemV2[] = items.map(
      (item: {
        id: string;
        name: string;
        quantity: number;
        price: number;
      }) => {
        const itemGross = item.price * item.quantity;
        totalTaxable += itemGross;
        return {
          code_reference: `PROD-${item.id}`,
          name: item.name.slice(0, 100),
          quantity: item.quantity.toFixed(2),
          discount_rate: "0.00",
          price: item.price.toFixed(2),
          unit_measure_code: "94", // 94 = Unidad
          standard_code: "999",    // 999 = Estándar propio
          taxes: [
            {
              code: "01",          // 01 = IVA
              rate: "19.00",
            },
          ],
        };
      }
    );

    const totalTax = totalTaxable * 0.19;
    const totalAmount = totalTaxable + totalTax;
    const referenceCode = `ECO-${Date.now()}`;

    // Buscar rango de numeración para Factura de Venta
    let numberingRangeId: number | undefined = undefined;
    try {
      const ranges = await getNumberingRanges();
      const ventaRange = ranges.find(
        (r: { document?: string; prefix?: string }) =>
          r.document === "Factura de Venta" || r.prefix === "SETP"
      );
      if (ventaRange) {
        numberingRangeId = ventaRange.id;
      }
    } catch {
      // Usar default de Factus si no se obtiene
    }

    const payload: CreateInvoicePayloadV2 = {
      reference_code: referenceCode,
      document: "01",
      numbering_range_id: numberingRangeId || 389,
      operation_type: "10",
      observation: "Compra en línea TechStore CO - Reto Factus",
      payment_details: [
        {
          payment_form: "1", // Contado
          payment_method_code: paymentMethod || "10",
          reference_code: `PAG-${Date.now()}`,
          amount: totalAmount.toFixed(2),
        },
      ],
      cash_rounding_amount: "0.00",
      customer: {
        identification_document_code: customer.identification?.length > 10 ? "31" : "13", // NIT o CC
        identification: customer.identification,
        names: customer.names,
        address: customer.address,
        email: customer.email,
        phone: customer.phone,
        legal_organization_code: "2", // Persona Natural
        tribute_code: "ZZ",
        country_code: "CO",
        responsibilities: ["R-99-PN"],
        municipality_code: customer.municipality_id || "11001",
      },
      items: factusItems,
    };

    let invoice;
    try {
      invoice = await createInvoice(payload);
    } catch (firstErr: unknown) {
      const axiosErr = firstErr as { response?: { status?: number; data?: unknown } };
      if (axiosErr?.response?.status === 409) {
        try {
          await deleteUnvalidatedInvoice(referenceCode);
        } catch {
          // Ignorar
        }
        payload.reference_code = `ECO-${Date.now()}-R`;
        invoice = await createInvoice(payload);
      } else {
        throw firstErr;
      }
    }

    return NextResponse.json({ success: true, invoice });
  } catch (error: unknown) {
    console.error("[FACTUS] Error creando factura:", error);
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    const axiosError = error as { response?: { data?: unknown; status?: number } };
    return NextResponse.json(
      {
        success: false,
        error: message,
        details: axiosError?.response?.data,
      },
      { status: axiosError?.response?.status || 500 }
    );
  }
}
