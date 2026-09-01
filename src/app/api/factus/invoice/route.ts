import { NextResponse } from "next/server";
import { createInvoice, getNumberingRanges } from "@/lib/factus";
import type { CreateInvoicePayload, FactusInvoiceItem } from "@/lib/factus";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, items, paymentMethod } = body;

    // Obtener rango de numeración disponible
    let numberingRangeId = 1;
    try {
      const ranges = await getNumberingRanges();
      if (ranges && ranges.length > 0) {
        numberingRangeId = ranges[0].id;
      }
    } catch {
      // Usar default si falla
    }

    // Construir referencia única
    const referenceCode = `ECO-${Date.now()}`;

    // Mapear items del carrito a formato Factus
    const factusItems: FactusInvoiceItem[] = items.map(
      (item: {
        id: string;
        name: string;
        quantity: number;
        price: number;
      }) => ({
        code_reference: item.id,
        name: item.name,
        quantity: item.quantity,
        discount_rate: 0,
        price: item.price,
        tax_rate: "19.00",
        unit_measure_id: 70,
        standard_code_id: 27,
        is_excluded: 0,
        tribute_id: 1,
        withholding_taxes: [],
      })
    );

    const payload: CreateInvoicePayload = {
      numbering_range_id: numberingRangeId,
      reference_code: referenceCode,
      observation: "Factura electrónica generada desde TechStore",
      payment_method_code: paymentMethod || "10",
      customer: {
        identification: customer.identification,
        names: customer.names,
        address: customer.address,
        email: customer.email,
        phone: customer.phone,
        legal_organization_id: "2",
        tribute_id: "21",
        identification_document_id: "3",
        municipality_id: customer.municipality_id || "980",
      },
      items: factusItems,
    };

    const invoice = await createInvoice(payload);

    return NextResponse.json({ success: true, invoice });
  } catch (error: unknown) {
    console.error("[FACTUS] Error creando factura:", error);
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    const axiosError = error as { response?: { data?: unknown } };
    return NextResponse.json(
      {
        success: false,
        error: message,
        details: axiosError?.response?.data,
      },
      { status: 500 }
    );
  }
}
