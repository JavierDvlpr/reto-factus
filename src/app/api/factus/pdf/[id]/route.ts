import { NextResponse } from "next/server";
import { downloadInvoicePDF } from "@/lib/factus";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await downloadInvoicePDF(id);
    return NextResponse.json({
      success: true,
      pdf: data.pdf_base_64_encoded,
      fileName: data.file_name,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error descargando PDF";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
