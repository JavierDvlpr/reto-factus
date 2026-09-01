import { NextResponse } from "next/server";
import { downloadInvoicePDF } from "@/lib/factus";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pdfBase64 = await downloadInvoicePDF(Number(id));
    return NextResponse.json({ success: true, pdf: pdfBase64 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error descargando PDF";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
